<template>
  <ProFormItem :name="name" :label="label" :span="span" :required="required" :rules="rules" :tooltip="tooltip">
    <el-date-picker
      v-model="dateValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :clearable="clearable"
      :format="format"
      :value-format="valueFormat"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      v-bind="$attrs"
      style="width: 500px"
    />
  </ProFormItem>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from "@vue/composition-api"
import ProFormItem from "../ProFormItem.vue"

export default defineComponent({
  name: "ProFormDate",
  inheritAttrs: false,
  components: { ProFormItem },
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
    // 日期选择器属性
    value: {
      type: [String, Date, Array, Number],
      default: undefined
    },
    type: {
      type: String as PropType<"date" | "daterange" | "datetime" | "datetimerange">,
      default: "date"
    },
    startPlaceholder: {
      type: String,
      default: "开始时间"
    },
    endPlaceholder: {
      type: String,
      default: "结束时间"
    },
    placeholder: {
      type: String,
      default: "请选择"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    format: {
      type: String,
      default: "yyyy-MM-dd"
    },
    valueFormat: {
      type: String,
      default: "yyyy-MM-dd"
    }
  },
  emits: ["input"],
  setup(props, { emit }) {
    const dateValue = computed({
      get: () => {
        // 如果是时间戳，转换为日期字符串
        if (typeof props.value === "number") {
          return new Date(props.value)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ")
        }
        // 如果是数组（daterange），处理数组中的每个元素
        if (Array.isArray(props.value)) {
          const result = props.value.map(item => {
            if (typeof item === "number") {
              return new Date(item)
                .toISOString()
                .slice(0, 19)
                .replace("T", " ")
            }
            return item
          })
          return result
        }
        return props.value
      },
      set: val => {
        emit("input", val)
      }
    })

    return {
      dateValue
    }
  }
})
</script>
