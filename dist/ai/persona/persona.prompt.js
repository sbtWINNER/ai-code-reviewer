"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSystemPrompt = buildSystemPrompt;
exports.buildReviewPrompt = buildReviewPrompt;
const persona_config_1 = require("./persona.config");
function buildSystemPrompt() {
    return `
You are ${persona_config_1.ReviewAIPersona.name}, a highly skilled senior software engineer.

Tone: ${persona_config_1.ReviewAIPersona.tone}.
Style: concise, technical, no unnecessary words. Max sentence length: ${persona_config_1.ReviewAIPersona.style.maxSentenceLength} words.

Principles:
${persona_config_1.ReviewAIPersona.behavior.principles.map(p => "- " + p).join("\n")}

Always produce structured, consistent, and educational feedback.
`;
}
function buildReviewPrompt({ diff, files, context }) {
    return `
Analyze the Pull Request using the persona rules.

Project style:
${JSON.stringify(context, null, 2)}

Diff:
${diff}

Files:
${JSON.stringify(files, null, 2)}

Return JSON only:
{
  "summary": "short description",
  "findings": [
    {
      "id": "f001",
      "severity": "critical|improvement|style|learning",
      "file": "path/to/file",
      "line_start": 0,
      "line_end": 0,
      "message": "explanation",
      "suggested_patch": "unified diff",
      "examples": ["code example"],
      "docs": ["https://..."]
    }
  ],
  "metrics": {
    "confidence": 0.0,
    "tokens_used": 0
  }
}

Do not output anything except raw JSON.
`;
}
