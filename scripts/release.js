#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// 获取版本号
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../package.json"), "utf8")
);
const version = packageJson.version;

console.log(`🚀 开始发布版本 ${version}`);

try {
  // 1. 运行测试
  console.log("📋 运行测试...");
  execSync("npm run test", { stdio: "inherit" });

  // 2. 代码检查
  console.log("🔍 代码检查...");
  execSync("npm run lint:check", { stdio: "inherit" });

  // 3. 类型检查
  console.log("📝 类型检查...");
  execSync("npm run type-check", { stdio: "inherit" });

  // 4. 构建
  console.log("🏗️ 构建项目...");
  execSync("npm run build:lib", { stdio: "inherit" });

  // 5. 发布到 npm
  console.log("📦 发布到 npm...");
  execSync("npm publish", { stdio: "inherit" });

  console.log("✅ 发布成功！");
  console.log(`📦 版本: ${version}`);
  console.log(`🔗 npm: https://www.npmjs.com/package/pro-components-vue2`);
  console.log(
    `📚 GitHub: https://github.com/ihopefulChina/pro-components-vue2`
  );
} catch (error) {
  console.error("❌ 发布失败:", error.message);
  process.exit(1);
}
