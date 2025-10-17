import Vue from "vue";
import VueCompositionAPI from "@vue/composition-api";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

// 安装 Vue Composition API
Vue.use(VueCompositionAPI);

// 安装 Element UI
Vue.use(ElementUI);

// 全局配置
Vue.config.productionTip = false;
