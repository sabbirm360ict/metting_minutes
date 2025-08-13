import Joi from 'joi';

export class CommonValidator {
  public singleParamValidator = (idFieldName: string = 'id') => {
    const schemaObject: any = {};
    schemaObject[idFieldName] = Joi.number().integer().min(1).required();
    return Joi.object(schemaObject);
  };

  public singleParamStringValidator = (idFieldName: string = 'id') => {
    const schemaObject: any = {};
    schemaObject[idFieldName] = Joi.string().required();
    return Joi.object(schemaObject);
  };
}
