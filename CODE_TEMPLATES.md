# 代码模板指南

本文档提供了基于 `pro-components-vue2` 的常用代码模板，帮助开发者快速构建业务页面。

## 📋 模板列表

### 1. Vue 页面模板 (`page`)

创建完整的 Vue 页面，包含表格、搜索、操作等功能。

```vue
<template>
  <PageContainer>
    <ProTable :columns="columns" :request="request">
      <template #toolBar>
        <el-button type="primary" @click="onAdd"> 新增 </el-button>
      </template>
    </ProTable>

    <!-- 编辑/新增抽屉 -->
    <EditDrawer v-bind="drawerFormProps" @refresh="onRefresh" />
  </PageContainer>
</template>

<script lang="ts">
import { queryList } from "@/api/business";
import ProTable from "@/components/proTable/index.vue";
import { ICommonTableColumn } from "@/components/proTable/type";
import { useDrawerForm } from "@/hooks/useDrawerForm";
import { useMessage } from "@/hooks/useMessage";
import { useDialog } from "@/hooks/useDialog";
import { useProTableRequest } from "@/hooks/useProTableRequest";
import PageContainer from "@/layout/pageContainer/index.vue";
import { defineComponent } from "@vue/composition-api";
import EditDrawer from "./components/edit-drawer/index.vue";

export default defineComponent({
  name: "PageName",
  components: { PageContainer, ProTable, EditDrawer },
  setup() {
    /** 消息提示 */
    const message = useMessage();

    /** 对话框 */
    const dialog = useDialog();

    /** 表格请求 hooks */
    const { request, onRefresh } = useProTableRequest(queryList, {
      paramsFormat: (params) => ({ ...params }),
    });

    /** 编辑新增 hooks */
    const { onEdit, onDetail, onAdd, onCopy, drawerFormProps } = useDrawerForm({
      drawerTitle: "页面标题",
      rowKey: "id",
    });

    /** 表格列配置 */
    const tableColumns: ICommonTableColumn[] = [
      { prop: "id", label: "ID", width: 80, hideInSearch: true },
      { prop: "name", label: "名称", valueType: "input" },
      {
        prop: "imageUrl",
        label: "图片",
        valueType: "image",
        hideInSearch: true,
      },
      {
        prop: "status",
        label: "状态",
        valueType: "select",
        valueEnum: { 1: "启用", 0: "禁用" },
      },
      {
        prop: "actions",
        label: "操作",
        type: "actions",
        width: 180,
        fixed: "right",
        align: "center",
        hideInSearch: true,
        buttons: [
          {
            text: "编辑",
            type: "primary",
            onClick: (row: any) => onEdit(row),
          },
          {
            text: "查看",
            type: "info",
            onClick: (row: any) => onDetail(row),
          },
          {
            text: "复制",
            type: "warning",
            onClick: (row: any) => onCopy(row),
          },
          {
            text: "删除",
            type: "danger",
            onClick: (_row: any) => {
              dialog.confirm({
                title: "删除",
                content: "确定要删除这条记录吗？",
                onOk: async () => {
                  try {
                    /** TODO: 删除接口调用 */
                    message.success("删除成功");
                    onRefresh();
                  } catch (error) {
                    // 错误会自动处理
                    onRefresh();
                  }
                },
              });
            },
          },
        ],
      },
    ];

    /** 合并列配置 */
    const columns: ICommonTableColumn[] = [
      ...tableColumns.map((item) => ({ ...item, hideInSearch: true })),
    ];

    return {
      columns,
      request,
      onAdd,
      onRefresh,
      drawerFormProps,
    };
  },
});
</script>

<style lang="scss" scoped>
.container {
  // 页面样式
}
</style>
```

### 2. Vue 组件模板 (`component`)

创建可复用的 Vue 组件。

```vue
<template>
  <div class="component-name">
    <!-- 组件内容 -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "ComponentName",
  props: {
    // props 定义
  },
  emits: [
    // emits 定义
  ],
  setup(props, { emit }) {
    // 组件逻辑

    return {
      // 返回数据和方法
    };
  },
});
</script>

<style lang="scss" scoped>
.component-name {
  // 组件样式
}
</style>
```

### 3. 编辑抽屉组件模板 (`edit-drawer`)

创建编辑/新增抽屉组件。

```vue
<template>
  <DrawerForm
    :title="title"
    :open="open"
    :isDetail="isDetail"
    :initialValue="initialValue"
    @onSubmit="handleSubmit"
    @onClose="handleClose"
  >
    <template #default="{ formData, isDetail }">
      <!-- 字段名称 -->
      <ProFormText
        name="fieldName"
        label="字段标签"
        :rules="[{ required: true, message: '请输入', trigger: 'blur' }]"
        v-model="formData.fieldName"
        :disabled="isDetail"
        placeholder="请输入"
        :maxlength="50"
        showWordLimit
      />

      <!-- 时间字段 -->
      <ProFormDate
        name="timeRange"
        label="时间范围"
        :rules="[{ required: true, message: '请选择', trigger: 'change' }]"
        v-model="formData.timeRange"
        type="daterange"
        :disabled="isDetail"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        style="width: 100%"
      />

      <!-- 选择字段 -->
      <ProFormSelect
        name="selectField"
        label="选择标签"
        :rules="[{ required: true, message: '请选择', trigger: 'change' }]"
        v-model="formData.selectField"
        :disabled="isDetail"
        placeholder="请选择"
        :options="OOptions"
      />

      <!-- 多选字段 -->
      <ProFormCheckbox
        name="checkboxField"
        label="多选标签"
        :rules="[{ required: true, message: '请选择', trigger: 'change' }]"
        v-model="formData.checkboxField"
        :disabled="isDetail"
        placeholder="请选择"
        :options="OCheckboxOptions"
      />

      <!-- 文本域字段 -->
      <ProFormTextarea
        name="textareaField"
        label="文本域标签"
        v-model="formData.textareaField"
        :rules="[{ required: true, message: '请输入', trigger: 'blur' }]"
        placeholder="请输入"
        :rows="4"
        :maxlength="200"
      />
    </template>
  </DrawerForm>
</template>

<script lang="ts">
import DrawerForm from "@/components/proForm/DrawerForm.vue";
import ProFormText from "@/components/proForm/fields/ProFormText.vue";
import ProFormSelect from "@/components/proForm/fields/ProFormSelect.vue";
import ProFormDate from "@/components/proForm/fields/ProFormDate.vue";
import ProFormCheckbox from "@/components/proForm/fields/ProFormCheckbox.vue";
import ProFormTextarea from "@/components/proForm/fields/ProFormTextarea.vue";
import { useMessage } from "@/hooks/useMessage";
import { useSuperLock } from "@/hooks/useSuperLock";
import { defineComponent, computed } from "@vue/composition-api";

export default defineComponent({
  name: "EditDrawer",
  components: {
    DrawerForm,
    ProFormText,
    ProFormSelect,
    ProFormDate,
    ProFormCheckbox,
    ProFormTextarea,
  },
  props: {
    /** 详情数据 */
    detail: { type: Object, default: () => undefined },
    /** 表单标题 */
    title: { type: String, required: true },
    /** 表单弹窗是否可见 */
    open: { type: Boolean, required: true },
    /** 是否是查看详情 */
    isDetail: { type: Boolean, default: false },
    /** 关闭弹窗 */
    onClose: { type: Function, required: true },
  },
  emits: ["onRefresh"],
  setup(props, { emit }) {
    const message = useMessage();

    /** 初始表单数据 */
    const initialValue = computed(() => {
      const defalutValue = {};

      const detail = props.detail;
      if (props?.open && detail) {
        return {
          ...defalutValue,
          ...detail,
          // 时间字段处理
        };
      }
      return defalutValue;
    });

    /** 提交处理 */
    const [handleSubmit] = useSuperLock(async (values: any) => {
      try {
        const { timeRange, ...restValues } = values;

        const params = {
          ...restValues,
          // 时间字段处理
        };

        console.log("验证通过，开始提交数据:", params);
        onRefresh();
        handleClose();

        message.success("提交成功");
      } catch (error) {
        message.error("提交失败");
        throw error;
      }
    });

    /** 关闭处理 */
    const handleClose = () => {
      if (props.onClose) {
        props.onClose();
      }
    };

    const onRefresh = () => {
      emit("onRefresh");
    };

    return {
      initialValue,
      OStatus,
      handleClose,
      handleSubmit,
    };
  },
});
</script>

<style lang="scss" scoped>
// 抽屉样式
</style>
```

### 4. 类型定义模板 (`type-def`)

创建 TypeScript 类型定义。

```typescript
// 模块名数据类型定义
export interface ItemDTO {
  id?: number;
  name?: string;
  status?: number;
  createTime?: string;
  updateTime?: string;
  // 其他字段
}

// 表单数据类型（扩展主数据类型）
export interface FormItemDTO extends Omit<ItemDTO, "timeField"> {
  timeRange?: string[]; // 表单特有的字段
}

// API 响应数据类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}
```

### 5. 枚举定义模板 (`enum-def`)

创建枚举和映射对象。

```typescript
// 枚举名枚举定义
export enum EStatus {
  /** 状态1 */
  Active = 1,
  /** 状态2 */
  Inactive = 0,
}

// 映射对象（用于表格显示）
export const MStatus = {
  [EStatus.Active]: "状态1",
  [EStatus.Inactive]: "状态2",
};

// 选项数组（用于表单选择）
export const OStatus = [
  { value: EStatus.Active, label: "状态1" },
  { value: EStatus.Inactive, label: "状态2" },
];
```

### 6. 工具函数模板 (`utils-func`)

创建工具函数。

```typescript
// 功能描述工具函数
export const functionName = (params: ParamType): ReturnType => {
  // 函数实现
};

// 格式化函数
export const formatData = (data: DataType): string => {
  return data?.toString() || "-";
};

// 验证函数
export const validateField = (value: ValueType): boolean => {
  return !!value;
};
```

### 7. API 函数模板 (`api-func`)

创建 API 接口函数。

```typescript
import { http } from "@/utils/http";
import { ItemDTO, ApiResponse } from "@/types";

// 获取列表数据
export const queryList = (params: any): Promise<ApiResponse<ItemDTO[]>> => {
  return http.get("/api/path", { params });
};

// 获取详情数据
export const queryDetail = (id: number): Promise<ApiResponse<ItemDTO>> => {
  return http.get(`/api/path/${id}`);
};

// 提交表单数据
export const submitForm = (data: ItemDTO): Promise<ApiResponse> => {
  return http.post("/api/path", data);
};

// 更新数据
export const updateItem = (
  id: number,
  data: Partial<ItemDTO>
): Promise<ApiResponse> => {
  return http.put(`/api/path/${id}`, data);
};

// 删除数据
export const deleteItem = (id: number): Promise<ApiResponse> => {
  return http.delete(`/api/path/${id}`);
};
```

### 8. Hooks 使用模板 (`hooks-usage`)

展示各种 Hooks 的使用方法。

```typescript
import { useState } from "@/hooks/useState";
import { useMutate } from "@/hooks/useMutate";
import { useProTableRequest } from "@/hooks/useProTableRequest";
import { useDrawerForm } from "@/hooks/useDrawerForm";
import { useMessage } from "@/hooks/useMessage";
import { useDialog } from "@/hooks/useDialog";
import { useSuperLock } from "@/hooks/useSuperLock";

// 状态管理
const { state, setState } = useState();

// 消息提示
const message = useMessage();

// 对话框
const dialog = useDialog();

// 接口请求
const { mutate: submitForm } = useMutate(apiFunction, {
  onSuccess: () => {
    // 成功回调
  },
});

// 表格请求
const { request, onRefresh } = useProTableRequest(queryApi, {
  paramsFormat: (params) => ({ ...params }),
});

// 抽屉表单
const { onEdit, onDetail, onAdd, onCopy, drawerFormProps } = useDrawerForm({
  drawerTitle: "页面标题",
  rowKey: "id",
});

// 超级锁函数（严格防抖）
const [submitFn, isLocked] = useSuperLock(async (data: any) => {
  // 关键操作，如支付、提交等
  await api.submit(data);
}, 500);

// 消息提示使用
message.success("操作成功");
message.error("操作失败");

// 对话框使用
dialog.confirm({
  title: "确认",
  content: "确定要执行此操作吗？",
  onOk: async () => {
    // 确认操作
  },
});
```

## 🎯 使用技巧

### 1. 快速创建页面

1. 使用 `page` 模板创建基础页面结构
2. 使用 `edit-drawer` 模板创建编辑抽屉
3. 使用 `type-def` 模板定义数据类型
4. 使用 `api-func` 模板创建 API 函数

### 2. 组件开发

1. 使用 `component` 模板创建可复用组件
2. 使用 `hooks-usage` 模板了解 Hooks 用法
3. 使用 `utils-func` 模板创建工具函数

### 3. 数据管理

1. 使用 `enum-def` 模板管理枚举值
2. 使用 `type-def` 模板定义数据结构
3. 使用 `api-func` 模板统一 API 接口

## 📚 最佳实践

1. **命名规范**: 使用 PascalCase 命名组件，camelCase 命名函数
2. **类型安全**: 充分利用 TypeScript 类型定义
3. **代码复用**: 通过 Hooks 实现逻辑复用
4. **错误处理**: 使用 try-catch 和错误边界
5. **性能优化**: 使用 useSuperLock 防止重复提交

## 🔧 自定义模板

你可以根据项目需求自定义模板：

1. 复制现有模板
2. 修改模板内容
3. 保存为新的模板文件
4. 在 IDE 中配置代码片段

这些模板将大大提高你的开发效率，让你专注于业务逻辑的实现！
