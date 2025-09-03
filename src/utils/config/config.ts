import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

interface ENV {
  PORT: number | undefined;
  DB_USER: string | undefined;
  DB_NAME: string | undefined;
  DB_PASS: string | undefined;
  DB_PORT: number | undefined;
  DB_HOST: string | undefined;
  EMAIL_SENDER_EMAIL_ID: string | undefined;
  EMAIL_SENDER_PASS: string | undefined;
  JWT_SECRET: string | undefined;
  OPENAI_API_KEY: string | undefined;
  HUGGING_FACE_API_KEY: string | undefined;
  GEMINI_API_KEY: string | undefined;
}

interface Config {
  PORT: number;
  DB_USER: string;
  DB_NAME: string;
  DB_PASS: string;
  DB_PORT: number;
  DB_HOST: string;
  EMAIL_SENDER_EMAIL_ID: string;
  EMAIL_SENDER_PASS: string;
  JWT_SECRET: string;
  OPENAI_API_KEY: string;
  HUGGING_FACE_API_KEY: string;
  GEMINI_API_KEY: string;
}

const getConfig = (): ENV => {
  return {
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    DB_PASS: process.env.DB_PASS,
    DB_PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    DB_HOST: process.env.DB_HOST,
    EMAIL_SENDER_EMAIL_ID: process.env.EMAIL_SENDER_EMAIL_ID,
    EMAIL_SENDER_PASS: process.env.EMAIL_SENDER_PASS,
    JWT_SECRET: process.env.JWT_SECRET,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    HUGGING_FACE_API_KEY: process.env.HUGGING_FACE_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  };
};

const getSanitizeConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in .env`);
    }
  }

  return config as Config;
};

export default getSanitizeConfig(getConfig());
