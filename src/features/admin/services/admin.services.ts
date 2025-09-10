import { Request } from 'express';
import fs from 'fs';
import AbstractServices from '../../../abstract/abstract.services';
import config from '../../../utils/config/config';
import CustomError from '../../../utils/lib/customError';
import OpenAI from 'openai';
import axios from 'axios';
import FormData from 'form-data';

export default class AdminServices extends AbstractServices {
  private openai: OpenAI;
  constructor() {
    super();

    this.openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });
  }

  public processAudio = async (req: Request) => {
    const file = req.file as Express.Multer.File;
    if (!file) {
      throw new CustomError(`Upload a file`, this.StatusCode.HTTP_NOT_FOUND);
    }

    const filePath = file.path;
    console.log(`Received file path: ${filePath}`);

    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    console.log({ formData });

    const response = await axios.post(
      'https://api-inference.huggingface.co/models/openai/whisper-small',
      formData,
      {
        headers: {
          Authorization: `Bearer ${config.HUGGING_FACE_API_KEY}`,
          ...formData.getHeaders(),
        },
      }
    );

    fs.unlinkSync(filePath);

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
      data: response,
    };
  };
}
