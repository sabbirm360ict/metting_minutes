"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonValidator = void 0;
const joi_1 = __importDefault(require("joi"));
class CommonValidator {
    constructor() {
        this.singleParamValidator = (idFieldName = 'id') => {
            const schemaObject = {};
            schemaObject[idFieldName] = joi_1.default.number().integer().min(1).required();
            return joi_1.default.object(schemaObject);
        };
        this.singleParamStringValidator = (idFieldName = 'id') => {
            const schemaObject = {};
            schemaObject[idFieldName] = joi_1.default.string().required();
            return joi_1.default.object(schemaObject);
        };
    }
}
exports.CommonValidator = CommonValidator;
