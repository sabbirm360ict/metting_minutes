"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_services_1 = __importDefault(require("../../../abstract/abstract.services"));
const fs_1 = __importDefault(require("fs"));
const customError_1 = __importDefault(require("../../../utils/lib/customError"));
const path_1 = __importDefault(require("path"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const child_process_1 = require("child_process");
class AdminServices extends abstract_services_1.default {
    constructor() {
        super();
        this.processAudio = (req) => __awaiter(this, void 0, void 0, function* () {
            const file = req.file;
            if (!file) {
                throw new customError_1.default('No file uploaded', this.StatusCode.HTTP_NOT_FOUND);
            }
            const inputPath = file.path;
            const audioPath = inputPath.replace(/\.[^/.]+$/, '.wav');
            console.log('Processing file:', file.originalname);
            // Step 1: Extract audio if it's a video file
            if (file.mimetype.startsWith('video/')) {
                console.log('Extracting audio from video...');
                yield this.extractAudio(inputPath, audioPath);
            }
            else {
                // If it's already audio, copy to expected format
                fs_1.default.copyFileSync(inputPath, audioPath);
            }
            // Step 2: Transcribe audio
            console.log('Transcribing audio...');
            const transcript = yield this.transcribeWithWhisper(audioPath);
            // Step 3: Detect language
            const detectedLanguage = this.detectLanguage(transcript);
            // Step 4: Generate summary
            console.log('Generating summary...');
            const summary = this.extractiveSummarize(transcript, 5);
            // Step 5: Extract action items
            const actionItems = this.extractActionItems(transcript);
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
        });
    }
    extractAudio(inputPath, outputPath) {
        return new Promise((resolve, reject) => {
            (0, fluent_ffmpeg_1.default)(inputPath)
                .output(outputPath)
                .audioCodec('pcm_s16le')
                .audioFrequency(16000)
                .audioChannels(1)
                .on('end', () => resolve(outputPath))
                .on('error', (err) => reject(err))
                .run();
        });
    }
    // Transcribe audio using OpenAI Whisper (free, local)
    transcribeWithWhisper(audioPath, language = 'auto') {
        return new Promise((resolve, reject) => {
            // Ensure transcripts directory exists
            const transcriptsDir = './transcripts';
            if (!fs_1.default.existsSync(transcriptsDir)) {
                fs_1.default.mkdirSync(transcriptsDir, { recursive: true });
            }
            // Using whisper command line tool
            const whisperArgs = [
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
            const whisperProcess = (0, child_process_1.spawn)('whisper', whisperArgs);
            let output = '';
            let errorOutput = '';
            whisperProcess.stdout.on('data', (data) => {
                output += data.toString();
            });
            whisperProcess.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });
            whisperProcess.on('close', (code) => {
                if (code === 0) {
                    try {
                        // Read the generated JSON file
                        const baseName = path_1.default.basename(audioPath, path_1.default.extname(audioPath));
                        const jsonPath = `./transcripts/${baseName}.json`;
                        if (fs_1.default.existsSync(jsonPath)) {
                            const transcriptData = JSON.parse(fs_1.default.readFileSync(jsonPath, 'utf8'));
                            resolve(transcriptData.text);
                        }
                        else {
                            // Fallback to text file
                            const textPath = `./transcripts/${baseName}.txt`;
                            if (fs_1.default.existsSync(textPath)) {
                                const text = fs_1.default.readFileSync(textPath, 'utf8');
                                resolve(text);
                            }
                            else {
                                reject(new Error('No transcript file generated'));
                            }
                        }
                    }
                    catch (error) {
                        reject(error);
                    }
                }
                else {
                    reject(new Error(`Whisper failed: ${errorOutput}`));
                }
            });
        });
    }
    // Simple extractive summarization (free alternative)
    extractiveSummarize(text, maxSentences = 3) {
        const sentences = text
            .split(/[.!?]+/)
            .filter((s) => s.trim().length > 10);
        if (sentences.length <= maxSentences) {
            return sentences.join('. ');
        }
        // Simple scoring based on word frequency
        const words = text.toLowerCase().match(/\w+/g) || [];
        const wordFreq = {};
        words.forEach((word) => {
            if (word.length > 3) {
                // Ignore short words
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
        });
        // Score sentences
        const sentenceScores = sentences.map((sentence) => {
            const sentenceWords = sentence.toLowerCase().match(/\w+/g) || [];
            const score = sentenceWords.reduce((sum, word) => {
                return sum + (wordFreq[word] || 0);
            }, 0);
            return { sentence: sentence.trim(), score };
        });
        // Get top sentences
        const topSentences = sentenceScores
            .sort((a, b) => b.score - a.score)
            .slice(0, maxSentences)
            .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence));
        return topSentences.map((s) => s.sentence).join('. ');
    }
    // Extract action items using keyword matching
    extractActionItems(text) {
        const actionKeywords = [
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
        const sentences = text.split(/[.!?]+/);
        const actionItems = [];
        sentences.forEach((sentence) => {
            const lowerSentence = sentence.toLowerCase();
            if (actionKeywords.some((keyword) => lowerSentence.includes(keyword))) {
                actionItems.push(sentence.trim());
            }
        });
        return actionItems;
    }
    // Detect language (simple approach)
    detectLanguage(text) {
        const banglaChars = /[\u0980-\u09FF]/;
        const englishChars = /[a-zA-Z]/;
        const banglaCount = (text.match(banglaChars) || []).length;
        const englishCount = (text.match(englishChars) || []).length;
        if (banglaCount > englishCount) {
            return 'bn'; // Bangla
        }
        else {
            return 'en'; // English
        }
    }
    cleanupFiles(filePaths) {
        filePaths.forEach((filePath) => {
            try {
                if (fs_1.default.existsSync(filePath)) {
                    fs_1.default.unlinkSync(filePath);
                }
            }
            catch (error) {
                console.error(`Failed to cleanup file ${filePath}:`, error);
            }
        });
    }
}
exports.default = AdminServices;
