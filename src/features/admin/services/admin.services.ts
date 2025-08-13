import AbstractServices from '../../../abstract/abstract.services';
import config from '../../../utils/config/config';

class AdminServices extends AbstractServices {
  constructor() {
    super();
  }

  async translateBanglaToEnglish(text: string): Promise<string> {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-bn-en',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: text }),
      }
    );

    const data = await response.json();
    if (data.error) throw new Error(data.error);

    return data[0].translation_text;
  }

  isBangla(text: string): boolean {
    return /[\u0980-\u09FF]/.test(text);
  }
}
export default AdminServices;
