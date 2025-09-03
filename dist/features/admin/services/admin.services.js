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
const abstract_services_1 = __importDefault(require("../../../abstract/abstract.services"));
const config_1 = __importDefault(require("../../../utils/config/config"));
const customError_1 = __importDefault(require("../../../utils/lib/customError"));
const meetingMinutesGenerator_utils_1 = __importDefault(require("../utils/meetingMinutesGenerator.utils"));
const fs_1 = __importDefault(require("fs"));
class AdminServices extends abstract_services_1.default {
    constructor() {
        super();
        this.processAudio = (req) => __awaiter(this, void 0, void 0, function* () {
            const file = req.file;
            if (!file) {
                throw new customError_1.default(`Upload a file`, this.StatusCode.HTTP_NOT_FOUND);
            }
            const filePath = file.path;
            console.log(`Received file path: ${filePath}`);
            const meetingMinutes = yield this.generator.generateMinutes(filePath);
            // In a real application, you might also delete the file after processing
            fs_1.default.unlinkSync(filePath);
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
                data: meetingMinutes,
            };
        });
        this.apiKey = config_1.default.GEMINI_API_KEY;
        this.generator = new meetingMinutesGenerator_utils_1.default(this.apiKey);
    }
}
exports.default = AdminServices;
