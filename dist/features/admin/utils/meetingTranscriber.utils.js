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
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
class MeetingTranscriber {
    constructor(apiKey) {
        // API key for a real transcription service would be used here.
        this.apiKey = apiKey;
        this.transcriptionApiUrl = `https://speech.googleapis.com/v1/speech:recognize?key=${this.apiKey}`;
    }
    // Simulates transcribing an audio file.
    // In a real application, you would send the audio file data to an API like
    // Google's Speech-to-Text, AssemblyAI, or a similar service.
    transcribeAudio(audioFilePath) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Transcribing audio file: ${audioFilePath}`);
            console.log('Making an API call for transcription...');
            try {
                // Read the audio file from the provided path.
                // This is necessary to send the file data in the API request body.
                const audioData = fs_1.default.readFileSync(audioFilePath);
                const base64Audio = audioData.toString('base64');
                // The request body must conform to the API's requirements.
                // This example uses the format for Google Cloud Speech-to-Text.
                // Ensure your audio file matches the settings (e.g., sampleRateHertz, languageCode).
                const requestBody = {
                    config: {
                        encoding: 'LINEAR16', // Assumes PCM audio. Change if your format is different.
                        sampleRateHertz: 16000, // Common for voice. Adjust to your file's sample rate.
                        languageCode: ['en-US', 'bn-BD'], // Use "bn-BD" for Bengali. This can be made dynamic.
                        audioChannelCount: 1,
                    },
                    audio: {
                        content: base64Audio,
                    },
                };
                // Make the POST request to the transcription API.
                const response = yield axios_1.default.post(this.transcriptionApiUrl, requestBody, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                // Extract the transcribed text from the API response.
                // The path to the text may vary depending on the API.
                const transcriptParts = response.data.results.map((result) => result.alternatives[0].transcript);
                const fullTranscript = transcriptParts.join(' ');
                console.log('Transcription successful.');
                return fullTranscript;
            }
            catch (error) {
                console.error('Transcription failed:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                // It is good practice to throw an error so the calling function can handle it.
                throw new Error(`Transcription API error: ${error.message}`);
            }
        });
    }
}
exports.default = MeetingTranscriber;
