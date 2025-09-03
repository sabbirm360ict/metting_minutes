import MeetingSummarizer from './meetingSummarizer.utils';
import MeetingTranscriber from './meetingTranscriber.utils';

export interface MeetingMinutes {
  date: string;
  time: string;
  transcript: string;
  summary: string;
  status: string;
}

class MeetingMinutesGenerator {
  private transcriber: MeetingTranscriber;
  private summarizer: MeetingSummarizer;

  constructor(apiKey: string) {
    this.transcriber = new MeetingTranscriber(apiKey);
    this.summarizer = new MeetingSummarizer(apiKey);
  }

  // The main method to generate the full meeting minutes.
  public async generateMinutes(audioFilePath: string): Promise<MeetingMinutes> {
    console.log('Starting meeting minutes generation process...');

    // Step 1: Transcribe the audio file.
    const transcript: string = await this.transcriber.transcribeAudio(
      audioFilePath
    );
    console.log('\n--- Transcription Complete ---\n');
    console.log(transcript);
    console.log('------------------------------\n');

    // Step 2: Summarize the transcript.
    const summary: string = await this.summarizer.summarize(transcript);
    console.log('\n--- Summary Complete ---\n');
    console.log(summary);
    console.log('------------------------------\n');

    // Combine all parts into a final meeting minutes object.
    const meetingMinutes: MeetingMinutes = {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      transcript: transcript.trim(),
      summary: summary.trim(),
      status: 'Generated Successfully',
    };

    return meetingMinutes;
  }
}

export default MeetingMinutesGenerator;
