"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assyncWrapper_1 = __importDefault(require("../middleware/assyncWrapper/assyncWrapper"));
const common_validator_1 = require("../utils/common/validators/common.validator");
const customError_1 = __importDefault(require("../utils/lib/customError"));
const responseMessage_1 = __importDefault(require("../utils/miscellaneous/responseMessage"));
const statusCode_1 = __importDefault(require("../utils/miscellaneous/statusCode"));
class AbstractControllers {
    constructor() {
        this.StatusCode = statusCode_1.default;
        this.asyncWrapper = new assyncWrapper_1.default();
        this.commonValidator = new common_validator_1.CommonValidator();
    }
    error(message, status) {
        throw new customError_1.default(message || responseMessage_1.default.HTTP_INTERNAL_SERVER_ERROR, status || statusCode_1.default.HTTP_INTERNAL_SERVER_ERROR);
    }
}
exports.default = AbstractControllers;
