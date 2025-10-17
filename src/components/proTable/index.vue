<template>
  <div>
    <!-- 搜索表单 + 工具栏 -->
    <div style="margin-bottom: 15px;">
      <SearchForm v-model="queryForm" :fields="searchFields" :rules="searchRules" :loading="loading" @search="handleSearch" @reset="handleReset">
        <template #extra-buttons>
          <slot name="extra-search-buttons"></slot>
          <!-- 工具栏按钮 -->
          <slot name="toolBar" :selectedRowKeys="selectedRowKeys" :selectedRows="selectedRows" />
        </template>
      </SearchForm>
    </div>

    <!-- 表格警告信息 -->
    <div v-if="selectedRowKeys.length > 0" style="margin-bottom: 15px;">
      <slot name="tableAlert" :selectedRowKeys="selectedRowKeys" :selectedRows="selectedRows" />
    </div>
    <el-table
      ref="multipleTable"
      :data="data"
      v-loading="loading"
      class="table"
      style="width: 100%"
      :row-key="rowKey"
      @selection-change="handleSelectionChange"
    >
      <!-- 选择列 -->
      <el-table-column v-if="rowSelection" type="selection" width="55" />

      <el-table-column v-for="col in tableColumns" :key="col.prop" v-bind="col">
        <!-- 自定义插槽 -->
        <template v-if="col.slotName" v-slot="scope">
          <slot :name="col.slotName" v-bind="scope"></slot>
        </template>
        <!-- 操作列 -->
        <template v-else-if="col.type === 'actions'" v-slot="scope">
          <div class="action-buttons">
            <el-button
              v-for="(button, index) in col.buttons || []"
              :key="index"
              :type="button.type || 'primary'"
              :size="button.size || 'mini'"
              :icon="button.icon"
              :disabled="typeof button.disabled === 'function' ? button.disabled(scope.row) : button.disabled"
              v-show="typeof button.show === 'function' ? button.show(scope.row) : button.show !== false"
              @click="button.onClick(scope.row)"
            >
              {{ button.text }}
            </el-button>
          </div>
        </template>
        <!-- 渲染render -->
        <template v-else-if="col.render" v-slot="scope">
          <el-link
            v-if="col.valueType === 'link' && col.render"
            :underline="false"
            :href="col.render(getNestedValue(scope.row, col.prop), scope.row)"
            target="_blank"
          >
            {{ col.render(getNestedValue(scope.row, col.prop), scope.row) }}
          </el-link>
          <span v-else-if="col.render">{{ col.render(getNestedValue(scope.row, col.prop), scope.row) }}</span>
        </template>
        <!-- 图片显示 -->
        <template v-else-if="col.valueType === 'image'" v-slot="scope">
          <div v-if="getNestedValue(scope.row, col.prop)" class="image-container">
            <!-- 单个图片 -->
            <el-image
              v-if="!Array.isArray(getNestedValue(scope.row, col.prop))"
              :src="getNestedValue(scope.row, col.prop)"
              :style="col.imageStyle || 'width: 60px; height: auto;'"
              :preview-src-list="[getNestedValue(scope.row, col.prop)]"
              fit="cover"
              :lazy="col.lazy !== false"
            />
            <!-- 图片列表 -->
            <div v-else class="image-list">
              <el-image
                v-for="(img, index) in getNestedValue(scope.row, col.prop).slice(0, col.maxImages || 3)"
                :key="index"
                :src="img"
                :style="col.imageStyle || 'width: 40px; height: auto; margin-right: 4px;'"
                :preview-src-list="getNestedValue(scope.row, col.prop)"
                fit="cover"
                :lazy="col.lazy !== false"
              />
              <span v-if="getNestedValue(scope.row, col.prop).length > (col.maxImages || 3)" class="more-images">
                +{{ getNestedValue(scope.row, col.prop).length - (col.maxImages || 3) }}
              </span>
            </div>
          </div>
          <span v-else>-</span>
        </template>
        <!-- valueEnum 显示 -->
        <template v-else-if="col.valueEnum" v-slot="scope">
          <el-tag
            v-if="!!getValueEnumStatus(getNestedValue(scope.row, col.prop), col.valueEnum)"
            :type="getValueEnumStatus(getNestedValue(scope.row, col.prop), col.valueEnum)"
            size="small"
          >
            {{ getValueEnumLabel(getNestedValue(scope.row, col.prop), col.valueEnum) || "-" }}
          </el-tag>
          <span v-else>{{ getValueEnumLabel(getNestedValue(scope.row, col.prop), col.valueEnum) || "-" }}</span>
        </template>
        <!-- 默认显示 -->
        <template v-else v-slot="scope">
          <span
            v-if="col.ellipsis"
            :title="getNestedValue(scope.row, col.prop)"
            :style="{
              display: '-webkit-box',
              '-webkit-line-clamp': col.ellipsis === true ? 1 : col.ellipsis,
              '-webkit-box-orient': 'vertical',
              overflow: 'hidden'
            }"
          >
            {{ getNestedValue(scope.row, col.prop) || "-" }}
          </span>
          <span v-else>{{ getNestedValue(scope.row, col.prop) || "-" }}</span>
        </template>
      </el-table-column>

      <!-- 空状态插槽 -->
      <template #empty>
        <slot name="empty">
          <el-empty description="暂无数据" />
        </slot>
      </template>
    </el-table>

    <div style="margin-top: 20px; text-align: right;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="[10, 30, 60, 100, 180, 360]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, watch, nextTick } from "@vue/composition-api"
import { ICommonTableColumn, DataSourceConfig } from "./type"
import { SearchField, FormRules } from "@/components/searchForm/types"
import SearchForm from "@/components/searchForm/index.vue"

interface Pagination {
  currentPage: number
  pageSize: number
  total: number
}

export default defineComponent({
  name: "ProTableNew",
  components: { SearchForm },
  expose: ["clearSelection"],
  props: {
    /** 列配置 */
    columns: {
      type: Array as PropType<ICommonTableColumn[]>,
      required: true
    },
    /** 请求函数 */
    request: {
      type: Function as PropType<(params: any, sort: any, filter: any) => Promise<{ data: any[]; success: boolean; total: number }>>,
      required: false
    },
    /** 数据源配置（参考 Antd ProTable） */
    dataSource: {
      type: Object as PropType<DataSourceConfig>,
      default: () => ({})
    },
    /** 行键 */
    rowKey: {
      type: String,
      default: "id"
    },
    /** 滚动配置 */
    scroll: {
      type: Object,
      default: () => ({})
    },
    /** 行选择配置 */
    rowSelection: {
      type: Object,
      default: null
    }
  },
  setup(props, { refs, root }) {
    const loading = ref(false)
    const data = ref<any[]>([])
    const pagination = ref<Pagination>({
      currentPage: 1,
      pageSize: 10,
      total: 0
    })
    const queryForm = ref({})

    // 行选择状态
    const selectedRowKeys = ref<any[]>([])
    const selectedRows = ref<any[]>([])

    // 过滤表格列（隐藏搜索列）
    const tableColumns = computed(() => {
      return props.columns.filter(col => !col.hideInTable)
    })

    // 从 columns 中提取搜索表单配置
    const searchFields = computed(() => {
      const fields = props.columns
        .filter(col => !col.hideInSearch)
        .map(col => {
          const field: SearchField = {
            prop: col.prop,
            label: col.searchLabel || col.label,
            type: col.valueType || "input",
            placeholder: col.searchPlaceholder || col.fieldProps?.placeholder || `请输入${col.searchLabel || col.label}`,
            width: col.searchWidth ? `${col.searchWidth}px` : undefined,
            ...col.searchProps
          }

          // 处理 fieldProps 中的特殊属性转换
          if (col.fieldProps) {
            if (col.fieldProps.maxLength) {
              field.maxlength = col.fieldProps.maxLength
            }
            if (col.fieldProps.placeholder && !field.placeholder) {
              field.placeholder = col.fieldProps.placeholder
            }
            if (col.fieldProps.clearable !== undefined) {
              field.clearable = col.fieldProps.clearable
            }
            if (col.fieldProps.width && !field.width) {
              field.width = col.fieldProps.width
            }
            // 合并其他 fieldProps 属性
            Object.keys(col.fieldProps).forEach(key => {
              if (!field.hasOwnProperty(key) && key !== "maxLength" && key !== "placeholder" && key !== "clearable" && key !== "width") {
                ;(field as any)[key] = col.fieldProps![key]
              }
            })
          }

          // 处理选择器选项
          if (col.valueType === "select" && col.valueEnum) {
            if (Array.isArray(col.valueEnum)) {
              field.options = col.valueEnum
            } else {
              field.options = Object.entries(col.valueEnum).map(([key, value]) => {
                // 支持两种格式：
                // 1. { 500: "活动榜单" } - value 是字符串
                // 2. { 500: { label: "活动榜单", value: 500 } } - value 是对象
                if (typeof value === "string") {
                  return { label: value, value: key }
                } else {
                  return { label: value.label, value: value.value || key, status: value.status }
                }
              })
            }
          }

          return field
        })

      return fields
    })

    // 从 columns 中提取搜索表单验证规则
    const searchRules = computed(() => {
      const rules: FormRules = {}
      props.columns.forEach(col => {
        if (col.searchRules && col.searchRules.length > 0) {
          rules[col.prop] = col.searchRules
        }
      })
      return rules
    })

    // 执行请求
    const fetchData = async () => {
      try {
        loading.value = true

        // 优先使用 dataSource 配置
        if (props.dataSource?.dataSource) {
          // 使用静态数据源
          data.value = props.dataSource.dataSource
          pagination.value.total = props.dataSource.dataSource.length
          return
        }

        if (props.dataSource?.request) {
          // 使用 dataSource 的请求函数
          const params = {
            ...queryForm.value,
            currentPage: pagination.value.currentPage,
            pageSize: pagination.value.pageSize,
            ...props.dataSource.params
          }

          const result = await props.dataSource.request(params)
          data.value = props.dataSource.dataTransform ? props.dataSource.dataTransform(result.data) : result.data || []
          pagination.value.total = result.total || 0

          // 调用成功回调
          if (props.dataSource.onRequestSuccess) {
            props.dataSource.onRequestSuccess(data.value, pagination.value.total)
          }
        } else if (props.request) {
          // 使用原有的 request 函数
          const result = await props.request({ ...queryForm.value, currentPage: pagination.value.currentPage, pageSize: pagination.value.pageSize }, {}, {})
          data.value = result.data || []
          pagination.value.total = result.total || 0
        } else {
          // 没有配置数据源
          data.value = []
          pagination.value.total = 0
        }
      } catch (error) {
        console.error("请求失败:", error)
        data.value = []
        pagination.value.total = 0

        // 调用错误回调
        if (props.dataSource?.onRequestError) {
          props.dataSource.onRequestError(error)
        }
      } finally {
        loading.value = false
      }
    }

    // 分页大小改变
    const handleSizeChange = (size: number) => {
      pagination.value.pageSize = size
      pagination.value.currentPage = 1
      fetchData()
    }

    // 分页当前页改变
    const handleCurrentChange = (page: number) => {
      pagination.value.currentPage = page
      fetchData()
    }

    // 搜索处理
    const handleSearch = async (searchData: any) => {
      queryForm.value = { ...searchData }
      pagination.value.currentPage = 1
      await fetchData()
    }

    // 重置处理
    const handleReset = () => {
      queryForm.value = {}
      pagination.value.currentPage = 1
      fetchData()
    }

    // 刷新
    const handleRefresh = () => {
      fetchData()
    }

    // 行选择变化
    const handleSelectionChange = (selection: any[]) => {
      selectedRows.value = selection
      selectedRowKeys.value = selection.map(row => row[props.rowKey])

      // 触发外部选择变化事件
      if (props.rowSelection?.onChange) {
        props.rowSelection.onChange(selectedRowKeys.value, selectedRows.value)
      }
    }

    // 获取 valueEnum 的标签
    const getValueEnumLabel = (value: any, valueEnum: any) => {
      if (Array.isArray(valueEnum)) {
        const option = valueEnum.find(item => item.value === value)
        return option ? option.label : value
      } else if (typeof valueEnum === "object" && valueEnum !== null) {
        const option = valueEnum[value]
        if (option) {
          // 支持两种格式：
          // 1. { 500: "活动榜单" } - 直接返回字符串
          // 2. { 500: { label: "活动榜单", value: 500 } } - 返回 label
          return typeof option === "string" ? option : option.label
        }
        return value
      }
      return value
    }
    // 获取 valueEnum 的状态
    const getValueEnumStatus = (value: any, valueEnum: any) => {
      if (typeof valueEnum === "object" && valueEnum !== null) {
        const option = valueEnum[value]

        return option?.status
      }
    }

    // 安全获取嵌套属性值
    const getNestedValue = (obj: any, path: string) => {
      if (!obj || !path) return undefined

      return path.split(".").reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : undefined
      }, obj)
    }

    // 清除选择
    const clearSelection = () => {
      selectedRowKeys.value = []
      selectedRows.value = []

      // 使用 nextTick 确保 DOM 更新后再访问表格引用
      nextTick(() => {
        const table = (refs.multipleTable || root.$refs.multipleTable) as any
        if (table && table.clearSelection) {
          table.clearSelection()
        }
      })
    }

    // 监听 queryForm 变化
    watch(
      queryForm,
      () => {
        fetchData()
      },
      { deep: true }
    )

    // 初始化
    if (!props.dataSource?.manualRequest) {
      fetchData()
    }

    return {
      loading,
      data,
      pagination,
      queryForm,
      tableColumns,
      searchFields,
      searchRules,
      selectedRowKeys,
      selectedRows,
      getValueEnumLabel,
      getValueEnumStatus,
      getNestedValue,
      handleSizeChange,
      handleCurrentChange,
      handleSearch,
      handleReset,
      handleRefresh,
      handleSelectionChange,
      clearSelection
    }
  }
})
</script>

<style lang="scss" scoped>
.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;

  .el-button {
    margin: 0;
  }
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.image-container {
  .image-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .more-images {
      font-size: 12px;
      color: #999;
      margin-left: 4px;
      padding: 2px 6px;
      background: #f5f5f5;
      border-radius: 4px;
    }
  }
}
</style>
