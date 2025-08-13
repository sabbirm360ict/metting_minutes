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
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("../../../utils/config/config"));
const form_data_1 = __importDefault(require("form-data"));
const customError_1 = __importDefault(require("../../../utils/lib/customError"));
const path_1 = __importDefault(require("path"));
const admin_utils_1 = __importDefault(require("../utils/admin.utils"));
class AdminServices extends abstract_services_1.default {
    constructor() {
        super();
    }
    // Transcribe;
    transcribe(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = new form_data_1.default();
            formData.append('file', fs_1.default.createReadStream(filePath), {
                filename: 'audio.wav',
                contentType: 'audio/wav',
            });
            formData.append('model', 'whisper-1');
            const res = yield fetch('https://api.openai.com/v1/audio/transcriptions', {
                method: 'POST',
                headers: { Authorization: `Bearer ${config_1.default.OPENAI_API_KEY}` },
                body: formData,
            });
            const data = yield res.json();
            return data.text;
        });
    }
    // Translate;
    translateBanglaToEnglish(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch('https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-bn-en', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${config_1.default.HUGGING_FACE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputs: text }),
            });
            const data = yield response.json();
            if (data.error)
                throw new Error(data.error);
            return data[0].translation_text;
        });
    }
    isBangla(text) {
        return /[\u0980-\u09FF]/.test(text);
    }
    // Summarize English;
    summarizeEnglish(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${config_1.default.HUGGING_FACE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputs: text }),
            });
            const data = yield response.json();
            if (data.error)
                throw new Error(data.error);
            return data[0].summary_text;
        });
    }
    // Process The Audio And Give Result
    processAudio(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = req.file;
            if (!file)
                throw new customError_1.default('Please provide a file', this.StatusCode.HTTP_BAD_REQUEST);
            const originalPath = path_1.default.join(file.destination, file.filename);
            const wavPath = path_1.default.join('uploads', `${file.filename}.wav`);
            console.log({ originalPath, wavPath });
            try {
                // Convert to WAV
                yield new admin_utils_1.default().convertToWav(originalPath, wavPath);
                // Transcribe
                let transcript = yield this.transcribe(wavPath);
                // Translate if Bangla
                if (this.isBangla(transcript)) {
                    transcript = yield this.translateBanglaToEnglish(transcript);
                }
                // Summarize in English
                const summary = yield this.summarizeEnglish(transcript);
                // Cleanup
                fs_1.default.unlinkSync(originalPath);
                fs_1.default.unlinkSync(wavPath);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: { summary },
                };
            }
            finally {
                fs_1.default.unlinkSync(originalPath);
            }
        });
    }
}
exports.default = AdminServices;
