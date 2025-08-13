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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class AdminUtils {
    constructor() {
        this.sampleRate = 16000;
    }
    convertToWav(inputPath, outputPath) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                // Make sure ffmpeg path is set
                fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_static_1.default);
                // Resolve absolute paths
                const absInput = path_1.default.resolve(inputPath);
                const absOutput = path_1.default.resolve(outputPath);
                // Check if input file exists
                if (!fs_1.default.existsSync(absInput)) {
                    return reject(new Error(`Input file not found: ${absInput}`));
                }
                // Ensure output folder exists
                const outputDir = path_1.default.dirname(absOutput);
                if (!fs_1.default.existsSync(outputDir)) {
                    fs_1.default.mkdirSync(outputDir, { recursive: true });
                }
                (0, fluent_ffmpeg_1.default)(absInput)
                    .audioFrequency(this.sampleRate)
                    .audioChannels(1)
                    .format('wav')
                    .on('end', () => resolve(absOutput))
                    .on('error', (err) => reject(err))
                    .save(absOutput);
            });
        });
    }
}
exports.default = AdminUtils;
