# 部署指南

## 发布到 NPM

### 1. 准备工作

确保你已经完成了以下步骤：

- [ ] 在 [npmjs.com](https://www.npmjs.com) 注册账号
- [ ] 登录 npm: `npm login`
- [ ] 确保 package.json 中的版本号正确
- [ ] 确保所有测试通过

### 2. 发布流程

#### 自动发布（推荐）

```bash
# 使用发布脚本
npm run release
```

#### 手动发布

```bash
# 1. 安装依赖
npm install

# 2. 运行测试
npm run test

# 3. 代码检查
npm run lint:check

# 4. 类型检查
npm run type-check

# 5. 构建
npm run build:lib

# 6. 发布
npm publish
```

### 3. 版本管理

使用语义化版本控制：

```bash
# 补丁版本 (1.0.0 -> 1.0.1)
npm version patch

# 小版本 (1.0.0 -> 1.1.0)
npm version minor

# 大版本 (1.0.0 -> 2.0.0)
npm version major
```

## 发布到 GitHub

### 1. 创建 GitHub 仓库

1. 在 GitHub 上创建新仓库：`pro-components-vue2`
2. 设置仓库为公开
3. 添加描述和标签

### 2. 推送代码

```bash
# 初始化 Git 仓库
git init

# 添加远程仓库
git remote add origin https://github.com/ihopefulChina/pro-components-vue2.git

# 添加文件
git add .

# 提交
git commit -m "feat: initial commit"

# 推送到 GitHub
git push -u origin main
```

### 3. 设置 GitHub Actions

GitHub Actions 会自动处理 CI/CD 流程：

- 代码检查
- 测试
- 构建
- 自动发布到 NPM（当推送到 main 分支时）

## 文档部署

### 1. GitHub Pages

1. 在仓库设置中启用 GitHub Pages
2. 选择 `gh-pages` 分支作为源
3. 访问 `https://ihopefulChina.github.io/pro-components-vue2`

### 2. 使用 Vercel

1. 连接 GitHub 仓库到 Vercel
2. 设置构建命令：`npm run build`
3. 设置输出目录：`dist`
4. 自动部署到 Vercel

## 监控和维护

### 1. 版本发布

- 使用 GitHub Releases 创建发布版本
- 添加详细的变更日志
- 标记重要版本

### 2. 问题跟踪

- 使用 GitHub Issues 跟踪 bug 和功能请求
- 使用 GitHub Discussions 进行社区讨论
- 定期回复和维护

### 3. 社区建设

- 编写详细的文档
- 提供使用示例
- 响应社区反馈
- 定期更新和维护

## 安全检查

发布前确保：

- [ ] 没有敏感信息（API 密钥、密码等）
- [ ] 依赖项都是安全的
- [ ] 代码经过充分测试
- [ ] 文档完整且准确
- [ ] 许可证正确设置
