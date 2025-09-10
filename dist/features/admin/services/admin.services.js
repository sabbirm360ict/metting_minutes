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
const fs_1 = __importDefault(require("fs"));
const abstract_services_1 = __importDefault(require("../../../abstract/abstract.services"));
const config_1 = __importDefault(require("../../../utils/config/config"));
const customError_1 = __importDefault(require("../../../utils/lib/customError"));
const openai_1 = __importDefault(require("openai"));
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
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
            const formData = new form_data_1.default();
            formData.append('file', fs_1.default.createReadStream(filePath));
            console.log({ formData });
            const response = yield axios_1.default.post('https://api-inference.huggingface.co/models/openai/whisper-small', formData, {
                headers: Object.assign({ Authorization: `Bearer ${config_1.default.HUGGING_FACE_API_KEY}` }, formData.getHeaders()),
            });
            fs_1.default.unlinkSync(filePath);
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
                data: response,
            };
        });
        this.openai = new openai_1.default({ apiKey: config_1.default.OPENAI_API_KEY });
    }
}
exports.default = AdminServices;
