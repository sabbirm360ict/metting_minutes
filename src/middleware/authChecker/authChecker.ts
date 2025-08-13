import { NextFunction, Request, Response } from 'express';
import config from '../../utils/config/config';
import Lib from '../../utils/lib/lib';
import ResMsg from '../../utils/miscellaneous/responseMessage';
import StatusCode from '../../utils/miscellaneous/statusCode';

class AuthChecker {
  public check = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization, countryid } = req.headers;

    if (!authorization) {
      return res
        .status(StatusCode.HTTP_UNAUTHORIZED)
        .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    }

    const authSplit = authorization.split(' ');

    if (authSplit.length !== 2) {
      return res
        .status(StatusCode.HTTP_UNAUTHORIZED)
        .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    }

    const verify = (await Lib.verifyUser(
      authSplit[1],
      config.JWT_SECRET
    )) as any;

    if (!verify) {
      return res
        .status(StatusCode.HTTP_UNAUTHORIZED)
        .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    } else {
      req.user = { ...verify, country_id: Number(countryid) };
      next();
    }
  };
}
export default AuthChecker;
