import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import AuthChecker from '../middleware/authChecker/authChecker';
import ErrorHandler from '../middleware/errorHandler/errorHandler';
import { origin } from '../utils/miscellaneous/constants';
import { loading } from '../utils/templates/templates';
import RootRouter from './router';

class App {
  public app: Application;
  private port: number;
  private origin: string[] = origin;
  private authChecker = new AuthChecker();

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.initMiddleware();
    this.initRouter();
    this.modulesRouter();
    this.notFoundRouter();
    this.handleError();
  }

  public listenServer() {
    this.app.listen(this.port, () => {
      console.log(`server is listening at http://localhost:${this.port}`);
    });
  }

  private initMiddleware() {
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan('dev'));
    this.app.use(cors({ origin: this.origin, credentials: true }));
  }

  private initRouter() {
    this.app.get('/', (_req: Request, res: Response) => {
      res.send(loading);
    });
  }

  private modulesRouter() {
    /**
     * @auth checker
     */
    // this.app.use(this.authChecker.check);

    this.app.use('/api/v1', new RootRouter().v1Router);
  }

  private notFoundRouter() {
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        error: {
          type: 'RouteNotFound',
          message: 'The requested route does not exist.',
          status: 404,
        },
      });
    });
  }

  private handleError() {
    this.app.use(new ErrorHandler().handleError);
  }
}
export default App;
