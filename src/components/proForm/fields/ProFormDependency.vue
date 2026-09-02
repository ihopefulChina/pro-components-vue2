<template>
  <ProFormItem
    :name="name"
    :label="label"
    :span="span"
    :required="required"
    :rules="rules"
    :tooltip="tooltip"
  >
    <div class="pro-form-dependency">
      <!-- 依赖字段显示 -->
      <div v-if="showDependentFields" class="dependent-fields">
        <slot
          :form-data="formData"
          :dependencies="dependencies"
          :is-visible="isVisible"
          :is-disabled="isDisabled"
          :is-required="isRequired"
        >
          <!-- 默认显示依赖字段 -->
          <div v-for="field in dependentFields" :key="field.name" class="dependent-field">
            <component
              :is="field.component"
              v-bind="field.props"
              :value="formData[field.name]"
              @input="updateField(field.name, $event)"
            />
          </div>
        </slot>
      </div>

      <!-- 无依赖时的内容 -->
      <div v-else-if="showNoDependency" class="no-dependency">
        <slot name="no-dependency">
          <div class="no-dependency-text">
            {{ noDependencyText }}
          </div>
        </slot>
      </div>
    </div>
  </ProFormItem>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from "@vue/composition-api";
import ProFormItem from "../ProFormItem.vue";

interface DependencyRule {
  field: string;
  operator: "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "in" | "nin" | "contains" | "regex";
  value: any;
  logic?: "and" | "or";
}

interface DependentField {
  name: string;
  component: string;
  props: Record<string, any>;
  visible?: boolean;
  disabled?: boolean;
  required?: boolean;
}

export default defineComponent({
  name: "ProFormDependency",
  components: { ProFormItem },
  inheritAttrs: false,
  props: {
    // 表单项属性
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    span: {
      type: Number,
      default: 24,
    },
    required: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    // 提示信息
    tooltip: {
      type: String,
      default: "",
    },
    // 依赖配置
    dependencies: {
      type: Array as () => DependencyRule[],
      required: true,
    },
    dependentFields: {
      type: Array as () => DependentField[],
      default: () => [],
    },
    // 表单数据
    formData: {
      type: Object,
      required: true,
    },
    // 显示配置
    showNoDependency: {
      type: Boolean,
      default: false,
    },
    noDependencyText: {
      type: String,
      default: "请先满足依赖条件",
    },
    // 依赖逻辑
    logic: {
      type: String as () => "and" | "or",
      default: "and",
    },
  },
  emits: ["input", "dependency-change"],
  setup(props, { emit }) {
    // 检查依赖条件
    const checkDependencies = () => {
      const { dependencies, formData, logic } = props;

      if (!dependencies || dependencies.length === 0) {
        return true;
      }

      const results = dependencies.map(rule => {
        const fieldValue = formData[rule.field];
        const { operator, value } = rule;

        switch (operator) {
          case "eq":
            return fieldValue === value;
          case "ne":
            return fieldValue !== value;
          case "gt":
            return fieldValue > value;
          case "gte":
            return fieldValue >= value;
          case "lt":
            return fieldValue < value;
          case "lte":
            return fieldValue <= value;
          case "in":
            return Array.isArray(value) && value.includes(fieldValue);
          case "nin":
            return Array.isArray(value) && !value.includes(fieldValue);
          case "contains":
            return String(fieldValue).includes(String(value));
          case "regex": {
            try {
              return new RegExp(value).test(String(fieldValue));
            } catch {
              return false;
            }
          }
          default:
            return false;
        }
      });

      return logic === "or" ? results.some(result => result) : results.every(result => result);
    };

    // 更新字段值
    const updateField = (fieldName: string, value: any) => {
      const newFormData = { ...props.formData, [fieldName]: value };
      emit("input", newFormData);
    };

    const showDependentFields = computed(checkDependencies);
    const isVisible = computed(() => showDependentFields.value);
    const isDisabled = computed(() => !showDependentFields.value);
    const isRequired = computed(() => props.required && showDependentFields.value);

    // 仅在依赖结果变化时通知，不在 computed 中修改传入配置
    watch(
      showDependentFields,
      satisfied => {
        emit("dependency-change", {
          satisfied,
          dependencies: props.dependencies,
          formData: props.formData,
        });
      },
      { flush: "post" }
    );

    return {
      isVisible,
      isDisabled,
      isRequired,
      showDependentFields,
      updateField,
    };
  },
});
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
