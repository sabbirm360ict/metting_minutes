import Joi from 'joi';
import AbstractServices from '../../abstract/abstract.services';
import { NextFunction, Request, Response } from 'express';
import CustomError from '../../utils/lib/customError';

type Func = (req: Request, res: Response, next: NextFunction) => Promise<void>;

type Validators = {
  bodySchema?: Joi.ObjectSchema<any>;
  parmSchema?: Joi.ObjectSchema<any>;
  querySchema?: Joi.ObjectSchema<any>;
};

class Wrapper extends AbstractServices {
  public wrap(schema: Validators | null, cb: Func) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { params, query, body } = req;

        if (schema) {
          if (schema.bodySchema) {
            const validateBody = await schema.bodySchema.validateAsync(body);
            req.body = validateBody;
          }
          if (schema.parmSchema) {
            const validateParam = await schema.parmSchema.validateAsync(params);
            req.params = validateParam;
          }
          if (schema.querySchema) {
            const validateQuery = await schema.querySchema.validateAsync(query);
            req.query = validateQuery;
          }
        }
        await cb(req, res, next);
      } catch (err: any) {
        console.log({ from: 'funcWrapper', err });
        if (err.isJoi) {
          next(
            new CustomError(
              err.message,
              this.StatusCode.HTTP_UNPROCESSABLE_ENTITY
            )
          );
        } else {
          await this.createException(
            req.baseUrl,
            'Error from async wrapper',
            err.message,
            err.line
          );
          next(new CustomError(err.message, err.status));
        }
      }
    };
  }
}
export default Wrapper;
