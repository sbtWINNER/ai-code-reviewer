"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.longFunctionRule = void 0;
exports.longFunctionRule = {
    id: "long_function",
    description: "Функции должны быть короче 50 строк",
    severity: "improvement",
    run(content, filePath) {
        const findings = [];
        const lines = content.split("\n");
        let functionStart = null;
        lines.forEach((line, index) => {
            if (line.includes("function ") || line.includes("=> {")) {
                functionStart = index;
            }
            if (functionStart !== null && line.includes("}")) {
                const length = index - functionStart;
                if (length > 50) {
                    findings.push({
                        ruleId: "long_function",
                        severity: "improvement",
                        file: filePath,
                        line: index,
                        message: `Функция слишком длинная (${length} строк).`
                    });
                }
                functionStart = null;
            }
        });
        return findings;
    }
};
