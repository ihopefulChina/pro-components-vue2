import VueCompositionAPI from "@vue/composition-api";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./styles/index.scss";

Vue.config.productionTip = false;
Vue.use(VueCompositionAPI);
Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App),
}).$mount("#app");
