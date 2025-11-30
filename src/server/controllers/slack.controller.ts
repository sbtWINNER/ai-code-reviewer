import { Request, Response } from "express";
import { GithubService } from "../../services/github.service";
import { logger } from "../../config/logger";

export class SlackController {
  static async handleInteraction(req: Request, res: Response) {
    try {
      const payload = JSON.parse(req.body.payload);
      const action = payload.actions?.[0];

      if (!action) return res.status(200).send();

      const { repo, pr_number } = JSON.parse(action.value);

      const aiResult = JSON.parse(payload.message.metadata.event_payload);

      const github = new GithubService();

      switch (action.action_id) {
        case "post_to_pr":
          await github.postReviewToPR(repo, pr_number, aiResult.findings);
          break;

        case "mark_false_positive":
          logger.warn(`False positive for PR ${pr_number}`);
          break;

        case "improve_ai":
          logger.info(`AI improvement requested for PR ${pr_number}`);
          break;
      }

      return res.status(200).send();
    } catch (err) {
      logger.error("Slack interaction error", err);
      return res.status(500).send();
    }
  }
}
