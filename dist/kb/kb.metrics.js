"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeMetrics = computeMetrics;
function computeMetrics(reviews) {
    const map = {};
    reviews.forEach(review => {
        const findings = review.findings || [];
        findings.forEach(f => {
            const ruleId = f.id || "unknown";
            if (!map[ruleId]) {
                map[ruleId] = {
                    ruleId,
                    severity: f.severity,
                    count: 0
                };
            }
            map[ruleId].count++;
        });
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
}
