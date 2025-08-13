import { db } from '../app/database';
import Models from '../app/models';
import ResMsg from '../utils/miscellaneous/responseMessage';
import StatusCode from '../utils/miscellaneous/statusCode';

abstract class AbstractServices {
  protected ResMsg = ResMsg;
  protected StatusCode = StatusCode;
  protected models = new Models(db);

  // insert exception error
  public async createException(
    endPoint: string | null = null,
    exceptionText: string | null = null,
    errorMsg: string | null = null,
    lineNumber: string | null = null
  ) {}
}
export default AbstractServices;
