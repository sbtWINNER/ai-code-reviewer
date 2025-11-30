-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "slack_id" TEXT,
    "role" TEXT,
    "settings" JSONB,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repos" (
    "id" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "project_profile_id" TEXT,

    CONSTRAINT "Repos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PR" (
    "id" TEXT NOT NULL,
    "repo_id" TEXT NOT NULL,
    "pr_number" INTEGER NOT NULL,
    "head_sha" TEXT NOT NULL,
    "status" TEXT,
    "last_review_at" TIMESTAMP(3),

    CONSTRAINT "PR_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "pr_id" TEXT NOT NULL,
    "ai_version" TEXT,
    "summary" TEXT,
    "findings" JSONB NOT NULL,
    "feedback" JSONB,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectProfile" (
    "id" TEXT NOT NULL,
    "repo" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "linters" TEXT[],
    "ignorePaths" TEXT[],
    "rulesJson" JSONB NOT NULL,
    "modelPref" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectProfile_repo_key" ON "ProjectProfile"("repo");

-- AddForeignKey
ALTER TABLE "Repos" ADD CONSTRAINT "Repos_project_profile_id_fkey" FOREIGN KEY ("project_profile_id") REFERENCES "ProjectProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PR" ADD CONSTRAINT "PR_repo_id_fkey" FOREIGN KEY ("repo_id") REFERENCES "Repos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_pr_id_fkey" FOREIGN KEY ("pr_id") REFERENCES "PR"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
