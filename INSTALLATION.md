# 安装指南

## 环境要求

- Node.js >= 18.0.0
- Vue 2.6.14（不支持 Vue 2.7）
- @vue/composition-api 1.7.0+
- Element UI 2.15.0+

## 安装步骤

### 1. 安装依赖

```bash
npm install pro-components-vue2
# 或
yarn add pro-components-vue2
```

### 2. 安装 peer dependencies

```bash
npm install vue@2.6.14 @vue/composition-api@^1.7.0 element-ui@^2.15.0
# 或
yarn add vue@2.6.14 @vue/composition-api@^1.7.0 element-ui@^2.15.0
```

### 3. 在项目中使用

#### 全局引入

```javascript
// main.js
import Vue from "vue";
import ElementUI from "element-ui";
import VueCompositionAPI from "@vue/composition-api";
import ProComponentsVue2 from "pro-components-vue2";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(VueCompositionAPI);
Vue.use(ElementUI);
Vue.use(ProComponentsVue2);

new Vue({
  render: h => h(App),
}).$mount("#app");
```

#### 按需引入

```javascript
// 引入组件
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

## 开发环境设置

### 1. 克隆项目

```bash
git clone https://github.com/ihopefulChina/pro-components-vue2.git
cd pro-components-vue2
```

### 2. 安装依赖

```bash
pnpm install --frozen-lockfile
```

### 3. 启动开发服务器

```bash
pnpm dev
```

### 4. 构建项目

```bash
pnpm build:lib
```

## 常见问题

### Q: 组件不显示怎么办？

A: 确保已经正确安装了所有依赖，并且按照上述步骤进行了配置。

### Q: TypeScript 类型错误？

A: 确保项目中的 TypeScript 版本与组件库兼容，并且正确配置了类型声明。

### Q: Element UI 样式不生效？

A: 确保引入了 Element UI 的样式文件：

```javascript
import "element-ui/lib/theme-chalk/index.css";
```

### Q: Composition API 不工作？

A: 确保在 Vue 实例创建之前安装了 @vue/composition-api：

```javascript
import VueCompositionAPI from "@vue/composition-api";

Vue.use(VueCompositionAPI);
```

## 技术支持

如果遇到问题，请：

1. 查看 [GitHub Issues](https://github.com/ihopefulChina/pro-components-vue2/issues)
2. 提交新的 Issue
3. 查看文档和示例

## 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本更新信息。
