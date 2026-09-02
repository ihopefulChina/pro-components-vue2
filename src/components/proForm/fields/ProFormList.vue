<template>
  <ProFormItem
    :name="name"
    :label="label"
    :span="span"
    :required="required"
    :rules="rules"
    :tooltip="tooltip"
  >
    <Segmented
      v-model="listValue"
      :label="label"
      :item-label="segmentedItemLabel"
      :disabled="disabled"
      :min-items="minItems"
      :max-items="maxItems"
      :show-add="!readonly"
      :add-text="addButtonText"
      :add-icon="addButtonIcon"
      :show-delete="showRemove && !readonly"
      @add="addItem"
      @remove="removeItem"
      @move="handleMove"
    >
      <template #label="{ item, index }">
        <slot name="label" :item="item" :index="index">
          {{ segmentedItemLabel ? segmentedItemLabel(item, index) : `${label} ${index + 1}` }}
        </slot>
      </template>

      <template #default="{ item, index }">
        <slot
          :item="item"
          :index="index"
          :disabled="disabled"
          :readonly="readonly"
          :add="addItem"
          :remove="removeItem"
        >
          <!-- 默认内容 -->
          <div class="list-item-default">
            <span class="list-item-index">{{ index + 1 }}.</span>
            <span class="list-item-text">{{ item.text || `项目 ${index + 1}` }}</span>
          </div>
        </slot>
      </template>

      <template #empty>
        <slot name="empty" />
      </template>
    </Segmented>
  </ProFormItem>
</template>

<script lang="ts">
import Segmented from "@/components/segmented/index.vue";
import { guid } from "@/utils/guid";
import { computed, defineComponent, PropType } from "@vue/composition-api";
import { useValidateForm } from "../hooks/useValidateForm";
import ProFormItem from "../ProFormItem.vue";

interface ListItem {
  id?: string;
  [key: string]: unknown;
}

export default defineComponent({
  name: "ProFormList",
  components: { Segmented, ProFormItem },
  model: { prop: "value", event: "input" },
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
    // 列表属性
    value: {
      type: Array as PropType<ListItem[]>,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    // 配置选项
    minItems: {
      type: Number,
      default: 0,
    },
    maxItems: {
      type: Number,
      default: undefined,
    },
    // 按钮配置
    addButtonText: {
      type: String,
      default: "添加项目",
    },
    addButtonIcon: {
      type: String,
      default: "el-icon-plus",
    },
    // 操作按钮显示
    showRemove: {
      type: Boolean,
      default: true,
    },
    // 默认项模板
    defaultItem: {
      type: Function as PropType<() => ListItem>,
      default: () => ({}),
    },
    // Segmented 模式下的项标签函数
    segmentedItemLabel: {
      type: Function as PropType<(item: ListItem, index: number) => string>,
      default: undefined,
    },
  },
  emits: ["input", "add", "remove", "move"],
  setup(props, { emit }) {
    /** 验证表单项 */
    const { validateField } = useValidateForm(props.name);

    const listValue = computed({
      get: () => {
        const value = props.value ?? [];
        if (Array.isArray(value)) {
          return value;
        }
        return [];
      },
      set: val => {
        validateField();
        emit("input", val);
      },
    });

    // 添加项目
    const addItem = () => {
      if (props.maxItems && listValue.value.length >= props.maxItems) {
        return;
      }

      const newItem = { ...props.defaultItem(), id: guid() };

      const newList = [...listValue.value, newItem];
      listValue.value = newList;
      emit("add", newItem, newList.length - 1);
    };

    // 删除项目
    const removeItem = (index: number) => {
      if (props.minItems && listValue.value.length <= props.minItems) {
        return;
      }

      const removedItem = listValue.value[index];
      const newList = listValue.value.filter((_, i) => i !== index);
      listValue.value = newList;
      emit("remove", removedItem, index);
    };

    // 移动项目（不需要手动重排，vuedraggable 的 v-model 已经处理了）
    const handleMove = (oldIndex: number, newIndex: number) => {
      // 只触发事件通知，不重新赋值（否则会导致二次重排）
      const item = listValue.value[newIndex];
      emit("move", item, oldIndex, newIndex);
    };

    /**
     * 清空所有项目
     */
    const clearItems = () => {
      listValue.value = [];
    };

    /**
     * 重置组件状态
     */
    const reset = () => {
      clearItems();
    };

    return {
      listValue,
      addItem,
      removeItem,
      handleMove,
      clearItems,
      reset,
    };
  },
});
</script>

<style lang="scss" scoped>
// 确保在 Segmented 模式下表单项有正确的间距
::v-deep .el-form-item {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.list-item-default {
  display: flex;
  align-items: center;
  gap: 8px;

  .list-item-index {
    color: #666;
    font-weight: 500;
    min-width: 20px;
  }

  .list-item-text {
    flex: 1;
    word-break: break-all;
  }
}
</style>
