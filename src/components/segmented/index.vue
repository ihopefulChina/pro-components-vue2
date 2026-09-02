<template>
  <div class="segmented-wrapper">
    <!-- Segmented 头部 -->
    <div class="segmented-header">
      <div class="segmented-control" role="tablist" :aria-label="label || '分段选项'">
        <draggable
          v-model="internalItems"
          class="segmented-draggable"
          handle=".segmented-item"
          :disabled="disabled"
          @end="handleDragEnd"
        >
          <div
            v-for="(item, index) in internalItems"
            :key="item.id || index"
            class="segmented-item"
            :class="{ active: activeIndex === index, disabled: disabled }"
            role="tab"
            :aria-selected="activeIndex === index ? 'true' : 'false'"
            :aria-disabled="disabled ? 'true' : 'false'"
            :tabindex="activeIndex === index && !disabled ? 0 : -1"
            @click.stop="handleItemClick(index)"
            @keydown="handleItemKeydown($event, index)"
          >
            <slot name="label" :item="item" :index="index">
              {{ itemLabel ? itemLabel(item, index) : `${label} ${index + 1}` }}
            </slot>
            <button
              v-if="showDelete && !disabled && internalItems.length > minItems"
              type="button"
              class="delete-btn-mini"
              :aria-label="`删除第 ${index + 1} 项`"
              @click.stop="handleRemove(index)"
            >
              <i class="el-icon-circle-close" aria-hidden="true" />
            </button>
          </div>
        </draggable>
        <button
          v-if="showAdd && !disabled && (!maxItems || internalItems.length < maxItems)"
          type="button"
          class="segmented-item add-item"
          @click="handleAdd"
        >
          <i :class="addIcon" aria-hidden="true" />
          {{ addText }}
        </button>
      </div>
    </div>

    <!-- Segmented 内容 -->
    <div
      v-for="(item, index) in internalItems"
      v-show="activeIndex === index"
      :key="item.id || index"
      class="segmented-content"
      role="tabpanel"
      tabindex="0"
    >
      <!-- 删除按钮 -->
      <div v-if="showDelete && !disabled && internalItems.length > minItems" class="delete-btn">
        <el-button
          class="delete-btn-custom"
          type="danger"
          size="mini"
          icon="el-icon-delete"
          :aria-label="`删除第 ${index + 1} 项`"
          @click="handleRemove(index)"
        />
      </div>

      <!-- 内容插槽 -->
      <div class="segmented-content-body">
        <slot :item="item" :index="index" />
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="internalItems.length === 0" class="segmented-empty">
      <slot name="empty">
        <div class="empty-text">暂无{{ label || "数据" }}</div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, PropType, watch } from "@vue/composition-api";
import draggable from "vuedraggable";
import { useState } from "@/hooks/useState";

interface IItem {
  id?: string;
  [key: string]: any;
}

export default defineComponent({
  name: "Segmented",
  components: { draggable },
  props: {
    /** 数据列表 */
    value: {
      type: Array as PropType<IItem[]>,
      default: () => [],
    },
    /** 标签名称 */
    label: {
      type: String,
      default: "",
    },
    /** 自定义标签函数 */
    itemLabel: {
      type: Function,
      default: undefined,
    },
    /** 是否禁用 */
    disabled: {
      type: Boolean,
      default: false,
    },
    /** 最小项数 */
    minItems: {
      type: Number,
      default: 0,
    },
    /** 最大项数 */
    maxItems: {
      type: Number,
      default: undefined,
    },
    /** 是否显示添加按钮 */
    showAdd: {
      type: Boolean,
      default: true,
    },
    /** 添加按钮文本 */
    addText: {
      type: String,
      default: "添加",
    },
    /** 添加按钮图标 */
    addIcon: {
      type: String,
      default: "el-icon-plus",
    },
    /** 是否显示删除按钮 */
    showDelete: {
      type: Boolean,
      default: true,
    },
    /** 默认激活索引 */
    defaultActiveIndex: {
      type: Number,
      default: 0,
    },
  },
  emits: ["input", "change", "add", "remove", "move"],
  setup(props, { emit }) {
    /** 内部数据 */
    const internalItems = computed({
      get: () => props.value || [],
      set: val => {
        emit("input", val);
        emit("change", val);
      },
    });

    /** 当前激活索引 */
    const initialActiveIndex =
      props.value.length > 0
        ? Math.min(Math.max(props.defaultActiveIndex, 0), props.value.length - 1)
        : 0;
    const [activeIndex, setActiveIndex] = useState<number | undefined>(initialActiveIndex);

    /** 监听列表变化，调整激活索引 */
    watch(
      () => internalItems.value.length,
      newLength => {
        // 如果当前激活索引超出范围，调整到最后一个
        if (activeIndex.value !== undefined && activeIndex.value >= newLength && newLength > 0) {
          setActiveIndex(newLength - 1);
        }

        // 如果列表为空，重置为 0
        if (newLength === 0) {
          setActiveIndex(0);
        }
      }
    );

    /** 点击项 */
    const handleItemClick = (index: number) => {
      if (props.disabled) return;
      setActiveIndex(index);
    };

    const handleItemKeydown = (event: KeyboardEvent, index: number) => {
      if (props.disabled || internalItems.value.length === 0) return;

      let nextIndex = index;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = (index + 1) % internalItems.value.length;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = (index - 1 + internalItems.value.length) % internalItems.value.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = internalItems.value.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      setActiveIndex(nextIndex);
      const tabs = (
        event.currentTarget as HTMLElement
      ).parentElement?.querySelectorAll<HTMLElement>("[role='tab']");
      tabs?.[nextIndex]?.focus();
    };

    /** 添加项 */
    const handleAdd = () => {
      emit("add");
      // 添加后自动切换到最后一项
      nextTick(() => {
        setActiveIndex(internalItems.value.length - 1);
      });
    };

    /** 删除项 */
    const handleRemove = (index: number) => {
      if (activeIndex.value !== undefined && index < activeIndex.value) {
        setActiveIndex(activeIndex.value - 1);
      }
      emit("remove", index);
    };

    /** 拖拽结束 */
    const handleDragEnd = (event: any) => {
      if (activeIndex.value === undefined) return;
      const { oldIndex, newIndex } = event;
      if (oldIndex === undefined || newIndex === undefined) return;
      emit("move", oldIndex, newIndex);
      // 如果拖拽的是当前激活项，更新激活索引
      if (activeIndex.value === oldIndex) {
        setActiveIndex(newIndex);
      } else if (activeIndex.value > oldIndex && activeIndex.value <= newIndex) {
        setActiveIndex(activeIndex.value - 1);
      } else if (activeIndex.value < oldIndex && activeIndex.value >= newIndex) {
        setActiveIndex(activeIndex.value + 1);
      }
    };

    return {
      internalItems,
      activeIndex,
      handleItemClick,
      handleItemKeydown,
      handleAdd,
      handleRemove,
      handleDragEnd,
    };
  },
});
</script>

<style lang="scss" scoped>
.segmented-wrapper {
  width: 100%;
}

.segmented-header {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.segmented-control {
  display: inline-flex;
  background-color: #f5f7fa;
  padding: 4px;
  border-radius: 8px;
  gap: 4px;
  flex-wrap: wrap;
}

.segmented-draggable {
  display: inline-flex;
  gap: 4px;
  flex-wrap: wrap;
}

.segmented-item {
  position: relative;
  padding: 4px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  border-radius: 6px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  white-space: nowrap;
  font-weight: 500;
  min-width: 80px;
  height: 36px;
  line-height: 28px;
  text-align: center;
  border: 0;
  font-family: inherit;

  &:hover:not(.disabled) {
    color: #409eff;
    background-color: rgba(64, 158, 255, 0.1);
  }

  &.active {
    color: #409eff;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    // font-weight: 600;
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:focus-visible {
    outline: 2px solid #409eff;
    outline-offset: 1px;
  }
}

.add-item {
  color: #409eff;
  cursor: pointer;

  &:hover {
    background-color: #ecf5ff;
  }

  i {
    margin-right: 4px;
  }
}

.segmented-content {
  position: relative;
  animation: fadeIn 0.25s ease-out;
  padding: 24px;
  background-color: #fafafa;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
  // min-height: 200px;
  display: flex;
  flex-direction: column;
}

.delete-btn {
  position: absolute;
  right: 0;
  top: -5px;
  text-align: right;
  margin-bottom: 16px;
}

.segmented-content-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px; // 表单项之间的间距
}

.segmented-empty {
  text-align: center;
  padding: 20px;
  color: #999;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;

  .empty-text {
    font-size: 14px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.delete-btn-custom {
  border-radius: 0 8px 0 0;
}
.delete-btn-mini {
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  border: 0;
  background: transparent;
  color: inherit;
  padding: 2px;
}
</style>
