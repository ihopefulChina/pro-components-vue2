<template>
  <div class="pro-table">
    <!-- 搜索表单 + 工具栏 -->
    <div class="pro-table-search">
      <SearchForm
        v-model="queryForm"
        :fields="searchFields"
        :rules="searchRules"
        :loading="loading"
        @search="handleSearch"
        @reset="handleReset"
      >
        <template #extra-buttons>
          <slot name="extra-search-buttons" />
          <!-- 工具栏按钮 -->
          <slot name="toolBar" :selected-row-keys="selectedRowKeys" :selected-rows="selectedRows" />
        </template>
      </SearchForm>
    </div>

    <!-- 表格警告信息 -->
    <div v-if="selectedRowKeys.length > 0" class="pro-table-alert">
      <slot name="tableAlert" :selected-row-keys="selectedRowKeys" :selected-rows="selectedRows" />
    </div>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="data"
      class="table"
      :row-key="rowKey"
      :max-height="tableMaxHeight"
      @selection-change="handleSelectionChange"
    >
      <!-- 选择列 -->
      <el-table-column v-if="rowSelection" type="selection" width="55" />

      <el-table-column
        v-for="col in tableColumns"
        :key="col.prop"
        v-bind="getTableColumnProps(col)"
      >
        <!-- 自定义插槽 -->
        <template v-if="col.slotName" #default="scope">
          <slot :name="col.slotName" v-bind="scope" />
        </template>
        <!-- 操作列 -->
        <template v-else-if="col.type === 'actions'" #default="scope">
          <div class="action-buttons">
            <el-button
              v-for="(button, index) in col.buttons || []"
              v-show="
                typeof button.show === 'function' ? button.show(scope.row) : button.show !== false
              "
              :key="index"
              :type="button.type || 'primary'"
              :size="button.size || 'mini'"
              :icon="button.icon"
              :disabled="
                typeof button.disabled === 'function' ? button.disabled(scope.row) : button.disabled
              "
              @click="button.onClick(scope.row)"
            >
              {{ button.text }}
            </el-button>
          </div>
        </template>
        <!-- 渲染render -->
        <template v-else-if="col.render" #default="scope">
          <el-link
            v-if="col.valueType === 'link' && col.render"
            :underline="false"
            :href="col.render(getNestedValue(scope.row, col.prop), scope.row)"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ col.render(getNestedValue(scope.row, col.prop), scope.row) }}
          </el-link>
          <span v-else-if="col.render">
            {{ col.render(getNestedValue(scope.row, col.prop), scope.row) }}
          </span>
        </template>
        <!-- 图片显示 -->
        <template v-else-if="col.valueType === 'image'" #default="scope">
          <div
            v-if="getImageList(getNestedValue(scope.row, col.prop)).length"
            class="image-container"
          >
            <!-- 单个图片 -->
            <el-image
              v-if="getImageList(getNestedValue(scope.row, col.prop)).length === 1"
              :src="getImageList(getNestedValue(scope.row, col.prop))[0]"
              :style="col.imageStyle || 'width: 60px; height: auto;'"
              :preview-src-list="getImageList(getNestedValue(scope.row, col.prop))"
              fit="cover"
              :lazy="col.lazy !== false"
            />
            <!-- 图片列表 -->
            <div v-else class="image-list">
              <el-image
                v-for="(img, index) in getImageList(getNestedValue(scope.row, col.prop)).slice(
                  0,
                  col.maxImages || 3
                )"
                :key="index"
                :src="img"
                :style="col.imageStyle || 'width: 40px; height: auto; margin-right: 4px;'"
                :preview-src-list="getImageList(getNestedValue(scope.row, col.prop))"
                fit="cover"
                :lazy="col.lazy !== false"
              />
              <span
                v-if="
                  getImageList(getNestedValue(scope.row, col.prop)).length > (col.maxImages || 3)
                "
                class="more-images"
              >
                +{{
                  getImageList(getNestedValue(scope.row, col.prop)).length - (col.maxImages || 3)
                }}
              </span>
            </div>
          </div>
          <span v-else>-</span>
        </template>
        <!-- valueEnum 显示 -->
        <template v-else-if="col.valueEnum" #default="scope">
          <el-tag
            v-if="!!getValueEnumStatus(getNestedValue(scope.row, col.prop), col.valueEnum)"
            :type="getValueEnumStatus(getNestedValue(scope.row, col.prop), col.valueEnum)"
            size="small"
          >
            {{ getValueEnumLabel(getNestedValue(scope.row, col.prop), col.valueEnum) || "-" }}
          </el-tag>
          <span v-else>
            {{ getValueEnumLabel(getNestedValue(scope.row, col.prop), col.valueEnum) || "-" }}
          </span>
        </template>
        <!-- 默认显示 -->
        <template v-else #default="scope">
          <span
            v-if="col.ellipsis"
            :title="String(formatCellValue(getNestedValue(scope.row, col.prop)))"
            :style="getEllipsisStyle(col.ellipsis)"
          >
            {{ formatCellValue(getNestedValue(scope.row, col.prop)) }}
          </span>
          <span v-else>{{ formatCellValue(getNestedValue(scope.row, col.prop)) }}</span>
        </template>
      </el-table-column>

      <!-- 空状态插槽 -->
      <template #empty>
        <slot name="empty">
          <el-empty description="暂无数据" />
        </slot>
      </template>
    </el-table>

    <div class="pro-table-pagination">
      <el-pagination
        :current-page="pagination.currentPage"
        :page-sizes="[10, 30, 60, 100, 180, 360]"
        :page-size="pagination.pageSize"
        :layout="paginationLayout"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  PropType,
  ref,
  watch,
} from "@vue/composition-api";
import type { DataSourceConfig, ICommonTableColumn } from "./type";
import type { FormRules, SearchField } from "@/components/searchForm/types";
import SearchForm from "@/components/searchForm/index.vue";

interface Pagination {
  currentPage: number;
  pageSize: number;
  total: number;
}

export default defineComponent({
  name: "ProTable",
  components: { SearchForm },
  expose: ["clearSelection"],
  props: {
    /** 列配置 */
    columns: {
      type: Array as PropType<ICommonTableColumn[]>,
      required: true,
    },
    /** 请求函数 */
    request: {
      type: Function as PropType<
        (
          params: Record<string, unknown>,
          sort: Record<string, unknown>,
          filter: Record<string, unknown>
        ) => Promise<{ data?: unknown[]; success?: boolean; total?: number }>
      >,
      required: false,
    },
    /** 数据源配置（参考 Antd ProTable） */
    dataSource: {
      type: Object as PropType<DataSourceConfig>,
      default: () => ({}),
    },
    /** 行键 */
    rowKey: {
      type: String,
      default: "id",
    },
    /** 滚动配置 */
    scroll: {
      type: Object as PropType<{ y?: string | number }>,
      default: () => ({}),
    },
    /** 行选择配置 */
    rowSelection: {
      type: Object,
      default: null,
    },
  },
  setup(props, { refs, root }) {
    const loading = ref(false);
    const data = ref<Record<string, unknown>[]>([]);
    const pagination = ref<Pagination>({
      currentPage: props.dataSource.pagination?.current ?? 1,
      pageSize: props.dataSource.pagination?.pageSize ?? 10,
      total: props.dataSource.pagination?.total ?? 0,
    });
    const queryForm = ref<Record<string, unknown>>({});
    let requestSequence = 0;

    // 行选择状态
    const selectedRowKeys = ref<unknown[]>([]);
    const selectedRows = ref<Record<string, unknown>[]>([]);

    // 过滤表格列（隐藏搜索列）
    const tableColumns = computed(() => {
      return props.columns.filter(col => !col.hideInTable);
    });

    // 从 columns 中提取搜索表单配置
    const searchFields = computed(() => {
      const fields = props.columns
        .filter(col => !col.hideInSearch && col.type !== "actions" && col.valueType !== "image")
        .map(col => {
          const valueType = col.valueType || "input";
          const defaultPlaceholder =
            valueType === "select" || valueType === "date" || valueType === "daterange"
              ? "请选择"
              : "请输入";
          const field: SearchField = {
            prop: col.prop,
            label: col.searchLabel || col.label,
            type: valueType,
            placeholder:
              col.searchPlaceholder ||
              col.fieldProps?.placeholder ||
              `${defaultPlaceholder}${col.searchLabel || col.label}`,
            width: col.searchWidth,
            fieldProps: col.fieldProps,
            ...col.searchProps,
          };

          // 处理 fieldProps 中的特殊属性转换
          if (col.fieldProps) {
            if (col.fieldProps.maxLength !== undefined) {
              field.maxlength = col.fieldProps.maxLength;
            }
            if (col.fieldProps.clearable !== undefined) {
              field.clearable = col.fieldProps.clearable;
            }
            if (col.fieldProps.disabled !== undefined) {
              field.disabled = col.fieldProps.disabled;
            }
            if (col.fieldProps.width !== undefined && !field.width) {
              field.width = col.fieldProps.width;
            }
          }

          // 处理选择器选项
          if (col.valueType === "select" && col.valueEnum) {
            if (Array.isArray(col.valueEnum)) {
              field.options = col.valueEnum;
            } else {
              field.options = Object.entries(col.valueEnum).map(([key, value]) => {
                // 支持两种格式：
                // 1. { 500: "活动榜单" } - value 是字符串
                // 2. { 500: { label: "活动榜单", value: 500 } } - value 是对象
                if (typeof value === "string") {
                  return { label: value, value: key };
                } else {
                  return { label: value.label, value: value.value ?? key };
                }
              });
            }
          }

          return field;
        });

      return fields;
    });

    // 从 columns 中提取搜索表单验证规则
    const searchRules = computed(() => {
      const rules: FormRules = {};
      props.columns.forEach(col => {
        if (col.searchRules && col.searchRules.length > 0) {
          rules[col.prop] = col.searchRules;
        }
      });
      return rules;
    });

    // 执行请求
    const fetchData = async () => {
      const requestId = ++requestSequence;
      loading.value = true;

      try {
        // 优先使用 dataSource 配置
        if (Array.isArray(props.dataSource.dataSource)) {
          // 使用静态数据源
          const staticData = props.dataSource.dataSource as Record<string, unknown>[];
          const start = (pagination.value.currentPage - 1) * pagination.value.pageSize;
          data.value = staticData.slice(start, start + pagination.value.pageSize);
          pagination.value.total = staticData.length;
          return;
        }

        if (props.dataSource.request) {
          // 使用 dataSource 的请求函数
          const params = {
            ...props.dataSource.params,
            ...queryForm.value,
            currentPage: pagination.value.currentPage,
            pageSize: pagination.value.pageSize,
          };

          const result = await props.dataSource.request(params);
          if (requestId !== requestSequence) return;
          if (result.success === false) throw new Error("数据请求返回失败状态");

          const responseData = result.data ?? [];
          data.value = props.dataSource.dataTransform
            ? props.dataSource.dataTransform(responseData)
            : responseData;
          pagination.value.total = result.total ?? 0;

          // 调用成功回调
          props.dataSource.onRequestSuccess?.(data.value, pagination.value.total);
        } else if (props.request) {
          // 使用原有的 request 函数
          const result = await props.request(
            {
              ...queryForm.value,
              currentPage: pagination.value.currentPage,
              pageSize: pagination.value.pageSize,
            },
            {},
            {}
          );
          if (requestId !== requestSequence) return;
          if (result.success === false) throw new Error("数据请求返回失败状态");

          data.value = (result.data ?? []) as Record<string, unknown>[];
          pagination.value.total = result.total ?? 0;
          props.dataSource.onRequestSuccess?.(data.value, pagination.value.total);
        } else {
          // 没有配置数据源
          data.value = [];
          pagination.value.total = 0;
        }
      } catch (error) {
        if (requestId !== requestSequence) return;
        console.error("请求失败:", error);
        data.value = [];
        pagination.value.total = 0;

        // 调用错误回调
        props.dataSource.onRequestError?.(error);
      } finally {
        if (requestId === requestSequence) {
          loading.value = false;
        }
      }
    };

    // 分页大小改变
    const handleSizeChange = (size: number) => {
      pagination.value.pageSize = size;
      pagination.value.currentPage = 1;
      fetchData();
    };

    // 分页当前页改变
    const handleCurrentChange = (page: number) => {
      pagination.value.currentPage = page;
      fetchData();
    };

    // 搜索处理
    const handleSearch = async (searchData: Record<string, unknown>) => {
      queryForm.value = { ...searchData };
      pagination.value.currentPage = 1;
      await fetchData();
    };

    // 重置处理
    const handleReset = () => {
      queryForm.value = {};
      pagination.value.currentPage = 1;
      fetchData();
    };

    // 刷新
    const handleRefresh = () => {
      fetchData();
    };

    // 行选择变化
    const handleSelectionChange = (selection: Record<string, unknown>[]) => {
      selectedRows.value = selection;
      selectedRowKeys.value = selection.map(row => getNestedValue(row, props.rowKey));

      // 触发外部选择变化事件
      if (props.rowSelection?.onChange) {
        props.rowSelection.onChange(selectedRowKeys.value, selectedRows.value);
      }
    };

    // 获取 valueEnum 的标签
    const getValueEnumLabel = (value: unknown, valueEnum: ICommonTableColumn["valueEnum"]) => {
      if (!valueEnum) return value;
      if (Array.isArray(valueEnum)) {
        const option = valueEnum.find(item => item.value === value);
        return option ? option.label : value;
      } else if (typeof valueEnum === "object" && valueEnum !== null) {
        const option = valueEnum[value as string | number];
        if (option) {
          // 支持两种格式：
          // 1. { 500: "活动榜单" } - 直接返回字符串
          // 2. { 500: { label: "活动榜单", value: 500 } } - 返回 label
          return typeof option === "string" ? option : option.label;
        }
        return value;
      }
      return value;
    };
    // 获取 valueEnum 的状态
    const getValueEnumStatus = (value: unknown, valueEnum: ICommonTableColumn["valueEnum"]) => {
      if (!valueEnum) return undefined;
      if (!Array.isArray(valueEnum) && typeof valueEnum === "object" && valueEnum !== null) {
        const option = valueEnum[value as string | number];

        return typeof option === "object" ? option.status : undefined;
      }
    };

    // 安全获取嵌套属性值
    const getNestedValue = (obj: unknown, path: string) => {
      if (!obj || !path) return undefined;

      return path.split(".").reduce<unknown>((current, key) => {
        if (typeof current !== "object" || current === null) return undefined;
        return (current as Record<string, unknown>)[key];
      }, obj);
    };

    const formatCellValue = (value: unknown) => value ?? "-";

    const getImageList = (value: unknown): string[] => {
      if (typeof value === "string") return [value];
      if (!Array.isArray(value)) return [];
      return value.filter((item): item is string => typeof item === "string");
    };

    const getEllipsisStyle = (ellipsis: ICommonTableColumn["ellipsis"]) => ({
      display: "-webkit-box",
      "-webkit-line-clamp": ellipsis === true ? 1 : ellipsis,
      "-webkit-box-orient": "vertical",
      overflow: "hidden",
    });

    const getTableColumnProps = (column: ICommonTableColumn) => {
      const customKeys = new Set([
        "slotName",
        "type",
        "buttons",
        "hideInSearch",
        "hideInTable",
        "searchPlaceholder",
        "searchWidth",
        "searchLabel",
        "valueType",
        "valueEnum",
        "searchRules",
        "ellipsis",
        "searchProps",
        "fieldProps",
        "render",
        "imageStyle",
        "onImageClick",
        "maxImages",
        "lazy",
      ]);

      return Object.fromEntries(Object.entries(column).filter(([key]) => !customKeys.has(key)));
    };

    const tableMaxHeight = computed(() => props.scroll.y);
    const paginationLayout = computed(() => {
      const parts = ["total"];
      if (props.dataSource.pagination?.showSizeChanger !== false) parts.push("sizes");
      parts.push("prev", "pager", "next");
      if (props.dataSource.pagination?.showQuickJumper !== false) parts.push("jumper");
      return parts.join(", ");
    });

    // 清除选择
    const clearSelection = () => {
      selectedRowKeys.value = [];
      selectedRows.value = [];

      // 使用 nextTick 确保 DOM 更新后再访问表格引用
      nextTick(() => {
        const table = (refs.multipleTable || root.$refs.multipleTable) as
          { clearSelection?: () => void } | undefined;
        if (table && table.clearSelection) {
          table.clearSelection();
        }
      });
    };

    // 外部静态数据或固定参数变化时刷新，manualRequest 仍保持手动语义
    watch(
      () => props.dataSource.dataSource,
      () => {
        if (!props.dataSource.manualRequest) fetchData();
      },
      { deep: true }
    );

    watch(
      () => props.dataSource.params,
      () => {
        if (!props.dataSource.manualRequest) {
          pagination.value.currentPage = 1;
          fetchData();
        }
      },
      { deep: true }
    );

    onMounted(() => {
      if (!props.dataSource.manualRequest) fetchData();
    });

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
      formatCellValue,
      getImageList,
      getEllipsisStyle,
      getTableColumnProps,
      tableMaxHeight,
      paginationLayout,
      handleSizeChange,
      handleCurrentChange,
      handleSearch,
      handleReset,
      handleRefresh,
      handleSelectionChange,
      clearSelection,
    };
  },
});
</script>

<style lang="scss" scoped>
.pro-table-search,
.pro-table-alert {
  margin-bottom: 15px;
}

.table {
  width: 100%;
}

.pro-table-pagination {
  margin-top: 20px;
  text-align: right;
  overflow-x: auto;
}

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
