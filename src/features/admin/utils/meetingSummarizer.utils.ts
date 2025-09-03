import axios from 'axios';

class MeetingSummarizer {
  private apiKey: string;
  private modelName: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.modelName = 'gemini-2.5-flash-preview-05-20';
  }

  public async summarize(transcript: string): Promise<string> {
    console.log('Generating summary... (Using a large language model API)');

    const userQuery: string = `Summarize the following meeting transcript.
    
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
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const summary: string = mockApiResponse.candidates[0].content.parts[0].text;
    return summary;
  }
}

export default MeetingSummarizer;
