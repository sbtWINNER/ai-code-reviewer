"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubWebhookController = void 0;
const queue_1 = require("../../jobs/queue");
const logger_1 = require("../../config/logger");
class GithubWebhookController {
    static async handle(req, res) {
        const event = req.headers["x-github-event"];
        const raw = req.rawBody;
        if (!event) {
            return res.status(400).send("Missing x-github-event header");
        }
        // GitHub всегда отправляет JSON, мы его парсим вручную
        let payload;
        try {
            payload = JSON.parse(raw);
        }
        catch (e) {
            return res.status(400).send("Invalid JSON payload");
        }
        // Нас интересует только pull_request
        if (event !== "pull_request") {
            return res.status(200).send("Ignored (not PR event)");
        }
        const action = payload.action;
        if (!["opened", "reopened", "synchronize"].includes(action)) {
            return res.status(200).send("Ignored (action not relevant)");
        }
        const repo = payload.repository.full_name;
        const pr_number = payload.pull_request.number;
        const head_sha = payload.pull_request.head.sha;
        logger_1.logger.info(`Webhook: PR #${pr_number} (${action}) — queued for review`);
        await queue_1.reviewQueue.add("review", {
            repo,
            pr_number,
            head_sha
        });
        return res.status(200).send({ ok: true });
    }
}
exports.GithubWebhookController = GithubWebhookController;
