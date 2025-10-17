#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 启动开发环境...");

try {
  // 检查 Node.js 版本
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);
  
  if (majorVersion < 16) {
    console.error("❌ 需要 Node.js 16 或更高版本");
    process.exit(1);
  }

  // 检查依赖是否安装
  if (!fs.existsSync(path.join(__dirname, "../node_modules"))) {
    console.log("📦 安装依赖...");
    execSync("pnpm install", { stdio: "inherit" });
  }

  // 检查端口是否被占用
  try {
    execSync("lsof -i :3000", { stdio: "ignore" });
    console.log("⚠️  端口 3000 已被占用，尝试使用端口 3001...");
    process.env.PORT = "3001";
  } catch (error) {
    // 端口可用
  }

  // 启动开发服务器
  console.log("🌐 启动开发服务器...");
  execSync("pnpm dev", { stdio: "inherit" });

} catch (error) {
  console.error("❌ 启动失败:", error.message);
  process.exit(1);
}
