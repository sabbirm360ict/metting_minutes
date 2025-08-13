import Wrapper from '../middleware/assyncWrapper/assyncWrapper';
import { CommonValidator } from '../utils/common/validators/common.validator';
import CustomError from '../utils/lib/customError';
import ResMsg from '../utils/miscellaneous/responseMessage';
import StatusCode from '../utils/miscellaneous/statusCode';

class AbstractControllers {
  protected asyncWrapper: Wrapper;
  protected commonValidator: CommonValidator;

  constructor() {
    this.asyncWrapper = new Wrapper();
    this.commonValidator = new CommonValidator();
  }

  protected StatusCode = StatusCode;

  protected error(message?: string, status?: number) {
    throw new CustomError(
      message || ResMsg.HTTP_INTERNAL_SERVER_ERROR,
      status || StatusCode.HTTP_INTERNAL_SERVER_ERROR
    );
  }
}
export default AbstractControllers;
