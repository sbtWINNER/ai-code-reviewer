"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rawBodySaver = rawBodySaver;
function rawBodySaver(req, res, buf) {
    if (buf && buf.length > 0) {
        req.rawBody = buf.toString("utf8");
    }
}
