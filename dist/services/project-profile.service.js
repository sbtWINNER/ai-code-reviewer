"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectProfileService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ProjectProfileService {
    async getProfileForRepo(repo) {
        let profile = await prisma.projectProfile.findUnique({
            where: { repo }
        });
        if (!profile) {
            profile = await prisma.projectProfile.create({
                data: {
                    repo,
                    language: "javascript",
                    linters: ["eslint"],
                    ignorePaths: [],
                    rulesJson: {},
                    modelPref: "gpt-5"
                }
            });
        }
        return profile;
    }
}
exports.ProjectProfileService = ProjectProfileService;
