import { ITokenCred } from './src/features/authentication/interfaces/auth.interfaces';

declare global {
  namespace Express {
    interface Request {
      user: ITokenCred;
      upFiles: string[];
    }
  }
}
