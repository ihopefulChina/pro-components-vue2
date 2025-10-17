<template>
  <ProFormItem :name="name" :label="label" :span="span" :required="required" :rules="rules" :tooltip="tooltip">
    <el-cascader
      v-model="cascaderValue"
      :options="options"
      :props="cascaderProps"
      :size="size"
      :placeholder="placeholder"
      :disabled="disabled"
      :clearable="clearable"
      :show-all-levels="showAllLevels"
      :collapse-tags="collapseTags"
      :separator="separator"
      :filterable="filterable"
      :filter-method="filterMethod"
      :debounce="debounce"
      :before-filter="beforeFilter"
      :popper-class="popperClass"
      :popper-append-to-body="popperAppendToBody"
      :tag-type="tagType"
      :validate-event="validateEvent"
      v-bind="$attrs"
    />
  </ProFormItem>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from "@vue/composition-api"
import ProFormItem from "../ProFormItem.vue"

interface CascaderOption {
  value: any
  label: string
  children?: CascaderOption[]
  disabled?: boolean
  leaf?: boolean
}

interface CascaderProps {
  expandTrigger?: "click" | "hover"
  multiple?: boolean
  checkStrictly?: boolean
  emitPath?: boolean
  lazy?: boolean
  lazyLoad?: (node: any, resolve: any) => void
  value?: string
  label?: string
  children?: string
  disabled?: string | ((data: any, node: any) => boolean)
  leaf?: string | ((data: any, node: any) => boolean)
}

export default defineComponent({
  name: "ProFormCascader",
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
    // 级联选择器属性
    value: {
      type: [String, Number, Array],
      default: undefined
    },
    options: {
      type: Array as PropType<CascaderOption[]>,
      default: () => []
    },
    cascaderProps: {
      type: Object as PropType<CascaderProps>,
      default: () => ({})
    },
    size: {
      type: String,
      default: "medium"
    },
    placeholder: {
      type: String,
      default: "请选择"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    showAllLevels: {
      type: Boolean,
      default: true
    },
    collapseTags: {
      type: Boolean,
      default: false
    },
    separator: {
      type: String,
      default: " / "
    },
    filterable: {
      type: Boolean,
      default: false
    },
    filterMethod: {
      type: Function as PropType<(node: any, keyword: string) => boolean>,
      default: undefined
    },
    debounce: {
      type: Number,
      default: 300
    },
    beforeFilter: {
      type: Function as PropType<(value: string) => boolean>,
      default: undefined
    },
    popperClass: {
      type: String,
      default: ""
    },
    popperAppendToBody: {
      type: Boolean,
      default: true
    },
    tagType: {
      type: String,
      default: "info"
    },
    validateEvent: {
      type: Boolean,
      default: true
    }
  },
  emits: ["input", "change", "expand-change", "blur", "focus", "visible-change", "remove-tag"],
  setup(props, { emit }) {
    const cascaderValue = computed({
      get: () => props.value,
      set: val => {
        emit("input", val)
        emit("change", val)
      }
    })

    const handleExpandChange = (value: any) => {
      emit("expand-change", value)
    }

    const handleBlur = (event: Event) => {
      emit("blur", event)
    }

    const handleFocus = (event: Event) => {
      emit("focus", event)
    }

    const handleVisibleChange = (visible: boolean) => {
      emit("visible-change", visible)
    }

    const handleRemoveTag = (value: any) => {
      emit("remove-tag", value)
    }

    return {
      cascaderValue,
      handleExpandChange,
      handleBlur,
      handleFocus,
      handleVisibleChange,
      handleRemoveTag
    }
  }
})
</script>
