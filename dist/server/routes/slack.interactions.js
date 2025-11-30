"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slackInteractionsRouter = void 0;
const express_1 = require("express");
const verifySlack_1 = require("../middleware/verifySlack");
const slack_controller_1 = require("../controllers/slack.controller");
exports.slackInteractionsRouter = (0, express_1.Router)();
exports.slackInteractionsRouter.post("/interact", verifySlack_1.verifySlackSignature, slack_controller_1.SlackController.handleInteraction);
