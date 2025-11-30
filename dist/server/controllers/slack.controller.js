"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackController = void 0;
const github_service_1 = require("../../services/github.service");
const logger_1 = require("../../config/logger");
class SlackController {
    static async handleInteraction(req, res) {
        try {
            const payload = JSON.parse(req.body.payload);
            const action = payload.actions?.[0];
            if (!action)
                return res.status(200).send();
            const { repo, pr_number } = JSON.parse(action.value);
            const aiResult = JSON.parse(payload.message.metadata.event_payload);
            const github = new github_service_1.GithubService();
            switch (action.action_id) {
                case "post_to_pr":
                    await github.postReviewToPR(repo, pr_number, aiResult.findings);
                    break;
                case "mark_false_positive":
                    logger_1.logger.warn(`False positive for PR ${pr_number}`);
                    break;
                case "improve_ai":
                    logger_1.logger.info(`AI improvement requested for PR ${pr_number}`);
                    break;
            }
            return res.status(200).send();
        }
        catch (err) {
            logger_1.logger.error("Slack interaction error", err);
            return res.status(500).send();
        }
    }
}
exports.SlackController = SlackController;
