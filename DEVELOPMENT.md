# 开发指南

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm 9.15.9

### 安装依赖

```bash
pnpm install --frozen-lockfile
```

### 启动开发服务器

```bash
# 启动主项目开发服务器
pnpm dev

```

## 🛠️ 开发工具

### 代码质量

```bash
# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 类型检查
pnpm type-check

# 运行测试
pnpm test
```

### 构建

```bash
# 构建库文件
pnpm build:lib

# 预览构建结果
pnpm preview
```

## 📁 项目结构

```
pro-components-vue2/
├── src/                    # 源代码
│   ├── components/         # 组件库
│   ├── hooks/             # Hooks
│   ├── utils/             # 工具函数
│   └── test/              # 测试文件
├── examples/              # 示例项目
│   ├── basic/            # 基础示例
│   └── business/         # 业务示例
├── .vscode/              # VSCode 配置
├── .github/              # GitHub 配置
└── 配置文件...
```

## 🎯 开发规范

### 代码风格

- 使用 TypeScript
- 遵循 ESLint 规则
- 使用 Prettier 格式化
- 组件名使用 PascalCase
- 文件名使用 kebab-case

### 提交规范

```bash
# 功能开发
git commit -m "feat: 添加新功能"

# 修复问题
git commit -m "fix: 修复某个问题"

# 文档更新
git commit -m "docs: 更新文档"

# 样式调整
git commit -m "style: 调整代码格式"

# 重构
git commit -m "refactor: 重构某个模块"
```

## 🔧 开发技巧

### 使用代码模板

在 VSCode 中输入以下前缀，按 Tab 键自动补全：

- `page` - 完整页面模板
- `component` - 组件模板
- `edit-drawer` - 编辑抽屉模板
- `type-def` - 类型定义模板
- `enum-def` - 枚举定义模板
- `api-func` - API 函数模板
- `hooks-usage` - Hooks 使用模板

### 调试技巧

1. **组件调试**: 在浏览器开发者工具中查看组件状态
2. **Hooks 调试**: 使用 `console.log` 输出 Hooks 状态
3. **类型检查**: 使用 `pnpm type-check` 检查类型错误
4. **代码检查**: 使用 `pnpm lint` 检查代码规范

### 性能优化

1. **按需引入**: 只引入需要的组件和 Hooks
2. **代码分割**: 使用动态导入分割代码
3. **缓存优化**: 合理使用缓存策略
4. **构建优化**: 使用 `pnpm build:lib` 优化构建产物

## 🐛 常见问题

### 1. 开发服务器启动失败

```bash
# 检查端口是否被占用
lsof -i :3000

# 使用不同端口
pnpm dev --port 3001
```

### 2. 类型检查失败

```bash
# 清理缓存
rm -rf node_modules/.cache
pnpm install

# 重新类型检查
pnpm type-check
```

### 3. 构建失败

```bash
# 清理构建缓存
rm -rf dist

# 重新构建
pnpm build:lib
```

### 4. 依赖问题

```bash
# 清理依赖
rm -rf node_modules
rm pnpm-lock.yaml

# 重新安装
pnpm install
```

## 📚 相关文档

- [README.md](./README.md) - 项目介绍
- [QUICKSTART.md](./QUICKSTART.md) - 快速开始
- [CODE_TEMPLATES.md](./CODE_TEMPLATES.md) - 代码模板指南
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 部署指南

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支: `git checkout -b feature/AmazingFeature`
3. 提交更改: `git commit -m 'Add some AmazingFeature'`
4. 推送分支: `git push origin feature/AmazingFeature`
5. 提交 Pull Request

## 📞 技术支持

如果遇到问题，请：

1. 查看 [GitHub Issues](https://github.com/ihopefulChina/pro-components-vue2/issues)
2. 提交新的 Issue
3. 查看文档和示例
