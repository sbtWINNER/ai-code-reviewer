"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleEngine = void 0;
class RuleEngine {
    constructor(rules) {
        this.rules = rules;
    }
    run(fileContent, filePath) {
        const results = [];
        for (const rule of this.rules) {
            try {
                const findings = rule.run(fileContent, filePath);
                results.push(...findings);
            }
            catch (e) {
                console.log("Rule error:", rule.id, e);
            }
        }
        return results;
    }
}
exports.RuleEngine = RuleEngine;
