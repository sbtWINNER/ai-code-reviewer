"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySlackSignature = verifySlackSignature;
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../../config/env");
function verifySlackSignature(req, res, next) {
    try {
        const slackSignature = req.headers["x-slack-signature"];
        const slackTimestamp = req.headers["x-slack-request-timestamp"];
        if (!slackSignature || !slackTimestamp) {
            return res.status(400).send("Missing Slack signature");
        }
        const time = Math.floor(Date.now() / 1000);
        if (Math.abs(time - Number(slackTimestamp)) > 300) {
            return res.status(400).send("Slack request too old");
        }
        // ВАЖНО: rawBody уже строка
        const sigBaseString = `v0:${slackTimestamp}:${req.rawBody || ""}`;
        const mySignature = "v0=" +
            crypto_1.default
                .createHmac("sha256", env_1.config.SLACK_SIGNING_SECRET)
                .update(sigBaseString)
                .digest("hex");
        if (mySignature !== slackSignature) {
            return res.status(400).send("Invalid Slack signature");
        }
        return next();
    }
    catch (e) {
        return res.status(400).send("Slack signature error");
    }
}
