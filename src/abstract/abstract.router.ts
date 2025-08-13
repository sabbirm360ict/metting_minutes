import { Router } from 'express';
import FileFolders from '../utils/miscellaneous/fileFolders';

abstract class AbstractRouter {
  public router = Router();
  public fileFolders = FileFolders;
}
export default AbstractRouter;
