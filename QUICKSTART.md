# 快速开始

## 5 分钟快速上手

### 1. 创建新项目

```bash
# 使用 Vue CLI 创建项目
vue create my-project
cd my-project

# 或使用 Vite
npm create vue@2 my-project
cd my-project
```

### 2. 安装组件库

```bash
npm install pro-components-vue2
npm install @vue/composition-api element-ui
```

### 3. 配置项目

```javascript
// main.js
import Vue from "vue";
import ElementUI from "element-ui";
import "@vue/composition-api";
import ProComponentsVue2 from "pro-components-vue2";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);
Vue.use(ProComponentsVue2);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
```

### 4. 使用组件

```vue
<template>
  <div>
    <!-- 基础表单 -->
    <ProForm :initial-value="formData" :rules="rules" @submit="handleSubmit">
      <ProFormText name="username" label="用户名" :required="true" />
      <ProFormSelect name="role" label="角色" :options="roleOptions" />
    </ProForm>

    <!-- 弹窗表单 -->
    <el-button @click="showModal = true">打开弹窗</el-button>
    <ModalForm
      :visible="showModal"
      title="用户信息"
      @submit="handleModalSubmit"
      @cancel="showModal = false"
    >
      <ProFormText name="name" label="姓名" />
    </ModalForm>
  </div>
</template>

<script>
import { ref, reactive } from "@vue/composition-api";

export default {
  setup() {
    const showModal = ref(false);

    const formData = reactive({
      username: "",
      role: "",
    });

    const rules = {
      username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    };

    const roleOptions = [
      { label: "管理员", value: "admin" },
      { label: "用户", value: "user" },
    ];

    const handleSubmit = (data) => {
      console.log("表单数据:", data);
    };

    const handleModalSubmit = (data) => {
      console.log("弹窗数据:", data);
      showModal.value = false;
    };

    return {
      showModal,
      formData,
      rules,
      roleOptions,
      handleSubmit,
      handleModalSubmit,
    };
  },
};
</script>
```

## 更多示例

### 使用 Hooks

```javascript
import { useValidateForm, useMessage } from "pro-components-vue2";

export default {
  setup() {
    const { validateField } = useValidateForm("username");
    const { success, error } = useMessage();

    const handleValidate = () => {
      validateField("username");
    };

    const showMessage = () => {
      success("操作成功！");
    };

    return {
      handleValidate,
      showMessage,
    };
  },
};
```

### 自定义标签页

```vue
<template>
  <CustomTabs v-model="activeTab" :tabs="tabs" @change="handleTabChange">
    <template #default="{ tab }">
      <div>
        <h3>{{ tab.label }}</h3>
        <p>内容: {{ tab.content }}</p>
      </div>
    </template>
  </CustomTabs>
</template>

<script>
import { ref } from "@vue/composition-api";

export default {
  setup() {
    const activeTab = ref("tab1");

    const tabs = [
      { label: "标签页1", value: "tab1", content: "这是第一个标签页的内容" },
      { label: "标签页2", value: "tab2", content: "这是第二个标签页的内容" },
    ];

    const handleTabChange = (value) => {
      console.log("切换到:", value);
    };

    return {
      activeTab,
      tabs,
      handleTabChange,
    };
  },
};
</script>
```

## 下一步

- 查看 [完整文档](./README.md)
- 浏览 [组件示例](./examples/)
- 了解 [API 文档](./docs/)
- 参与 [社区讨论](https://github.com/ihopefulChina/pro-components-vue2/discussions)
