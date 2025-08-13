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
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
class AdminUtils {
    constructor() {
        this.sampleRate = 16000;
    }
    convertToWav(inputPath, outputPath) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (!ffmpeg_static_1.default) {
                    return reject(new Error('ffmpeg-static could not find the ffmpeg binary.'));
                }
                fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_static_1.default);
                (0, fluent_ffmpeg_1.default)(inputPath)
                    .audioFrequency(this.sampleRate)
                    .audioChannels(1)
                    .format('wav')
                    .save(outputPath)
                    .on('end', () => resolve(outputPath))
                    .on('error', (err) => reject(err));
            });
        });
    }
}
exports.default = AdminUtils;
