import { Request } from 'express';
import AbstractServices from '../../../abstract/abstract.services';
import config from '../../../utils/config/config';
import CustomError from '../../../utils/lib/customError';
import MeetingMinutesGenerator, {
  MeetingMinutes,
} from '../utils/meetingMinutesGenerator.utils';
import fs from 'fs';

export default class AdminServices extends AbstractServices {
  private readonly apiKey: string;
  private readonly generator: MeetingMinutesGenerator;
  constructor() {
    super();

    this.apiKey = config.GEMINI_API_KEY;
    this.generator = new MeetingMinutesGenerator(this.apiKey);
  }

  public processAudio = async (req: Request) => {
    const file = req.file as Express.Multer.File;
    if (!file) {
      throw new CustomError(`Upload a file`, this.StatusCode.HTTP_NOT_FOUND);
    }

    const filePath = file.path;
    console.log(`Received file path: ${filePath}`);

    const meetingMinutes: MeetingMinutes = await this.generator.generateMinutes(
      filePath
    );

    // In a real application, you might also delete the file after processing
    fs.unlinkSync(filePath);

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
      data: meetingMinutes,
    };
  };
}
