<template>
  <div class="custom-tabs">
    <div class="tab-header">
      <div v-for="tab in tabs" :key="tab.value" class="tab-item" :class="{ active: activeTab === tab.value }" @click="handleTabClick(tab.value)">
        <slot name="label" :tab="tab">
          {{ tab.label }}
        </slot>
      </div>
    </div>

    <!-- Tab 内容区域 -->
    <div class="tab-content">
      <div v-for="tab in tabs" v-show="activeTab === tab.value" :key="tab.value" class="tab-pane">
        <slot :tab="tab" :value="tab.value" :index="tabs.indexOf(tab)"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "@vue/composition-api"

interface Tab {
  value: string | number
  label: string
  [key: string]: any
}

export default defineComponent({
  name: "CustomTabs",
  props: {
    /** 标签页数据 */
    tabs: {
      type: Array as () => Tab[],
      required: true,
      default: () => []
    },
    /** 当前激活的标签页值 */
    value: {
      type: [String, Number],
      default: undefined
    },
    /** 默认激活的标签页（当 value 为空时使用） */
    defaultActiveTab: {
      type: [String, Number],
      default: undefined
    }
  },
  emits: ["input", "change"],
  setup(props, { emit }) {
    /** 当前激活的标签页 */
    const activeTab = ref(props.value || props.defaultActiveTab || (props.tabs.length > 0 ? props.tabs[0].value : null))

    /** 监听 tabs 变化，自动切换到第一个 tab */
    watch(
      () => props.tabs,
      (newTabs: Tab[]) => {
        if (newTabs && newTabs.length > 0) {
          // 如果当前激活的 tab 不在新的 tabs 中，切换到第一个
          const isCurrentTabValid = newTabs.some((tab: Tab) => tab.value === activeTab.value)
          if (!isCurrentTabValid) {
            activeTab.value = newTabs[0].value
            emit("input", activeTab.value)
            emit("change", activeTab.value)
          }
        } else {
          activeTab.value = null
        }
      },
      { immediate: true, deep: true }
    )

    /** 监听外部 value 变化 */
    watch(
      () => props.value,
      newValue => {
        if (newValue !== undefined && newValue !== activeTab.value) {
          activeTab.value = newValue
        }
      }
    )

    /** 点击标签页 */
    const handleTabClick = (value: string | number) => {
      if (activeTab.value === value) return

      activeTab.value = value
      emit("input", value)
      emit("change", value)
    }

    return {
      activeTab,
      handleTabClick
    }
  }
})
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
