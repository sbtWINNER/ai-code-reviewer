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
    const raw = req.rawBody || "";
    if (!signature) {
        return res.status(401).send("Missing GitHub signature");
    }
    const expected = "sha256=" +
        crypto_1.default
            .createHmac("sha256", env_1.config.GITHUB_WEBHOOK_SECRET)
            .update(raw)
            .digest("hex");
    if (expected !== signature) {
        return res.status(401).send("Invalid GitHub signature");
    }
    next();
}
