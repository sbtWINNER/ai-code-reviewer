"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubService = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const project_profile_service_1 = require("./project-profile.service");
class GithubService {
    constructor() {
        this.api = axios_1.default.create({
            baseURL: "https://api.github.com",
            headers: {
                Authorization: `Bearer ${env_1.config.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json"
            }
        });
    }
    async getPRDiff(repo, pr_number) {
        const [owner, name] = repo.split("/");
        const res = await this.api.get(`/repos/${owner}/${name}/pulls/${pr_number}`, {
            headers: { Accept: "application/vnd.github.diff" }
        });
        return res.data;
    }
    async getPRFiles(repo, pr_number) {
        const [owner, name] = repo.split("/");
        const res = await this.api.get(`/repos/${owner}/${name}/pulls/${pr_number}/files`);
        return res.data.map(f => ({
            path: f.filename,
            patch: f.patch
        }));
    }
    async getProjectProfile(repo) {
        const service = new project_profile_service_1.ProjectProfileService();
        return service.getProfileForRepo(repo);
    }
    // ▼▼ FIX: добавляем недостающий метод ▼▼
    async postReviewToPR(repo, pr_number, findings) {
        const [owner, name] = repo.split("/");
        const body = findings
            .map(f => `### ${f.severity.toUpperCase()} — ${f.file}:${f.line_start}\n${f.message}\n`)
            .join("\n");
        await this.api.post(`/repos/${owner}/${name}/issues/${pr_number}/comments`, {
            body
        });
        return true;
    }
}
exports.GithubService = GithubService;
