<template>
  <ProFormItem :name="name" :label="label" :required="required" :rules="rules" :tooltip="tooltip">
    <div class="pro-form-dynamic-tags">
      <div class="dynamic-tags-container">
        <!-- 已添加的标签 -->
        <div class="tags-list">
          <el-tag
            v-for="(tag, index) in listValue"
            :key="tag.id"
            :closable="!readonly && !disabled"
            :size="size"
            class="dynamic-tag"
            effect="dark"
            hit
            @close="removeTag(index)"
          >
            {{ tag.value }}
          </el-tag>
        </div>

        <!-- 添加按钮 -->
        <div v-if="!readonly && !disabled && !showInput" class="add-button-container">
          <el-button size="mini" :disabled="isMaxItems" class="add-button" @click="showInputField">
            <i class="el-icon-plus" />
            {{ addButtonText }}
          </el-button>
        </div>

        <!-- 输入框 -->
        <div v-if="!readonly && !disabled && showInput" class="input-container">
          <el-input-number
            v-if="inputProps.type === 'number'"
            ref="inputRef"
            v-model="inputValue"
            v-bind="inputProps"
            :controls="false"
            class="tag-input"
            @keyup.enter.native="addTag"
            @keyup.delete.native="handleDelete"
            @blur="addTag"
          />
          <el-input
            v-else
            ref="inputRef"
            v-model="inputValue"
            v-bind="inputProps"
            class="tag-input"
            @keyup.enter.native="addTag"
            @keyup.delete.native="handleDelete"
            @blur="addTag"
          />
        </div>

        <!-- 只读模式显示 -->
        <div v-if="readonly || disabled" class="readonly-display">
          <span v-if="listValue.length === 0" class="empty-text">{{ emptyText }}</span>
        </div>
      </div>
    </div>
  </ProFormItem>
</template>

<script lang="ts">
import { useState } from "@/hooks/useState";
import { guid } from "@/utils/guid";
import { computed, defineComponent, nextTick, PropType, ref, watch } from "@vue/composition-api";
import { useValidateForm } from "../hooks/useValidateForm";
import ProFormItem from "../ProFormItem.vue";

/**
 * 输入框属性接口
 */
interface InputProps {
  placeholder?: string;
  maxlength?: number;
  min?: number;
  max?: number;
  type?: string;
  size?: string;
  precision?: number;
}

/**
 * 动态标签组件 Props
 */
interface Props {
  /** 字段名称 */
  name: string;
  /** 标签文本 */
  label: string;
  /** 是否必填 */
  required: boolean;
  /** 是否只读 */
  readonly: boolean;
  /** 是否禁用 */
  disabled: boolean;
  /** 组件尺寸 */
  size: string;
  /** 添加按钮文本 */
  addButtonText: string;
  /** 空值显示文本 */
  emptyText: string;
  /** 帮助文本 */
  tooltip: string;
  /** 最小标签数量 */
  minItems: number;
  /** 最大标签数量 */
  maxItems: number;
  /** 验证规则 */
  rules: any[];
  /** 初始值 */
  value: string[];
  /** 输入框属性 */
  inputProps: InputProps;
}

interface TagItem {
  id: string;
  value: string;
}

export default defineComponent({
  name: "ProFormDynamicTags",
  components: { ProFormItem },
  model: { prop: "value", event: "input" },
  props: {
    /** 字段名称 */
    name: { type: String, required: true },
    /** 标签文本 */
    label: { type: String, required: true },
    /** 是否必填 */
    required: { type: Boolean, default: false },
    /** 是否只读 */
    readonly: { type: Boolean, default: false },
    /** 是否禁用 */
    disabled: { type: Boolean, default: false },
    /** 组件尺寸 */
    size: { type: String, default: "medium" },
    /** 添加按钮文本 */
    addButtonText: { type: String, default: "添加" },
    /** 空值显示文本 */
    emptyText: { type: String, default: "暂无数据" },
    /** 帮助文本 */
    tooltip: { type: String, default: "" },
    /** 最小标签数量 */
    minItems: { type: Number, default: 0 },
    /** 最大标签数量 */
    maxItems: { type: Number, default: 10 },
    /** 验证规则 */
    rules: { type: Array, default: () => [] },
    /** 初始值 */
    value: { type: Array as PropType<string[]>, default: () => [] },
    /** 输入框属性 */
    inputProps: {
      type: Object,
      default: () => ({
        placeholder: "请输入内容",
        maxlength: 20,
        type: "text",
        size: "medium",
        precision: 0,
      }),
    },
  },
  emits: ["input"],
  setup(props: Props, { emit }) {
    /** 验证表单项 */
    const { validateField } = useValidateForm(props.name);

    const createTagItems = (values: string[]): TagItem[] =>
      values.map(value => ({ id: guid(), value }));
    const tagItems = ref<TagItem[]>(createTagItems(props.value ?? []));

    watch(
      () => props.value,
      newValue => {
        const nextValues = newValue ?? [];
        const currentValues = tagItems.value.map(item => item.value);
        const isSame =
          nextValues.length === currentValues.length &&
          nextValues.every((value, index) => value === currentValues[index]);

        if (!isSame) {
          tagItems.value = createTagItems(nextValues);
        }
      },
      { deep: true }
    );

    const listValue = computed<TagItem[]>({
      get: () => tagItems.value,
      set: val => {
        tagItems.value = val;
        validateField();
        emit(
          "input",
          val.map(item => item.value)
        );
      },
    });

    const inputRef = ref<{ focus: () => void } | null>(null);
    /** 输入框值 */
    const inputValue = ref<string | number | undefined>(undefined);
    /** 是否显示输入框 */
    const [showInput, setShowInput] = useState(false);

    /** 是否达到最大数量 */
    const isMaxItems = computed(
      () => props.maxItems > 0 && listValue.value.length >= props.maxItems
    );

    /**
     * 获取标签类型
     * @param index - 标签索引
     * @returns 标签类型
     */
    const getTagType = (index: number): string => {
      const types = ["", "success", "info", "warning", "danger"];
      return types[index % types.length];
    };

    /**
     * 显示输入框
     */
    const showInputField = async () => {
      setShowInput(true);
      await nextTick();
      inputRef.value?.focus();
    };

    /** 隐藏输入框 */
    const hideInputField = () => {
      setShowInput(false);
      inputValue.value = undefined;
    };

    /** 设置标签列表 */
    const setListValue = (list: { id: string; value: string }[]) => {
      listValue.value = list;
    };

    /**
     * 添加标签
     */
    const addTag = async () => {
      const value = inputValue.value?.toString().trim();

      if (!value || isMaxItems.value) {
        hideInputField();
        return;
      }

      setListValue([...listValue.value, { id: guid(), value }]);

      hideInputField();
    };

    /**
     * 删除标签
     * @param index - 标签索引
     */
    const removeTag = (index: number) => {
      if (listValue.value.length <= props.minItems) return;

      const newList = listValue.value.filter((_, itemIndex) => itemIndex !== index);

      setListValue(newList);
    };

    /**
     * 处理删除键
     */
    const handleDelete = () => {
      if (inputValue.value === "" && listValue.value.length > 0) {
        removeTag(listValue.value.length - 1);
      }
    };

    /**
     * 清空所有标签
     */
    const clearTags = () => {
      inputValue.value = undefined;
      setShowInput(false);
      setListValue([]);
    };

    /**
     * 重置组件状态
     */
    const reset = () => {
      clearTags();
    };

    return {
      inputRef,
      inputValue,
      listValue,
      showInput,
      isMaxItems,
      getTagType,
      showInputField,
      hideInputField,
      addTag,
      removeTag,
      handleDelete,
      clearTags,
      reset,
    };
  },
});
</script>

<style lang="scss" scoped>
.pro-form-dynamic-tags {
  .dynamic-tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    min-height: 40px;

    .tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;

      .dynamic-tag {
        margin: 0;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: none;
      }
    }

    .add-button-container {
      .add-button {
        border-style: dashed;
        color: #409eff;
        background-color: transparent;
        transition: none;

        &:hover {
          border-color: #409eff;
          color: #409eff;
        }

        &:disabled {
          color: #c0c4cc;
          border-color: #e4e7ed;
          cursor: not-allowed;
        }
      }
    }

    .input-container {
      flex: 1;
      min-width: 120px;
      max-width: 200px;

      .tag-input {
        border: none;
        box-shadow: none;
        padding: 0;

        &:focus {
          border: none;
          box-shadow: none;
        }
      }
    }

    .readonly-display {
      .empty-text {
        color: #c0c4cc;
        font-size: 14px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .pro-form-dynamic-tags {
    .dynamic-tags-container {
      .tags-list {
        .dynamic-tag {
          max-width: 150px;
        }
      }
    }
  }
}
</style>
