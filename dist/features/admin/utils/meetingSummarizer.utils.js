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
Object.defineProperty(exports, "__esModule", { value: true });
class MeetingSummarizer {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.modelName = 'gemini-2.5-flash-preview-05-20';
    }
    summarize(transcript) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Generating summary... (Using a large language model API)');
            const userQuery = `Summarize the following meeting transcript.
    
    The summary should include key decisions, action items, and next steps in both English and Bengali.
    
    Transcript:
    ${transcript}`;
            // The API call to the Gemini API is mocked here.
            // In a real application, you would perform a POST request to the API endpoint.
            const mockApiResponse = {
                candidates: [
                    {
                        content: {
                            parts: [
                                {
                                    text: `
                **English Summary**

                - **Key Decisions:** The marketing budget needs a 10% increase. The project deadline will be extended by two weeks.
                - **Action Items:** John will revise the marketing budget. Jane will update the project timeline.
                - **Next Steps:** The next meeting is scheduled for next Tuesday.

                **বাংলা সারাংশ**

                - **মূল সিদ্ধান্ত:** বিপণনের বাজেট ১০% বাড়ানোর প্রয়োজন। প্রকল্পের সময়সীমা দুই সপ্তাহ বাড়ানো হবে।
                - **পদক্ষেপ:** জন বিপণনের বাজেট পর্যালোচনা করবেন। জেন প্রকল্পের সময়সীমা হালনাগাদ করবেন।
                - **পরবর্তী পদক্ষেপ:** পরবর্তী মিটিং আগামী মঙ্গলবার নির্ধারিত হয়েছে।
                `,
                                },
                            ],
                        },
                    },
                ],
            };
            // Simulate an API call delay.
            yield new Promise((resolve) => setTimeout(resolve, 2000));
            const summary = mockApiResponse.candidates[0].content.parts[0].text;
            return summary;
        });
    }
}
exports.default = MeetingSummarizer;
