import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

export default class AdminUtils {
  private sampleRate: number = 16000;

  public async convertToWav(
    inputPath: string,
    outputPath: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      // Make sure ffmpeg path is set
      ffmpeg.setFfmpegPath(ffmpegPath as string);

      // Resolve absolute paths
      const absInput = path.resolve(inputPath);
      const absOutput = path.resolve(outputPath);

      // Check if input file exists
      if (!fs.existsSync(absInput)) {
        return reject(new Error(`Input file not found: ${absInput}`));
      }

      // Ensure output folder exists
      const outputDir = path.dirname(absOutput);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      ffmpeg(absInput)
        .audioFrequency(this.sampleRate)
        .audioChannels(1)
        .format('wav')
        .on('end', () => resolve(absOutput))
        .on('error', (err) => reject(err))
        .save(absOutput);
    });
  }
}
