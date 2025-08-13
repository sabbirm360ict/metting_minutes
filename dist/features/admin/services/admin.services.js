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
class AdminServices extends abstract_services_1.default {
    constructor() {
        super();
    }
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
}
exports.default = AdminServices;
