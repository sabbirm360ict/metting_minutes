"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../.env') });
const getConfig = () => {
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
const getSanitizeConfig = (config) => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in .env`);
        }
    }
    return config;
};
exports.default = getSanitizeConfig(getConfig());
