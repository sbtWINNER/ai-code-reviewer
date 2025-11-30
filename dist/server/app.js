"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rawBody_1 = require("./middleware/rawBody");
const github_webhook_1 = require("./routes/github.webhook");
const slack_interactions_1 = require("./routes/slack.interactions");
const app = (0, express_1.default)();
// Критично: сохраняем сырое тело для Slack и GitHub
app.use(express_1.default.json({
    verify: rawBody_1.rawBodySaver
}));
// GitHub Webhooks (RAW required)
app.use("/webhook/github", github_webhook_1.githubWebhookRouter);
// Slack interactions (RAW required)
app.use("/slack", slack_interactions_1.slackInteractionsRouter);
exports.default = app;
