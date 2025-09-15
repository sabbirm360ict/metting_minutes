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
const fs_extra_1 = __importDefault(require("fs-extra"));
const openai_1 = __importDefault(require("openai"));
const path_1 = __importDefault(require("path"));
const abstract_services_1 = __importDefault(require("../../../abstract/abstract.services"));
const config_1 = __importDefault(require("../../../utils/config/config"));
const customError_1 = __importDefault(require("../../../utils/lib/customError"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
class AdminServices extends abstract_services_1.default {
    constructor() {
        super();
        this.prepareAudio = (filePath, chunkDurationSec = 1800) => __awaiter(this, void 0, void 0, function* () {
            const chunksDir = path_1.default.join('uploads', 'chunks');
            yield fs_extra_1.default.ensureDir(chunksDir);
            yield fs_extra_1.default.emptyDir(chunksDir);
            // Compress to mono 16kHz MP3
            const compressedPath = path_1.default.join('uploads', 'compressed.mp3');
            yield new Promise((resolve, reject) => {
                (0, fluent_ffmpeg_1.default)(filePath)
                    .audioCodec('libmp3lame')
                    .audioChannels(1)
                    .audioFrequency(16000)
                    .format('mp3')
                    .save(compressedPath)
                    .on('end', resolve)
                    .on('error', reject);
            });
            // Split into chunks
            return new Promise((resolve, reject) => {
                (0, fluent_ffmpeg_1.default)(compressedPath)
                    .output(path_1.default.join(chunksDir, 'chunk_%03d.mp3'))
                    .audioCodec('copy')
                    .format('mp3')
                    .outputOptions([`-f segment`, `-segment_time ${chunkDurationSec}`])
                    .on('end', () => __awaiter(this, void 0, void 0, function* () {
                    const files = (yield fs_extra_1.default.readdir(chunksDir))
                        .map((f) => path_1.default.join(chunksDir, f))
                        .sort();
                    resolve(files);
                }))
                    .on('error', reject)
                    .run();
            });
        });
        this.processAudio = (req) => __awaiter(this, void 0, void 0, function* () {
            const file = req.file;
            if (!file) {
                throw new customError_1.default(`Upload a file`, this.StatusCode.HTTP_NOT_FOUND);
            }
            const filePath = file.path;
            console.log(`Received file path: ${filePath}`);
            const transcription = yield this.openai.audio.transcriptions.create({
                file: fs_extra_1.default.createReadStream(file.path),
                model: 'whisper-1',
            });
            fs_extra_1.default.unlinkSync(file.path); // delete after processing
            console.log({ transcription });
            const transcriptionText = transcription.text;
            // Optional: summarize with GPT-4o-mini
            const summaryResp = yield this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You summarize meeting transcripts into professional minutes with Agenda, Key Points, Decisions, and Action Items.',
                    },
                    { role: 'user', content: `Transcript:\n\n${transcriptionText}` },
                ],
            });
            const meetingMinutes = summaryResp.choices[0].message.content;
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
                data: { transcript: transcriptionText, meetingMinutes, transcription },
            };
        });
        this.openai = new openai_1.default({ apiKey: config_1.default.OPENAI_API_KEY });
    }
}
exports.default = AdminServices;
