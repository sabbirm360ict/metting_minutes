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
const customError_1 = __importDefault(require("../../utils/lib/customError"));
class ErrorHandler {
    constructor() { }
    handleError(err, req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            const customError = {
                success: false,
                message: `Something want's wrong please try again later`,
                status: 500,
            };
            if (err instanceof customError_1.default) {
                customError.message =
                    err.message || `Something went wrong, please try again later!`;
                customError.status = err.status;
            }
            else {
                customError.message = `Something went wrong, please try again later!`;
            }
            res.status(customError.status || 500).json(customError);
        });
    }
}
exports.default = ErrorHandler;
