"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewQueue = void 0;
const bullmq_1 = require("bullmq");
const env_1 = require("../config/env");
exports.reviewQueue = new bullmq_1.Queue("review-queue", {
    connection: {
        host: env_1.config.REDIS_HOST,
        port: env_1.config.REDIS_PORT
    }
});
