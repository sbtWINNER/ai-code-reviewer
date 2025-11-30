"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diffPreprocessor = exports.DiffPreprocessor = void 0;
class DiffPreprocessor {
    constructor() {
        this.maxLines = 2000;
    }
    clean(diff) {
        if (!diff)
            return "";
        // Удаляем бинарные изменения
        diff = diff.replace(/Binary files .* differ/g, "[BINARY FILE REDACTED]");
        // Обрезаем слишком большие diff
        const lines = diff.split("\n");
        if (lines.length > this.maxLines) {
            return (lines.slice(0, this.maxLines).join("\n") +
                `\n[DIFF TRUNCATED — ${lines.length - this.maxLines} lines removed]`);
        }
        return diff;
    }
}
exports.DiffPreprocessor = DiffPreprocessor;
exports.diffPreprocessor = new DiffPreprocessor();
