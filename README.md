<p align="center">
  <img width="112" src="./assets/logo.svg" alt="Pro Components Vue2 logo" />
</p>

<h1 align="center">Pro Components Vue2</h1>

<p align="center">
  面向 Vue 2.6 与 Element UI 的 TypeScript 业务组件库。<br />
  用可预测的表单、表格和组合式 Hooks，减少后台系统里的重复代码。
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/pro-components-vue2"><img src="https://img.shields.io/npm/v/pro-components-vue2?color=1677ff" alt="npm version" /></a>
  <a href="https://github.com/ihopefulChina/pro-components-vue2/actions/workflows/ci.yml"><img src="https://github.com/ihopefulChina/pro-components-vue2/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-101828" alt="MIT license" /></a>
  <a href="https://www.npmjs.com/package/pro-components-vue2"><img src="https://img.shields.io/npm/types/pro-components-vue2?color=13c2c2" alt="TypeScript declarations" /></a>
</p>

<p align="center">
  <a href="https://ihopefulchina.github.io/pro-components-vue2/">文档站</a>
  · <a href="#快速开始">快速开始</a>
  · <a href="#组件">组件</a>
  · <a href="#hooks-与工具">Hooks</a>
  · <a href="./CHANGELOG.md">更新日志</a>
</p>

---

## 为什么使用它

Pro Components Vue2 服务于仍在稳定运行的 Vue 2.6 管理后台。它没有隐藏 Element UI，而是在其上补齐高频业务能力：Schema 查询、分页请求、异步表单、动态字段、可排序分段和一致的反馈 Hooks。

- 25 个公开组件：表单容器、17 个字段、查询、表格和导航结构。
- Vue 2 Composition API：提供现代状态组织方式，不要求迁移 Vue 3。
- 内置 TypeScript 声明：组件、配置对象与 Hooks 随包发布。
- 明确异步语义：提交和查询可等待，自动 loading，并阻止重复操作。
- 可访问交互：标签类组件支持方向键、Home、End 和可见焦点。
- 可复现发布：格式、Lint、类型、回归、库构建和文档构建进入同一质量门禁。

## 快速开始

### 1. 安装

```bash
pnpm add pro-components-vue2 vue@2.6.14 @vue/composition-api element-ui
```

Vue、Composition API 和 Element UI 是 peer dependencies，不会在组件库内部重复打包。

### 2. 全局注册

```ts
import Vue from "vue";
import VueCompositionAPI from "@vue/composition-api";
import ElementUI from "element-ui";
import ProComponentsVue2 from "pro-components-vue2";
import "element-ui/lib/theme-chalk/index.css";
import "pro-components-vue2/style.css";

Vue.use(VueCompositionAPI);
Vue.use(ElementUI);
Vue.use(ProComponentsVue2);
```

Composition API 必须先于组件库注册。

### 3. 使用 ProForm

```vue
<template>
  <ProForm :initial-value="record" :rules="rules" :submitter="save">
    <template #default="{ formData }">
      <ProFormText
        v-model="formData.name"
        name="name"
        label="项目名称"
        placeholder="请输入项目名称"
        required
      />
      <ProFormSelect
        v-model="formData.status"
        name="status"
        label="状态"
        :options="statusOptions"
      />
    </template>
  </ProForm>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  setup() {
    const record = { name: "会员中心", status: 1 };
    const rules = {
      name: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
    };
    const statusOptions = [
      { label: "运行中", value: 1 },
      { label: "已暂停", value: 0 },
    ];
    const save = async (values: Record<string, unknown>) => {
      await api.save(values);
    };

    return { record, rules, save, statusOptions };
  },
});
</script>
```

`submitter` 返回的 Promise 未结束前，提交按钮会保持 loading，重复提交会被阻止。校验和提交成功后再触发 `submit` 事件。

### 4. 使用 ProTable

```vue
<template>
  <ProTable :columns="columns" :request="loadUsers" row-key="id">
    <template #toolBar>
      <el-button type="primary">新建用户</el-button>
    </template>
  </ProTable>
</template>

<script lang="ts">
import type { ICommonTableColumn } from "pro-components-vue2";

const columns: ICommonTableColumn[] = [
  { prop: "name", label: "姓名", searchPlaceholder: "搜索姓名" },
  {
    prop: "status",
    label: "状态",
    valueType: "select",
    valueEnum: {
      1: { label: "启用", value: 1, status: "success" },
      0: { label: "停用", value: 0, status: "warning" },
    },
  },
  {
    prop: "action",
    label: "操作",
    type: "actions",
    hideInSearch: true,
    buttons: [{ text: "编辑", type: "text", onClick: row => edit(row) }],
  },
];

const loadUsers = async (params: Record<string, unknown>) => {
  const result = await api.list(params);
  return { data: result.list, total: result.total, success: true };
};
</script>
```

## 按需引入

所有组件、Hooks 与公共类型都有命名导出：

```ts
import {
  ProForm,
  ProFormText,
  ProTable,
  useMessage,
  useProTableRequest,
  type ICommonTableColumn,
} from "pro-components-vue2";

export default {
  components: { ProForm, ProFormText, ProTable },
};
```

样式仍需引入一次：

```ts
import "pro-components-vue2/style.css";
```

## 组件

| 类别     | 组件                 | 用途                               |
| -------- | -------------------- | ---------------------------------- |
| 表单容器 | `ProForm`            | 数据、校验、异步提交和公开实例方法 |
| 表单容器 | `ProFormItem`        | 栅格、规则与帮助信息               |
| 表单容器 | `ModalForm`          | Dialog 中的完整表单工作流          |
| 表单容器 | `DrawerForm`         | Drawer 中的长表单和详情工作流      |
| 表单字段 | `ProFormText`        | 单行文本与密码                     |
| 表单字段 | `ProFormTextarea`    | 多行文本与自适应高度               |
| 表单字段 | `ProFormNumber`      | 边界、步长和精度数字输入           |
| 表单字段 | `ProFormSelect`      | 单选、多选和筛选                   |
| 表单字段 | `ProFormRadio`       | 单项选择组                         |
| 表单字段 | `ProFormCheckbox`    | 多项选择与数量边界                 |
| 表单字段 | `ProFormDate`        | 日期、日期时间和范围               |
| 表单字段 | `ProFormCascader`    | 级联选择与完整事件转发             |
| 表单字段 | `ProFormSwitch`      | 布尔或自定义值切换                 |
| 表单字段 | `ProFormUpload`      | 文件列表、拖拽与上传生命周期       |
| 表单字段 | `ProFormRange`       | 输入、滑块或下拉范围               |
| 表单字段 | `ProFormRate`        | 评分与辅助文案                     |
| 表单字段 | `ProFormSlider`      | 单值或范围滑块                     |
| 表单字段 | `ProFormDynamicTags` | 可增删标签与数量限制               |
| 表单字段 | `ProFormList`        | 可新增、删除和拖拽排序的结构列表   |
| 表单字段 | `ProFormDependency`  | 条件依赖字段                       |
| 表单字段 | `ProFormInfo`        | 表单栅格内的只读信息               |
| 数据录入 | `SearchForm`         | Schema 查询、校验与异步 loading    |
| 数据展示 | `ProTable`           | 搜索、表格、分页、枚举和行操作     |
| 导航     | `CustomTabs`         | 键盘可达的受控标签页               |
| 导航     | `Segmented`          | 可新增、删除和排序的分段面板       |

每个组件的实时示例、代码、Props、Events、Slots 和 Methods 请查看[文档站](https://ihopefulchina.github.io/pro-components-vue2/#/components)。

## Hooks 与工具

| API                  | 作用                                   |
| -------------------- | -------------------------------------- |
| `useMessage`         | 类型化的 Element UI Message            |
| `useDialog`          | 返回 `Promise<boolean>` 的确认对话框   |
| `useDrawerForm`      | 新增、编辑、详情和复制模式             |
| `useProTableRequest` | 接口分页适配、刷新、重置与最后请求获胜 |
| `useMutate`          | 详情请求、空状态、错误和 loading       |
| `useState`           | Vue 2 组件的受控/非受控状态            |
| `useSuperLock`       | 异步并发锁和冷却窗口                   |
| `useValidateForm`    | 从字段组件触发 ProForm 校验            |
| `useGlobalThis`      | 在 `setup` 中获取 Vue 实例代理         |
| `guid`               | 生成前端局部唯一标识                   |

## 兼容性

| 依赖或环境             | 支持范围                                    |
| ---------------------- | ------------------------------------------- |
| Vue                    | `>= 2.6.14 < 2.7.0`                         |
| `@vue/composition-api` | `^1.7.0`                                    |
| Element UI             | `^2.15.0`                                   |
| Node.js                | `>= 18`                                     |
| 构建产物               | ESM、UMD、CSS、TypeScript 声明与 source map |

Vue 2.7 内置 Composition API 与当前依赖模型不同，不在 1.0.0 的支持范围内。

## 工程结构

项目使用轻量 pnpm workspace，不搬动已有发布源码：

```text
pro-components-vue2/
├── src/                  # 可发布组件、Hooks、类型和回归测试
├── docs/                 # 独立 Vite 文档站与实时示例
├── dist/                 # ESM、UMD、CSS 和 DTS 构建产物
├── pnpm-workspace.yaml
└── package.json          # npm 的唯一发布入口
```

这种结构保留包入口和源码历史，同时让官网拥有独立依赖与部署生命周期。无需为了“看起来像 monorepo”而重写已经工作的组件。

## 本地开发

```bash
pnpm install
pnpm dev:docs
```

完整验证：

```bash
pnpm check
```

也可以分别执行：

```bash
pnpm lint:check
pnpm format:check
pnpm type-check
pnpm test
pnpm test:coverage
pnpm build:lib
pnpm build:docs
```

静态检查和构建通过不等于真实业务 UAT。发布前仍应在消费项目中验证关键页面和后端契约。

## 发布

正式包只包含 `dist/`、`README.md` 和 `LICENSE`。发布前脚本会执行格式、Lint、类型、回归和库构建：

```bash
npm pack --dry-run
npm publish --access public
```

CI 只在 `v*` tag 上执行 npm 发布，普通 `main` push 不会创建新版本。

## 贡献

1. 从最窄、可复现的失败用例开始。
2. 复用最近的同类实现，不改变无关公共契约。
3. 为用户可感知的修复补充回归测试和文档。
4. 运行 `pnpm check`，并在变更说明中列出未执行的 UAT。

更多细节见 [DEVELOPMENT.md](./DEVELOPMENT.md) 与 [CODE_TEMPLATES.md](./CODE_TEMPLATES.md)。

## License

[MIT](./LICENSE) © ihopefulChina
