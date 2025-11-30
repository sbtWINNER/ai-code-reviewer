"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRuleEngine = loadRuleEngine;
const rule_engine_1 = require("./rule.engine");
const no_console_rule_1 = require("./rules/no-console.rule");
const long_function_rule_1 = require("./rules/long-function.rule");
const banned_pattern_rule_1 = require("./rules/banned-pattern.rule");
function loadRuleEngine() {
    return new rule_engine_1.RuleEngine([
        no_console_rule_1.noConsoleRule,
        long_function_rule_1.longFunctionRule,
        banned_pattern_rule_1.bannedPatternRule
    ]);
}
