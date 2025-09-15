import { Request } from 'express';
import fs from 'fs-extra';
import OpenAI from 'openai';
import path from 'path';
import AbstractServices from '../../../abstract/abstract.services';
import config from '../../../utils/config/config';
import CustomError from '../../../utils/lib/customError';
import ffmpeg from 'fluent-ffmpeg';

export default class AdminServices extends AbstractServices {
  private openai: OpenAI;
  constructor() {
    super();

    this.openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });
  }

  public prepareAudio = async (
    filePath: string,
    chunkDurationSec: number = 1800
  ) => {
    const chunksDir = path.join('uploads', 'chunks');
    await fs.ensureDir(chunksDir);
    await fs.emptyDir(chunksDir);

    // Compress to mono 16kHz MP3
    const compressedPath = path.join('uploads', 'compressed.mp3');
    await new Promise((resolve, reject) => {
      ffmpeg(filePath)
        .audioCodec('libmp3lame')
        .audioChannels(1)
        .audioFrequency(16000)
        .format('mp3')
        .save(compressedPath)
        .on('end', resolve)
        .on('error', reject);
    });

    // Split into chunks
    return new Promise<string[]>((resolve, reject) => {
      ffmpeg(compressedPath)
        .output(path.join(chunksDir, 'chunk_%03d.mp3'))
        .audioCodec('copy')
        .format('mp3')
        .outputOptions([`-f segment`, `-segment_time ${chunkDurationSec}`])
        .on('end', async () => {
          const files = (await fs.readdir(chunksDir))
            .map((f) => path.join(chunksDir, f))
            .sort();
          resolve(files);
        })
        .on('error', reject)
        .run();
    });
  };

  public processAudio = async (req: Request) => {
    const file = req.file as Express.Multer.File;
    if (!file) {
      throw new CustomError(`Upload a file`, this.StatusCode.HTTP_NOT_FOUND);
    }

    const filePath = file.path;

    console.log(`Received file path: ${filePath}`);

    const transcription = await this.openai.audio.transcriptions.create({
      file: fs.createReadStream(file.path),
      model: 'whisper-1',
    });

    fs.unlinkSync(file.path); // delete after processing

    console.log({ transcription });

    const transcriptionText = transcription.text;

    // Optional: summarize with GPT-4o-mini
    const summaryResp = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You summarize meeting transcripts into professional minutes with Agenda, Key Points, Decisions, and Action Items.',
        },
        { role: 'user', content: `Transcript:\n\n${transcriptionText}` },
      ],
    });

    const meetingMinutes = summaryResp.choices[0].message.content;

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
      data: { transcript: transcriptionText, meetingMinutes, transcription },
    };
  };
}
