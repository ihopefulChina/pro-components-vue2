<template>
  <el-dialog class="modal-form" :visible.sync="open" :width="width" :before-close="handleClose" :destroy-on-close="true" :close-on-click-modal="false" center>
    <template #title>
      <span class="modal-title">{{ title }}</span>
    </template>

    <div class="modal-content">
      <ProForm
        ref="proForm"
        :initialValue="initialValue"
        :rules="rules"
        :readonly="isDetail"
        :disabled="isDetail"
        inDrawer
        @submit="handleSubmit"
        @cancel="handleClose"
      >
        <template #default="{ formData, isDetail }">
          <slot :form-data="formData" :is-detail="isDetail"></slot>
        </template>
      </ProForm>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api"
import ProForm from "./ProForm.vue"

export default defineComponent({
  name: "ModalForm",
  components: { ProForm },
  props: {
    /** 表单标题 */
    title: { type: String, required: true },
    /** 表单弹窗是否可见 */
    open: { type: Boolean, required: true },
    /** 是否是查看详情 */
    isDetail: { type: Boolean, default: false },
    /** 初始化表单数据 */
    initialValue: { type: Object, default: undefined },
    /** 表单验证规则 */
    rules: { type: Object, default: () => ({}) },
    /** 弹窗宽度 */
    width: { type: String, default: "800px" }
  },
  emits: ["onClose", "onSubmit"],
  setup(props, { emit }) {
    const proForm = ref<InstanceType<typeof ProForm> | null>(null)

    /**
     * 关闭弹窗
     */
    const handleClose = () => {
      emit("onClose")
      proForm.value?.reset()
    }

    /**
     * 处理 ProForm 的提交事件
     * @param formData - 表单数据
     */
    const handleSubmit = (formData: Record<string, any>) => {
      emit("onSubmit", formData)
    }

    return {
      proForm,
      handleClose,
      handleSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.modal-form {
  ::v-deep .el-dialog__header {
    padding: 20px 20px 10px;
    border-bottom: 1px solid #e8e8e8;
  }

  ::v-deep .el-dialog__body {
    padding: 20px;
    max-height: 70vh;
    overflow-y: auto;
  }

  ::v-deep .el-dialog__footer {
    padding: 10px 20px 20px;
    border-top: 1px solid #e8e8e8;
    text-align: right;
  }
}

.modal-content {
  padding: 0;
  padding-bottom: 60px;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

// 响应式设计
@media (max-width: 768px) {
  .modal-form {
    ::v-deep .el-dialog {
      width: 95% !important;
      margin: 0 auto;
    }
  }
}
</style>
