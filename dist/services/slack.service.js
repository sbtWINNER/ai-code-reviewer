"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackService = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const slack_message_1 = require("./slack.message");
class SlackService {
    async postReviewResult({ repo, pr_number, result }) {
        const duration = Math.round(Math.random() * 10 + 5);
        const payload = (0, slack_message_1.buildSlackReviewMessage)({
            repo,
            pr_number,
            result,
            duration
        });
        // Отправка в Slack
        await axios_1.default.post("https://slack.com/api/chat.postMessage", payload, {
            headers: {
                Authorization: `Bearer ${env_1.config.SLACK_BOT_TOKEN}`,
                "Content-Type": "application/json"
            }
        });
    }
}
exports.SlackService = SlackService;
