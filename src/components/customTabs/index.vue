<template>
  <div class="custom-tabs">
    <div class="tab-header" role="tablist" :aria-label="ariaLabel">
      <button
        v-for="(tab, index) in tabs"
        :id="getTabId(index)"
        :key="tab.value"
        type="button"
        class="tab-item"
        :class="{ active: activeTab === tab.value }"
        role="tab"
        :aria-selected="activeTab === tab.value ? 'true' : 'false'"
        :aria-controls="getPanelId(index)"
        :tabindex="activeTab === tab.value ? 0 : -1"
        @click="handleTabClick(tab.value)"
        @keydown="handleTabKeydown($event, index)"
      >
        <slot name="label" :tab="tab">
          {{ tab.label }}
        </slot>
      </button>
    </div>

    <!-- Tab 内容区域 -->
    <div class="tab-content">
      <div
        v-for="(tab, index) in tabs"
        v-show="activeTab === tab.value"
        :id="getPanelId(index)"
        :key="tab.value"
        class="tab-pane"
        role="tabpanel"
        :aria-labelledby="getTabId(index)"
        tabindex="0"
      >
        <slot :tab="tab" :value="tab.value" :index="tabs.indexOf(tab)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "@vue/composition-api";
import { guid } from "@/utils/guid";

interface Tab {
  value: string | number;
  label: string;
  [key: string]: any;
}

export default defineComponent({
  name: "CustomTabs",
  props: {
    /** 标签页数据 */
    tabs: {
      type: Array as () => Tab[],
      required: true,
      default: () => [],
    },
    /** 当前激活的标签页值 */
    value: {
      type: [String, Number],
      default: undefined,
    },
    /** 默认激活的标签页（当 value 为空时使用） */
    defaultActiveTab: {
      type: [String, Number],
      default: undefined,
    },
    /** 标签组的无障碍名称 */
    ariaLabel: {
      type: String,
      default: "标签页",
    },
  },
  emits: ["input", "change"],
  setup(props, { emit }) {
    /** 当前激活的标签页 */
    const activeTab = ref<string | number | null>(
      props.value ?? props.defaultActiveTab ?? (props.tabs.length > 0 ? props.tabs[0].value : null)
    );
    const componentId = guid(true);
    const getTabId = (index: number) => `custom-tabs-${componentId}-tab-${index}`;
    const getPanelId = (index: number) => `custom-tabs-${componentId}-panel-${index}`;

    /** 监听 tabs 变化，自动切换到第一个 tab */
    watch(
      () => props.tabs,
      (newTabs: Tab[]) => {
        if (newTabs && newTabs.length > 0) {
          // 如果当前激活的 tab 不在新的 tabs 中，切换到第一个
          const isCurrentTabValid = newTabs.some((tab: Tab) => tab.value === activeTab.value);
          if (!isCurrentTabValid) {
            activeTab.value = newTabs[0].value;
            emit("input", activeTab.value);
            emit("change", activeTab.value);
          }
        } else {
          activeTab.value = null;
        }
      },
      { immediate: true, deep: true }
    );

    /** 监听外部 value 变化 */
    watch(
      () => props.value,
      newValue => {
        if (newValue !== undefined && newValue !== activeTab.value) {
          activeTab.value = newValue;
        }
      }
    );

    /** 点击标签页 */
    const handleTabClick = (value: string | number) => {
      if (activeTab.value === value) return;

      activeTab.value = value;
      emit("input", value);
      emit("change", value);
    };

    const handleTabKeydown = (event: KeyboardEvent, index: number) => {
      if (props.tabs.length === 0) return;

      let nextIndex = index;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = (index + 1) % props.tabs.length;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = (index - 1 + props.tabs.length) % props.tabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = props.tabs.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      handleTabClick(props.tabs[nextIndex].value);
      document.getElementById(getTabId(nextIndex))?.focus();
    };

    return {
      activeTab,
      handleTabClick,
      handleTabKeydown,
      getTabId,
      getPanelId,
    };
  },
});
</script>

<style lang="scss" scoped>
.custom-tabs {
  margin-top: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.tab-header {
  display: flex;
  background-color: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;
}

.tab-item {
  border: 0;
  background: transparent;
  font-family: inherit;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  border-right: 1px solid #dcdfe6;
  transition: all 0.3s;
  user-select: none;

  // &:last-child {
  //   border-right: none;
  // }

  &:hover {
    color: #409eff;
    background-color: #ecf5ff;
  }

  &:focus-visible {
    outline: 2px solid #409eff;
    outline-offset: -2px;
  }

  &.active {
    color: #409eff;
    background-color: #fff;
    font-weight: 600;
    border-bottom: 2px solid #409eff;
  }
}

.tab-content {
  background-color: #fff;
  padding: 20px;
}

.tab-pane {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
