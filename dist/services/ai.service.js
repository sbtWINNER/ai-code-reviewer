"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const openai_1 = __importDefault(require("openai"));
const env_1 = require("../config/env");
const redactSecrets_1 = require("../server/middleware/redactSecrets");
const preprocessDiff_1 = require("../server/middleware/preprocessDiff");
const persona_prompt_1 = require("../ai/persona/persona.prompt");
class AIService {
    constructor() {
        this.client = new openai_1.default({
            apiKey: env_1.config.OPENAI_API_KEY
        });
    }
    async review(input) {
        // Clean and normalize data
        const cleanDiff = preprocessDiff_1.diffPreprocessor.clean(redactSecrets_1.secretRedactor.redact(input.diff));
        const cleanFiles = input.files.map(f => ({
            ...f,
            patch: redactSecrets_1.secretRedactor.redact(f.patch ?? "")
        }));
        const cleanContext = JSON.parse(redactSecrets_1.secretRedactor.redact(JSON.stringify(input.context)));
        // Build persona prompts
        const systemMessage = (0, persona_prompt_1.buildSystemPrompt)();
        const userMessage = (0, persona_prompt_1.buildReviewPrompt)({
            diff: cleanDiff,
            files: cleanFiles,
            context: cleanContext
        });
        const completion = await this.client.chat.completions.create({
            model: "gpt-4.1",
            temperature: 0.1,
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: userMessage }
            ]
        });
        const raw = completion.choices[0].message?.content || "{}";
        return JSON.parse(raw);
    }
}
exports.AIService = AIService;
