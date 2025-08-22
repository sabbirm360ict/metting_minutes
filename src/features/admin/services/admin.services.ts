import AbstractServices from '../../../abstract/abstract.services';
import fs from 'fs';
import config from '../../../utils/config/config';
import FormData from 'form-data';
import { Request } from 'express';
import CustomError from '../../../utils/lib/customError';
import path from 'path';
import AdminUtils from '../utils/admin.utils';

class AdminServices extends AbstractServices {
  constructor() {
    super();
  }

  // Transcribe;
  async transcribe(filePath: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath), {
      filename: 'audio.wav',
      contentType: 'audio/wav',
    });
    formData.append('model', 'whisper-1');

    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.OPENAI_API_KEY}` },
      body: formData as any,
    });

    const data = await res.json();
    return data.text as string;
  }

  // Translate;
  async translateBanglaToEnglish(text: string): Promise<string> {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-bn-en',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: text }),
      }
    );

    const data = await response.json();
    if (data.error) throw new Error(data.error);

    return data[0].translation_text;
  }

  isBangla(text: string): boolean {
    return /[\u0980-\u09FF]/.test(text);
  }

  // Summarize English;
  async summarizeEnglish(text: string): Promise<string> {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: text }),
      }
    );

    const data = await response.json();
    if (data.error) throw new Error(data.error);

    return data[0].summary_text;
  }

  // Process The Audio And Give Result
  public async processAudio(req: Request) {
    const file = req.file as Express.Multer.File;

    if (!file)
      throw new CustomError(
        'Please provide a file',
        this.StatusCode.HTTP_BAD_REQUEST
      );

    const originalPath = path.join(file.destination, file.filename);
    const wavPath = path.join('uploads', `${file.filename}.wav`);
    console.log({ originalPath, wavPath });

    try {
      // Convert to WAV
      await new AdminUtils().convertToWav(originalPath, wavPath);

      // Transcribe
      let transcript = await this.transcribe(wavPath);

      // Translate if Bangla
      if (this.isBangla(transcript)) {
        transcript = await this.translateBanglaToEnglish(transcript);
      }

      // Summarize in English
      const summary = await this.summarizeEnglish(transcript);

      // Cleanup
      fs.unlinkSync(originalPath);
      fs.unlinkSync(wavPath);

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: this.ResMsg.HTTP_SUCCESSFUL,
        data: { summary },
      };
    } finally {
      fs.unlinkSync(originalPath);
      fs.unlinkSync(wavPath);
    }
  }
}
export default AdminServices;
