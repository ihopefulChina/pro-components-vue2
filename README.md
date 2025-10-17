# Pro Components Vue2

基于 Vue2 + Composition API + TypeScript 的高质量组件库

[![npm version](https://img.shields.io/npm/v/pro-components-vue2.svg)](https://www.npmjs.com/package/pro-components-vue2)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/ihopefulChina/pro-components-vue2.svg)](https://github.com/ihopefulChina/pro-components-vue2)

## ✨ 特性

- 🎯 **基于 Vue2 + Composition API** - 现代化的开发体验
- 📦 **TypeScript** - 完整的类型支持
- 🎨 **Element UI 集成** - 基于 Element UI 的组件封装
- 🚀 **开箱即用** - 丰富的业务组件
- 📱 **响应式设计** - 适配各种屏幕尺寸
- 🔧 **高度可配置** - 灵活的组件配置选项

## 📦 安装

```bash
npm install pro-components-vue2
# 或
yarn add pro-components-vue2
```

## 🚀 快速开始

### 全局引入

```javascript
import Vue from "vue";
import ProComponentsVue2 from "pro-components-vue2";
import ElementUI from "element-ui";
import "@vue/composition-api";

Vue.use(ElementUI);
Vue.use(ProComponentsVue2);
```

### 按需引入

```javascript
import { ProForm, ProFormText, useValidateForm } from "pro-components-vue2";

export default {
  components: {
    ProForm,
    ProFormText,
  },
  setup() {
    const { validateField } = useValidateForm();

    return {
      validateField,
    };
  },
};
```

## 📚 组件文档

### 组件文档

我们提供了详细的组件文档和使用说明：

- **组件列表**: 查看 `src/components/` 目录下的所有组件
- **Hooks 文档**: 查看 `src/hooks/` 目录下的所有 Hooks
- **类型定义**: 查看 `src/types/` 目录下的类型定义
  - 用户管理页面
  - 商品管理页面
  - 订单管理页面

### 表单组件

#### ProForm - 高级表单

```vue
<template>
  <ProForm :initial-value="formData" :rules="rules" @submit="handleSubmit">
    <ProFormText name="username" label="用户名" :required="true" />
    <ProFormSelect name="role" label="角色" :options="roleOptions" />
  </ProForm>
</template>
```

#### ProFormItem - 表单项

```vue
<template>
  <ProFormItem name="email" label="邮箱" :rules="emailRules">
    <el-input v-model="email" />
  </ProFormItem>
</template>
```

#### ModalForm - 弹窗表单

```vue
<template>
  <ModalForm
    :visible="visible"
    title="编辑用户"
    :initial-value="userData"
    @submit="handleSubmit"
    @cancel="handleCancel"
  >
    <ProFormText name="name" label="姓名" />
  </ModalForm>
</template>
```

#### DrawerForm - 抽屉表单

```vue
<template>
  <DrawerForm
    :open="open"
    title="用户详情"
    :initial-value="userData"
    @submit="handleSubmit"
    @onClose="handleClose"
  >
    <ProFormText name="name" label="姓名" />
  </DrawerForm>
</template>
```

### 表格组件

#### ProTable - 高级表格

```vue
<template>
  <ProTable :columns="columns" :request="loadData" :pagination="paginationConfig" />
</template>
```

### 其他组件

#### CustomTabs - 自定义标签页

```vue
<template>
  <CustomTabs v-model="activeTab" :tabs="tabList" @change="handleTabChange">
    <template #default="{ tab }">
      <div>内容: {{ tab.label }}</div>
    </template>
  </CustomTabs>
</template>
```

## 🎣 Hooks

### useValidateForm - 表单验证

```javascript
import { useValidateForm } from "pro-components-vue2";

export default {
  setup() {
    const { validateField, formRef } = useValidateForm("fieldName");

    const handleValidate = () => {
      validateField("fieldName");
    };

    return {
      validateField: handleValidate,
      formRef,
    };
  },
};
```

### useDialog - 对话框

```javascript
import { useDialog } from "pro-components-vue2";

export default {
  setup() {
    const { showDialog, hideDialog } = useDialog();

    const openDialog = () => {
      showDialog({
        title: "确认",
        content: "确定要删除吗？",
        onConfirm: () => {
          console.log("确认");
          hideDialog();
        },
      });
    };

    return { openDialog };
  },
};
```

### useMessage - 消息提示

```javascript
import { useMessage } from "pro-components-vue2";

export default {
  setup() {
    const { success, error, warning, info } = useMessage();

    const showSuccess = () => {
      success("操作成功！");
    };

    return { showSuccess };
  },
};
```

## 🛠️ 开发

### 环境要求

- Node.js >= 16
- Vue 2.6+
- @vue/composition-api
- Element UI 2.15+

### 本地开发

```bash
# 克隆项目
git clone https://github.com/ihopefulChina/pro-components-vue2.git

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 测试
npm run test
```

### 开发环境

```bash
# 启动开发服务器
pnpm dev

# 构建组件库
pnpm build:lib

# 运行测试
pnpm test
```

## 📄 许可证

[MIT](LICENSE)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

- GitHub: [@ihopefulChina](https://github.com/ihopefulChina)
- 项目地址: [pro-components-vue2](https://github.com/ihopefulChina/pro-components-vue2)

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
