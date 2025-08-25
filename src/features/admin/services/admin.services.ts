import AbstractServices from '../../../abstract/abstract.services';
import fs from 'fs';
import config from '../../../utils/config/config';
import FormData from 'form-data';
import { Request } from 'express';
import CustomError from '../../../utils/lib/customError';
import path from 'path';
import AdminUtils from '../utils/admin.utils';
import Ffmpeg from 'fluent-ffmpeg';
import { spawn } from 'child_process';

interface ProcessedFile extends Express.Multer.File {}

interface WhisperResult {
  text: string;
  segments?: Array<{
    start: number;
    end: number;
    text: string;
  }>;
}

interface SentenceScore {
  sentence: string;
  score: number;
}

interface MeetingSummaryResult {
  detectedLanguage: string;
  transcript: string;
  summary: string;
  actionItems: string[];
  metadata: {
    originalFilename: string;
    fileSize: number;
    processingTime: string;
  };
}

interface ApiResponse {
  success: boolean;
  results?: MeetingSummaryResult;
  error?: string;
  message?: string;
}

class AdminServices extends AbstractServices {
  constructor() {
    super();
  }

  extractAudio(inputPath: string, outputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      Ffmpeg(inputPath)
        .output(outputPath)
        .audioCodec('pcm_s16le')
        .audioFrequency(16000)
        .audioChannels(1)
        .on('end', () => resolve(outputPath))
        .on('error', (err: Error) => reject(err))
        .run();
    });
  }

  // Transcribe audio using OpenAI Whisper (free, local)
  transcribeWithWhisper(
    audioPath: string,
    language: string = 'auto'
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      // Ensure transcripts directory exists
      const transcriptsDir = './transcripts';
      if (!fs.existsSync(transcriptsDir)) {
        fs.mkdirSync(transcriptsDir, { recursive: true });
      }

      // Using whisper command line tool
      const whisperArgs: string[] = [
        audioPath,
        '--language',
        language === 'auto' ? 'auto' : language,
        '--model',
        'base', // You can use tiny, base, small, medium, large
        '--output_format',
        'json',
        '--output_dir',
        './transcripts',
      ];

      const whisperProcess = spawn('whisper', whisperArgs);

      let output = '';
      let errorOutput = '';

      whisperProcess.stdout.on('data', (data: Buffer) => {
        output += data.toString();
      });

      whisperProcess.stderr.on('data', (data: Buffer) => {
        errorOutput += data.toString();
      });

      whisperProcess.on('close', (code: number | null) => {
        if (code === 0) {
          try {
            // Read the generated JSON file
            const baseName = path.basename(audioPath, path.extname(audioPath));
            const jsonPath = `./transcripts/${baseName}.json`;

            if (fs.existsSync(jsonPath)) {
              const transcriptData: WhisperResult = JSON.parse(
                fs.readFileSync(jsonPath, 'utf8')
              );
              resolve(transcriptData.text);
            } else {
              // Fallback to text file
              const textPath = `./transcripts/${baseName}.txt`;
              if (fs.existsSync(textPath)) {
                const text = fs.readFileSync(textPath, 'utf8');
                resolve(text);
              } else {
                reject(new Error('No transcript file generated'));
              }
            }
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error(`Whisper failed: ${errorOutput}`));
        }
      });
    });
  }

  // Simple extractive summarization (free alternative)
  extractiveSummarize(text: string, maxSentences: number = 3): string {
    const sentences: string[] = text
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 10);

    if (sentences.length <= maxSentences) {
      return sentences.join('. ');
    }

    // Simple scoring based on word frequency
    const words: string[] = text.toLowerCase().match(/\w+/g) || [];
    const wordFreq: Record<string, number> = {};

    words.forEach((word: string) => {
      if (word.length > 3) {
        // Ignore short words
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    // Score sentences
    const sentenceScores: SentenceScore[] = sentences.map(
      (sentence: string) => {
        const sentenceWords: string[] =
          sentence.toLowerCase().match(/\w+/g) || [];
        const score: number = sentenceWords.reduce(
          (sum: number, word: string) => {
            return sum + (wordFreq[word] || 0);
          },
          0
        );
        return { sentence: sentence.trim(), score };
      }
    );

    // Get top sentences
    const topSentences: SentenceScore[] = sentenceScores
      .sort((a: SentenceScore, b: SentenceScore) => b.score - a.score)
      .slice(0, maxSentences)
      .sort(
        (a: SentenceScore, b: SentenceScore) =>
          sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence)
      );

    return topSentences.map((s: SentenceScore) => s.sentence).join('. ');
  }

  // Extract action items using keyword matching
  extractActionItems(text: string): string[] {
    const actionKeywords: string[] = [
      'action item',
      'todo',
      'task',
      'assign',
      'responsible',
      'deadline',
      'due date',
      'follow up',
      'next step',
      'will do',
      'needs to',
      'should',
      'must complete',
    ];

    const sentences: string[] = text.split(/[.!?]+/);
    const actionItems: string[] = [];

    sentences.forEach((sentence: string) => {
      const lowerSentence: string = sentence.toLowerCase();
      if (
        actionKeywords.some((keyword: string) =>
          lowerSentence.includes(keyword)
        )
      ) {
        actionItems.push(sentence.trim());
      }
    });

    return actionItems;
  }

  // Detect language (simple approach)
  detectLanguage(text: string): string {
    const banglaChars = /[\u0980-\u09FF]/;
    const englishChars = /[a-zA-Z]/;

    const banglaCount: number = (text.match(banglaChars) || []).length;
    const englishCount: number = (text.match(englishChars) || []).length;

    if (banglaCount > englishCount) {
      return 'bn'; // Bangla
    } else {
      return 'en'; // English
    }
  }

  cleanupFiles(filePaths: string[]): void {
    filePaths.forEach((filePath: string) => {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.error(`Failed to cleanup file ${filePath}:`, error);
      }
    });
  }

  public processAudio = async (req: Request) => {
    const file = req.file as ProcessedFile;

    if (!file) {
      throw new CustomError('No file uploaded', this.StatusCode.HTTP_NOT_FOUND);
    }

    const inputPath: string = file.path;
    const audioPath: string = inputPath.replace(/\.[^/.]+$/, '.wav');

    console.log('Processing file:', file.originalname);

    // Step 1: Extract audio if it's a video file
    if (file.mimetype.startsWith('video/')) {
      console.log('Extracting audio from video...');
      await this.extractAudio(inputPath, audioPath);
    } else {
      // If it's already audio, copy to expected format
      fs.copyFileSync(inputPath, audioPath);
    }

    // Step 2: Transcribe audio
    console.log('Transcribing audio...');
    const transcript: string = await this.transcribeWithWhisper(audioPath);

    // Step 3: Detect language
    const detectedLanguage: string = this.detectLanguage(transcript);

    // Step 4: Generate summary
    console.log('Generating summary...');
    const summary: string = this.extractiveSummarize(transcript, 5);

    // Step 5: Extract action items
    const actionItems: string[] = this.extractActionItems(transcript);

    // Step 6: Clean up files
    this.cleanupFiles([inputPath, audioPath]);

    // Return results
    const response = {
      success: true,
      results: {
        detectedLanguage,
        transcript,
        summary,
        actionItems,
        metadata: {
          originalFilename: file.originalname,
          fileSize: file.size,
          processingTime: new Date().toISOString(),
        },
      },
    };

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
      data: response,
    };
  };
}
export default AdminServices;
