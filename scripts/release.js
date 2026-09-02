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
  // 1. 运行完整发布门禁
  console.log("📋 运行格式、Lint、类型、测试与构建检查...");
  execSync("pnpm check", { stdio: "inherit" });

  // 2. 检查发布包内容
  console.log("🔍 检查 npm 包内容...");
  execSync("npm pack --dry-run", { stdio: "inherit" });

  // 3. 发布到 npm
  console.log("📦 发布到 npm...");
  execSync("npm publish --access public", { stdio: "inherit" });

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
