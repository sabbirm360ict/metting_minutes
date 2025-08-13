"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_services_1 = __importDefault(require("../../abstract/abstract.services"));
const customError_1 = __importDefault(require("../../utils/lib/customError"));
class Wrapper extends abstract_services_1.default {
    wrap(schema, cb) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { params, query, body } = req;
                if (schema) {
                    if (schema.bodySchema) {
                        const validateBody = yield schema.bodySchema.validateAsync(body);
                        req.body = validateBody;
                    }
                    if (schema.parmSchema) {
                        const validateParam = yield schema.parmSchema.validateAsync(params);
                        req.params = validateParam;
                    }
                    if (schema.querySchema) {
                        const validateQuery = yield schema.querySchema.validateAsync(query);
                        req.query = validateQuery;
                    }
                }
                yield cb(req, res, next);
            }
            catch (err) {
                console.log({ from: 'funcWrapper', err });
                if (err.isJoi) {
                    next(new customError_1.default(err.message, this.StatusCode.HTTP_UNPROCESSABLE_ENTITY));
                }
                else {
                    yield this.createException(req.baseUrl, 'Error from async wrapper', err.message, err.line);
                    next(new customError_1.default(err.message, err.status));
                }
            }
        });
    }
}
exports.default = Wrapper;
