<template>
  <ProFormItem :name="name" :label="label" :span="span" :required="required" :rules="rules" :tooltip="tooltip">
    <el-rate
      v-model="rateValue"
      :max="max"
      :disabled="disabled"
      :allow-half="allowHalf"
      :low-threshold="lowThreshold"
      :high-threshold="highThreshold"
      :colors="colors"
      :void-color="voidColor"
      :disabled-void-color="disabledVoidColor"
      :icon-classes="iconClasses"
      :void-icon-class="voidIconClass"
      :disabled-void-icon-class="disabledVoidIconClass"
      :show-text="showText"
      :show-score="showScore"
      :text-color="textColor"
      :texts="texts"
      :score-template="scoreTemplate"
      v-bind="$attrs"
    />
  </ProFormItem>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from "@vue/composition-api"
import ProFormItem from "../ProFormItem.vue"

export default defineComponent({
  name: "ProFormRate",
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
    // 评分属性
    value: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 5
    },
    disabled: {
      type: Boolean,
      default: false
    },
    allowHalf: {
      type: Boolean,
      default: false
    },
    lowThreshold: {
      type: Number,
      default: 2
    },
    highThreshold: {
      type: Number,
      default: 4
    },
    colors: {
      type: [String, Array] as PropType<string | string[]>,
      default: () => ["#F7BA2A", "#F7BA2A", "#F7BA2A"]
    },
    voidColor: {
      type: String,
      default: "#C6D1DE"
    },
    disabledVoidColor: {
      type: String,
      default: "#EFF2F7"
    },
    iconClasses: {
      type: Array as PropType<string[]>,
      default: () => ["el-icon-star-on", "el-icon-star-on", "el-icon-star-on"]
    },
    voidIconClass: {
      type: String,
      default: "el-icon-star-off"
    },
    disabledVoidIconClass: {
      type: String,
      default: "el-icon-star-on"
    },
    showText: {
      type: Boolean,
      default: false
    },
    showScore: {
      type: Boolean,
      default: false
    },
    textColor: {
      type: String,
      default: "#1F2D3D"
    },
    texts: {
      type: Array as PropType<string[]>,
      default: () => ["极差", "失望", "一般", "满意", "惊喜"]
    },
    scoreTemplate: {
      type: String,
      default: "{ value }"
    }
  },
  emits: ["input", "change"],
  setup(props, { emit }) {
    const rateValue = computed({
      get: () => props.value,
      set: val => {
        emit("input", val)
        emit("change", val)
      }
    })

    return {
      rateValue
    }
  }
})
</script>
