import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

export default class AdminUtils {
  private static sampleRate = 16000;

  static convertToWav(inputPath: string, outputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(inputPath)) {
        return reject(new Error(`Input file not found: ${inputPath}`));
      }

      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      ffmpeg(inputPath)
        .audioFrequency(this.sampleRate)
        .audioChannels(1)
        .format('wav')
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .save(outputPath);
    });
  }
}
