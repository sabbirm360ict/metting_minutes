import { NextFunction, Request, Response } from 'express';
import CustomError from '../../utils/lib/customError';

interface IcustomError {
  success: boolean;
  message: string;
  status?: number;
}

class ErrorHandler {
  constructor() {}

  public async handleError(
    err: Error | CustomError,
    req: Request,
    res: Response,
    _next: NextFunction
  ) {
    const customError: IcustomError = {
      success: false,
      message: `Something want's wrong please try again later`,
      status: 500,
    };

    if (err instanceof CustomError) {
      customError.message =
        err.message || `Something went wrong, please try again later!`;
      customError.status = err.status;
    } else {
      customError.message = `Something went wrong, please try again later!`;
    }

    res.status(customError.status || 500).json(customError);
  }
}

export default ErrorHandler;
