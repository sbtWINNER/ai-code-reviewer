"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const env_1 = require("../config/env");
const github_service_1 = require("../services/github.service");
const ai_service_1 = require("../services/ai.service");
const slack_service_1 = require("../services/slack.service");
const logger_1 = require("../config/logger");
const rule_loader_1 = require("../rules/rule.loader");
const kb_service_1 = require("../kb/kb.service");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
new bullmq_1.Worker("review-queue", async (job) => {
    const { repo, pr_number } = job.data;
    logger_1.logger.info(`🚀 Starting review for ${repo} PR #${pr_number}`);
    const github = new github_service_1.GithubService();
    const slack = new slack_service_1.SlackService();
    const ai = new ai_service_1.AIService();
    const engine = (0, rule_loader_1.loadRuleEngine)();
    const kb = new kb_service_1.KBService();
    // --- 1. Получаем данные PR
    const diff = await github.getPRDiff(repo, pr_number);
    const files = await github.getPRFiles(repo, pr_number);
    const context = await github.getProjectProfile(repo);
    // --- 2. Анализ AI
    const aiResult = await ai.review({ diff, files, context });
    // --- 3. Проверки по статическим правилам
    const staticFindings = [];
    for (const f of files) {
        const fileFindings = engine.run(f.patch || "", f.path);
        staticFindings.push(...fileFindings);
    }
    // --- 4. Объединяем результаты
    const combined = {
        ...aiResult,
        findings: [
            ...aiResult.findings,
            ...staticFindings.map(f => ({
                id: "rule_" + f.ruleId,
                severity: f.severity,
                file: f.file,
                line_start: f.line,
                line_end: f.line,
                message: f.message,
                suggested_patch: "",
                examples: [],
                docs: []
            }))
        ]
    };
    // --- 5. Сохраняем результат ревью в БД
    try {
        const [owner, name] = repo.split("/");
        // Проверяем, есть ли репозиторий
        let repoRecord = await prisma.repos.findFirst({
            where: { owner, name }
        });
        // Если нет — создаём
        if (!repoRecord) {
            repoRecord = await prisma.repos.create({
                data: { owner, name }
            });
            logger_1.logger.info(`[DB] 🆕 Created new repo record for ${repo}`);
        }
        // Создаём PR-запись
        const prRecord = await prisma.pR.create({
            data: {
                repo_id: repoRecord.id,
                pr_number,
                head_sha: "unknown",
                last_review_at: new Date(),
                status: "completed"
            }
        });
        // Сохраняем само ревью
        await prisma.review.create({
            data: {
                pr_id: prRecord.id,
                ai_version: "gpt-5",
                summary: combined.summary,
                findings: combined.findings,
                feedback: {}
            }
        });
        logger_1.logger.info(`[DB] ✅ Review saved for PR #${pr_number}`);
    }
    catch (err) {
        logger_1.logger.error(`[DB] ❌ Failed to save review for ${repo}: ${err}`);
    }
    // --- 6. Отправляем отчёт в Slack
    try {
        await slack.postReviewResult({
            repo,
            pr_number,
            result: combined
        });
        logger_1.logger.info(`[Slack] ✅ Review report sent for ${repo} PR #${pr_number}`);
    }
    catch (err) {
        logger_1.logger.error(`[Slack] ❌ Failed to send Slack message: ${err}`);
    }
    // --- 7. Обновляем базу знаний
    try {
        await kb.generateForRepo(repo);
        logger_1.logger.info(`[KBService] ✅ Knowledge base updated for ${repo}`);
    }
    catch (err) {
        logger_1.logger.error(`[KBService] ❌ Failed to update KB for ${repo}: ${err}`);
    }
    logger_1.logger.info(`✅ Completed review for PR #${pr_number}`);
}, {
    connection: {
        host: env_1.config.REDIS_HOST,
        port: env_1.config.REDIS_PORT
    }
});
