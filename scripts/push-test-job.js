/*
  scripts/push-test-job.js
  Usage: node scripts/push-test-job.js owner/repo 1
*/
const { Queue } = require("bullmq");
const dotenv = require("dotenv");
dotenv.config();

async function main() {
  const redisHost = process.env.REDIS_HOST || "127.0.0.1";
  const redisPort = Number(process.env.REDIS_PORT || 6379);

  const queue = new Queue("review-queue", {
    connection: { host: redisHost, port: redisPort }
  });

  const repo = process.argv[2] || "owner/repo";
  const pr = Number(process.argv[3] || 1);

  await queue.add("review", { repo, pr_number: pr });
  console.log(`✅ Added test job to review-queue -> ${repo}#${pr}`);
  await queue.close();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
