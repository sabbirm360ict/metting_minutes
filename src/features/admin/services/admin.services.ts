import { spawn } from 'child_process';
import { Request } from 'express';
import fs from 'fs';
import AbstractServices from '../../../abstract/abstract.services';
import CustomError from '../../../utils/lib/customError';

export default class AdminServices extends AbstractServices {
  constructor() {
    super();
  }

  public processAudio = async (req: Request) => {
    const file = req.file as Express.Multer.File;
    if (!file) {
      throw new CustomError(`Upload a file`, this.StatusCode.HTTP_NOT_FOUND);
    }

    const filePath = file.path;

    // Run Python script
    const pythonProcess = spawn('python', ['summarize.py', filePath]);

    let summary = '';
    let errorMessage = '';

    // Capture stdout (summary)
    pythonProcess.stdout.on('data', (data) => {
      summary += data.toString();
    });

    // Capture stderr (errors)
    pythonProcess.stderr.on('data', (data) => {
      errorMessage += data.toString();
    });

    // Handle process completion
    pythonProcess.on('close', async (code) => {
      fs.unlinkSync(filePath);
    });
    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
    };
  };
}
