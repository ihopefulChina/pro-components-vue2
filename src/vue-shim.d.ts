declare module "*.vue" {
  import Vue from "vue";
  const component: typeof Vue;
  export default component;
}
