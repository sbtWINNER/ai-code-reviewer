"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.githubWebhookRouter = void 0;
const express_1 = require("express");
const verifyGithub_1 = require("../middleware/verifyGithub");
const github_controller_1 = require("../controllers/github.controller");
exports.githubWebhookRouter = (0, express_1.Router)();
exports.githubWebhookRouter.post("/", verifyGithub_1.verifyGithubSignature, github_controller_1.GithubWebhookController.handle);
