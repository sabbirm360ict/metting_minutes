import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';

export default class AdminUtils {
  private sampleRate: number = 16000;

  async convertToWav(inputPath: string, outputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!ffmpegPath) {
        return reject(
          new Error('ffmpeg-static could not find the ffmpeg binary.')
        );
      }
      ffmpeg.setFfmpegPath(ffmpegPath);
      ffmpeg(inputPath)
        .audioFrequency(this.sampleRate)
        .audioChannels(1)
        .format('wav')
        .save(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err));
    });
  }
}
