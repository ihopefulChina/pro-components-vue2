<template>
  <el-col :span="span">
    <el-form-item ref="formItemRef" :label="label" :prop="name" :rules="rules" :required="required" :style="formItemStyle">
      <!-- 提示信息 -->
      <div v-if="tooltip" class="pro-form-item-tooltip">
        <el-tooltip :content="tooltip" placement="top" :disabled="!tooltip">
          <i class="el-icon-question" />
        </el-tooltip>
        <span class="tooltip-text">{{ tooltip }}</span>
      </div>

      <!-- 表单项内容 -->
      <slot />
    </el-form-item>
  </el-col>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api"
import { ElFormItem } from "element-ui/types/form-item"

export default defineComponent({
  name: "ProFormItem",
  inheritAttrs: false,
  props: {
    // 表单项属性
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    span: {
      type: Number,
      default: 24
    },
    required: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default: () => []
    },
    // 提示信息
    tooltip: {
      type: String,
      default: ""
    },
    formItemStyle: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const formItemRef = ref<InstanceType<typeof ElFormItem>>()

    const resetField = () => {
      formItemRef.value?.resetField()
    }

    const clearValidate = () => {
      formItemRef.value?.clearValidate()
    }

    return {
      formItemRef,
      resetField,
      clearValidate
    }
  }
})
</script>

<style lang="scss" scoped>
.pro-form-item-tooltip {
  display: flex;
  align-items: center;
  margin-top: -10px;
  margin-bottom: 10px;
  font-size: 12px;
  color: #909399;

  .el-icon-question {
    margin-right: 4px;
    cursor: help;
    color: #409eff;

    &:hover {
      color: #66b1ff;
    }
  }

  .tooltip-text {
    flex: 1;
    line-height: 1.4;
  }
}
</style>
