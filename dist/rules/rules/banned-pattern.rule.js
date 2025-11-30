"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bannedPatternRule = void 0;
exports.bannedPatternRule = {
    id: "banned_pattern",
    description: "Запрещённые паттерны в коде",
    severity: "critical",
    run(content, filePath) {
        const banned = ["eval(", "new Function("];
        const findings = [];
        banned.forEach(pattern => {
            if (content.includes(pattern)) {
                findings.push({
                    ruleId: "banned_pattern",
                    severity: "critical",
                    file: filePath,
                    line: 1,
                    message: `Обнаружен запрещённый паттерн: ${pattern}`
                });
            }
        });
        return findings;
    }
};
