"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class AdminUtils {
    static convertToWav(inputPath, outputPath) {
        return new Promise((resolve, reject) => {
            if (!fs_1.default.existsSync(inputPath)) {
                return reject(new Error(`Input file not found: ${inputPath}`));
            }
            const outputDir = path_1.default.dirname(outputPath);
            if (!fs_1.default.existsSync(outputDir)) {
                fs_1.default.mkdirSync(outputDir, { recursive: true });
            }
            (0, fluent_ffmpeg_1.default)(inputPath)
                .audioFrequency(this.sampleRate)
                .audioChannels(1)
                .format('wav')
                .on('end', () => resolve(outputPath))
                .on('error', (err) => reject(err))
                .save(outputPath);
        });
    }
}
AdminUtils.sampleRate = 16000;
exports.default = AdminUtils;
