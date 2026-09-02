<template>
  <el-drawer
    class="drawer-form"
    :visible="open"
    :size="width"
    :before-close="handleBeforeClose"
    destroy-on-close
    :close-on-click-modal="false"
    @closed="resetForm"
  >
    <template #title>
      <span class="drawer-title">{{ title }}</span>
    </template>

    <div class="drawer-content">
      <ProForm
        ref="proForm"
        :initial-value="initialValue"
        :rules="rules"
        :readonly="isDetail"
        :disabled="isDetail"
        in-drawer
        :submitter="handleSubmit"
        @cancel="handleClose"
      >
        <template #default="{ formData, isDetail: slotIsDetail }">
          <slot :form-data="formData" :is-detail="slotIsDetail" />
        </template>
      </ProForm>
    </div>
  </el-drawer>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "@vue/composition-api";
import ProForm from "./ProForm.vue";

export default defineComponent({
  name: "DrawerForm",
  components: { ProForm },
  props: {
    /** 表单标题 */
    title: { type: String, required: true },
    /** 表单弹窗是否可见 */
    open: { type: Boolean, required: true },
    /** 是否是查看详情 */
    isDetail: { type: Boolean, default: false },
    /**  初始化表单数据 */
    initialValue: { type: Object, default: undefined },

    /** 表单验证规则 */
    rules: { type: Object, default: () => ({}) },
    /** 抽屉宽度 */
    width: { type: [String, Number], default: "800px" },
    /** 可等待的提交函数 */
    submitter: {
      type: Function as PropType<(values: Record<string, unknown>) => void | Promise<void>>,
      default: undefined,
    },
    /** 关闭回调，便于配合 useDrawerForm 的 v-bind 用法 */
    onClose: {
      type: Function as PropType<() => void>,
      default: undefined,
    },
  },
  emits: ["close", "submit"],
  setup(props, { emit }) {
    const proForm = ref<InstanceType<typeof ProForm> | null>(null);

    // 关闭弹窗
    const handleClose = () => {
      props.onClose?.();
      emit("close");
    };

    const handleBeforeClose = (done: () => void) => {
      handleClose();
      done();
    };

    const resetForm = () => {
      proForm.value?.reset();
    };

    // 处理 ProForm 的提交事件
    const handleSubmit = async (formData: Record<string, unknown>) => {
      await props.submitter?.(formData);
      emit("submit", formData);
    };

    return {
      proForm,
      handleClose,
      handleBeforeClose,
      resetForm,
      handleSubmit,
    };
  },
});
</script>

<style lang="scss" scoped>
.drawer-form {
  ::v-deep .el-drawer__header {
    margin-bottom: 10px;
  }
}

.drawer-content {
  padding: 0 20px;
  padding-bottom: 80px;
  overflow-y: auto;
  max-height: calc(100vh - 80px);
}

.drawer-title {
  font-size: 18px;
  font-weight: 900;
  color: #333;
}
</style>
