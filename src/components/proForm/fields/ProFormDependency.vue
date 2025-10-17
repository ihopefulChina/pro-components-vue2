<template>
  <ProFormItem :name="name" :label="label" :span="span" :required="required" :rules="rules" :tooltip="tooltip">
    <div class="pro-form-dependency">
      <!-- 依赖字段显示 -->
      <div v-if="showDependentFields" class="dependent-fields">
        <slot :formData="formData" :dependencies="dependencies" :isVisible="isVisible" :isDisabled="isDisabled" :isRequired="isRequired">
          <!-- 默认显示依赖字段 -->
          <div v-for="field in dependentFields" :key="field.name" class="dependent-field">
            <component :is="field.component" v-bind="field.props" :value="formData[field.name]" @input="updateField(field.name, $event)" />
          </div>
        </slot>
      </div>

      <!-- 无依赖时的内容 -->
      <div v-else-if="showNoDependency" class="no-dependency">
        <slot name="no-dependency">
          <div class="no-dependency-text">{{ noDependencyText }}</div>
        </slot>
      </div>
    </div>
  </ProFormItem>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref } from "@vue/composition-api"
import ProFormItem from "../ProFormItem.vue"

interface DependencyRule {
  field: string
  operator: "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "in" | "nin" | "contains" | "regex"
  value: any
  logic?: "and" | "or"
}

interface DependentField {
  name: string
  component: string
  props: Record<string, any>
  visible?: boolean
  disabled?: boolean
  required?: boolean
}

export default defineComponent({
  name: "ProFormDependency",
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
    // 依赖配置
    dependencies: {
      type: Array as () => DependencyRule[],
      required: true
    },
    dependentFields: {
      type: Array as () => DependentField[],
      default: () => []
    },
    // 表单数据
    formData: {
      type: Object,
      required: true
    },
    // 显示配置
    showNoDependency: {
      type: Boolean,
      default: false
    },
    noDependencyText: {
      type: String,
      default: "请先满足依赖条件"
    },
    // 依赖逻辑
    logic: {
      type: String as () => "and" | "or",
      default: "and"
    }
  },
  emits: ["input", "dependency-change"],
  setup(props, { emit }) {
    const isVisible = ref(true)
    const isDisabled = ref(false)
    const isRequired = ref(false)

    // 检查依赖条件
    const checkDependencies = () => {
      const { dependencies, formData, logic } = props

      if (!dependencies || dependencies.length === 0) {
        return true
      }

      const results = dependencies.map(rule => {
        const fieldValue = formData[rule.field]
        const { operator, value } = rule

        switch (operator) {
          case "eq":
            return fieldValue === value
          case "ne":
            return fieldValue !== value
          case "gt":
            return fieldValue > value
          case "gte":
            return fieldValue >= value
          case "lt":
            return fieldValue < value
          case "lte":
            return fieldValue <= value
          case "in":
            return Array.isArray(value) && value.includes(fieldValue)
          case "nin":
            return Array.isArray(value) && !value.includes(fieldValue)
          case "contains":
            return String(fieldValue).includes(String(value))
          case "regex":
            return new RegExp(value).test(String(fieldValue))
          default:
            return false
        }
      })

      return logic === "or" ? results.some(result => result) : results.every(result => result)
    }

    // 更新字段值
    const updateField = (fieldName: string, value: any) => {
      const newFormData = { ...props.formData, [fieldName]: value }
      emit("input", newFormData)
    }

    // 计算是否显示依赖字段
    const showDependentFields = computed(() => {
      const satisfied = checkDependencies()
      isVisible.value = satisfied

      // 更新依赖字段的显示状态
      props.dependentFields.forEach(field => {
        if (field.visible !== undefined) {
          field.visible = satisfied
        }
        if (field.disabled !== undefined) {
          field.disabled = !satisfied
        }
        if (field.required !== undefined) {
          field.required = satisfied
        }
      })

      return satisfied
    })

    // 监听表单数据变化
    watch(
      () => props.formData,
      () => {
        const satisfied = checkDependencies()
        const changed = isVisible.value !== satisfied

        isVisible.value = satisfied
        isDisabled.value = !satisfied

        if (changed) {
          emit("dependency-change", {
            satisfied,
            dependencies: props.dependencies,
            formData: props.formData
          })
        }
      },
      { deep: true }
    )

    return {
      isVisible,
      isDisabled,
      isRequired,
      showDependentFields,
      updateField
    }
  }
})
</script>

<style lang="scss" scoped>
.pro-form-dependency {
  .dependent-fields {
    .dependent-field {
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .no-dependency {
    text-align: center;
    padding: 20px;
    color: #999;
    border: 1px dashed #d9d9d9;
    border-radius: 4px;

    .no-dependency-text {
      font-size: 14px;
    }
  }
}
</style>
