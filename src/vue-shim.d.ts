declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "@vue/composition-api" {
  export * from "vue";
  export {
    computed,
    defineComponent,
    nextTick,
    onMounted,
    onUnmounted,
    reactive,
    ref,
    watch,
  } from "vue";
}
