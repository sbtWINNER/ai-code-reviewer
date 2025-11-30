"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultRules = void 0;
function createPatternRule(id, pattern, message, severity) {
    return {
        id,
        description: message,
        severity,
        check(content, filePath) {
            const findings = [];
            const lines = content.split("\n");
            lines.forEach((line, index) => {
                if (pattern.test(line)) {
                    findings.push({
                        ruleId: id,
                        file: filePath,
                        message,
                        severity,
                        line: index + 1
                    });
                }
            });
            return findings;
        }
    };
}
exports.defaultRules = [
    // Запрещён eval
    createPatternRule("no_eval", /\beval\(/, "Usage of eval() is dangerous and should be avoided.", "critical"),
    // Любые ключи 'password'
    createPatternRule("no_plain_password", /password\s*[:=]/i, "Do not store or manipulate raw passwords in code.", "critical"),
    // console.log в коде
    createPatternRule("no_console_log", /\bconsole\.log\(/, "console.log() left in code — remove before merging.", "style"),
    // any в TypeScript
    createPatternRule("no_any", /\bany\b/, "Avoid using 'any'. Use a specific type.", "improvement"),
    // debugger
    createPatternRule("no_debugger", /\bdebugger\b/, "Remove debugger statements before committing.", "style")
];
