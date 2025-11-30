"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    PORT: Number(process.env.PORT) || 3000,
    // GitHub
    GITHUB_TOKEN: process.env.GITHUB_TOKEN || "",
    GITHUB_WEBHOOK_SECRET: process.env.GITHUB_WEBHOOK_SECRET || "",
    // Slack
    SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN || "",
    SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET || "",
    SLACK_CHANNEL_ID: process.env.SLACK_CHANNEL_ID || "",
    // OpenAI
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
    // DB
    DATABASE_URL: process.env.DATABASE_URL || "",
    // Redis
    REDIS_HOST: process.env.REDIS_HOST || "localhost",
    REDIS_PORT: Number(process.env.REDIS_PORT) || 6379
};
