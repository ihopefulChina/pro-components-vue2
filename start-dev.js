#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 启动 Pro Components Vue2 开发环境...');

// 启动开发服务器
const devServer = spawn('pnpm', ['dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: path.resolve(__dirname)
});

devServer.on('error', (error) => {
  console.error('❌ 启动失败:', error.message);
  process.exit(1);
});

devServer.on('close', (code) => {
  console.log(`📦 开发服务器退出，代码: ${code}`);
});

// 处理进程退出
process.on('SIGINT', () => {
  console.log('\n🛑 正在关闭开发服务器...');
  devServer.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 正在关闭开发服务器...');
  devServer.kill('SIGTERM');
  process.exit(0);
});
