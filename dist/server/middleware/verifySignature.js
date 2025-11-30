"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyGithubSignature = verifyGithubSignature;
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../../config/env");
function verifyGithubSignature(req, res, next) {
    const signature = req.headers["x-hub-signature-256"];
    if (!signature) {
        return res.status(400).send("No GitHub signature provided");
    }
    const secret = env_1.config.GITHUB_WEBHOOK_SECRET;
    const body = JSON.stringify(req.body);
    const computed = "sha256=" + crypto_1.default.createHmac("sha256", secret).update(body).digest("hex");
    if (signature !== computed) {
        return res.status(401).send("Invalid GitHub signature");
    }
    next();
}
