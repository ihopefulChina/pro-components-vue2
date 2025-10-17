<template>
  <el-drawer
    class="drawer-form"
    :visible.sync="open"
    :size="width"
    :before-close="handleClose"
    :destroy-on-close="true"
    :close-on-click-modal="false"
  >
    <template #title>
      <span class="drawer-title">{{ title }}</span>
    </template>

    <div class="drawer-content">
      <ProForm
        ref="proForm"
        :initialValue="initialValue"
        :rules="rules"
        :readonly="isDetail"
        :disabled="isDetail"
        :inDrawer="true"
        @submit="handleSubmit"
        @cancel="handleClose"
      >
        <template #default="{ formData, isDetail }">
          <slot :form-data="formData" :is-detail="isDetail"></slot>
        </template>
      </ProForm>
    </div>
  </el-drawer>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
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
    width: { type: String, default: "800px" },
  },
  emits: ["onClose", "onSubmit"],
  setup(props, { emit }) {
    const proForm = ref<InstanceType<typeof ProForm> | null>(null);

    // 关闭弹窗
    const handleClose = () => {
      emit("onClose");
      proForm.value?.reset();
    };

    // 处理 ProForm 的提交事件
    const handleSubmit = (formData: Record<string, any>) => {
      emit("onSubmit", formData);
    };

    return {
      proForm,
      handleClose,
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
}

.drawer-title {
  font-size: 18px;
  font-weight: 900;
  color: #333;
}

.drawer-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  border-top: 1px solid #e8e8e8;
  background: #fff;
  text-align: right;
  z-index: 10;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}
</style>
