// 组件导出
export { default as DrawerForm } from "./components/proForm/DrawerForm.vue";
export { default as ModalForm } from "./components/proForm/ModalForm.vue";
export { default as ProForm } from "./components/proForm/ProForm.vue";
export { default as ProFormItem } from "./components/proForm/ProFormItem.vue";

// ProForm 字段组件
export { default as ProFormCascader } from "./components/proForm/fields/ProFormCascader.vue";
export { default as ProFormCheckbox } from "./components/proForm/fields/ProFormCheckbox.vue";
export { default as ProFormDate } from "./components/proForm/fields/ProFormDate.vue";
export { default as ProFormDependency } from "./components/proForm/fields/ProFormDependency.vue";
export { default as ProFormDynamicTags } from "./components/proForm/fields/ProFormDynamicTags.vue";
export { default as ProFormInfo } from "./components/proForm/fields/ProFormInfo.vue";
export { default as ProFormList } from "./components/proForm/fields/ProFormList.vue";
export { default as ProFormNumber } from "./components/proForm/fields/ProFormNumber.vue";
export { default as ProFormRadio } from "./components/proForm/fields/ProFormRadio.vue";
export { default as ProFormRange } from "./components/proForm/fields/ProFormRange.vue";
export { default as ProFormRate } from "./components/proForm/fields/ProFormRate.vue";
export { default as ProFormSelect } from "./components/proForm/fields/ProFormSelect.vue";
export { default as ProFormSlider } from "./components/proForm/fields/ProFormSlider.vue";
export { default as ProFormSwitch } from "./components/proForm/fields/ProFormSwitch.vue";
export { default as ProFormText } from "./components/proForm/fields/ProFormText.vue";
export { default as ProFormTextarea } from "./components/proForm/fields/ProFormTextarea.vue";
export { default as ProFormUpload } from "./components/proForm/fields/ProFormUpload.vue";

// 其他组件
export { default as CustomTabs } from "./components/customTabs/index.vue";
export { default as ProTable } from "./components/proTable/index.vue";
export { default as SearchForm } from "./components/searchForm/index.vue";
export { default as Segmented } from "./components/segmented/index.vue";

// Hooks 导出
export { useValidateForm } from "./components/proForm/hooks/useValidateForm";
export { useDialog } from "./hooks/useDialog";
export { useDrawerForm } from "./hooks/useDrawerForm";
export { useGlobalThis } from "./hooks/useGlobalThis";
export { useMessage } from "./hooks/useMessage";
export { useMutate } from "./hooks/useMutate";
export { useProTableRequest } from "./hooks/useProTableRequest";
export { useState } from "./hooks/useState";
export { useSuperLock } from "./hooks/useSuperLock";

// 工具函数
export { guid } from "./utils/guid";

// 类型导出
export * from "./components/proForm/type/index.d";
export * from "./components/proForm/types";
export * from "./components/proTable/type.d";
export * from "./components/searchForm/types";

// 默认导出所有组件
import CustomTabs from "./components/customTabs/index.vue";
import DrawerForm from "./components/proForm/DrawerForm.vue";
import ModalForm from "./components/proForm/ModalForm.vue";
import ProForm from "./components/proForm/ProForm.vue";
import ProFormItem from "./components/proForm/ProFormItem.vue";
import ProTable from "./components/proTable/index.vue";
import SearchForm from "./components/searchForm/index.vue";
import Segmented from "./components/segmented/index.vue";

const components = [
  ProForm,
  ProFormItem,
  ModalForm,
  DrawerForm,
  ProTable,
  SearchForm,
  CustomTabs,
  Segmented,
];

const install = (Vue: any) => {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

export default {
  install,
  ProForm,
  ProFormItem,
  ModalForm,
  DrawerForm,
  ProTable,
  SearchForm,
  CustomTabs,
  Segmented,
};
