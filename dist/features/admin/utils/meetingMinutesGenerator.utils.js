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
const meetingSummarizer_utils_1 = __importDefault(require("./meetingSummarizer.utils"));
const meetingTranscriber_utils_1 = __importDefault(require("./meetingTranscriber.utils"));
class MeetingMinutesGenerator {
    constructor(apiKey) {
        this.transcriber = new meetingTranscriber_utils_1.default(apiKey);
        this.summarizer = new meetingSummarizer_utils_1.default(apiKey);
    }
    // The main method to generate the full meeting minutes.
    generateMinutes(audioFilePath) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Starting meeting minutes generation process...');
            // Step 1: Transcribe the audio file.
            const transcript = yield this.transcriber.transcribeAudio(audioFilePath);
            console.log('\n--- Transcription Complete ---\n');
            console.log(transcript);
            console.log('------------------------------\n');
            // Step 2: Summarize the transcript.
            const summary = yield this.summarizer.summarize(transcript);
            console.log('\n--- Summary Complete ---\n');
            console.log(summary);
            console.log('------------------------------\n');
            // Combine all parts into a final meeting minutes object.
            const meetingMinutes = {
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                transcript: transcript.trim(),
                summary: summary.trim(),
                status: 'Generated Successfully',
            };
            return meetingMinutes;
        });
    }
}
exports.default = MeetingMinutesGenerator;
