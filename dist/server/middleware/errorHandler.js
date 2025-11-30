"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logger_1 = require("../../config/logger");
function errorHandler(err, req, res, next) {
    logger_1.logger.error("Unhandled error:", err);
    return res.status(500).json({
        success: false,
        message: err.message || "Internal server error"
    });
}
