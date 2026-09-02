import type { ApiRow, DocEntry } from "./types";

const api = (name: string, description: string, type: string, defaultValue = "—"): ApiRow => ({
  name,
  description,
  type,
  defaultValue,
});

const event = (name: string, description: string, type: string): ApiRow =>
  api(name, description, type);

const fieldBase = (): ApiRow[] => [
  api("name", "字段名，并用于 Element UI 表单校验", "string", "必填"),
  api("label", "表单项标签", "string", "必填"),
  api("span", "el-col 栅格占位", "number", "24"),
  api("required", "是否展示必填状态", "boolean", "false"),
  api("rules", "Element UI 校验规则", "FormRule[]", "[]"),
  api("tooltip", "标签下方的帮助说明", "string", '""'),
];

const inputEvent = event("input", "v-model 值变化时触发", "(value: unknown) => void");

const fieldCode = (name: string, attrs = "", initial = "value") => `<template>
  <ProForm :initial-value="{ ${initial}: undefined }" :show-footer="false">
    <template #default="{ formData }">
      <${name} v-model="formData.${initial}" name="${initial}" label="示例字段" ${attrs}/>
    </template>
  </ProForm>
</template>`;

const field = (
  slug: string,
  name: string,
  description: string,
  extraProps: ApiRow[],
  events: ApiRow[] = [inputEvent],
  code = fieldCode(name)
): DocEntry => ({
  slug,
  name,
  title: name,
  category: "表单字段",
  description,
  since: "1.0.0",
  code,
  props: [...fieldBase(), ...extraProps],
  events,
});

const optionProps = [
  api("options", "可选项；每项包含 label、value 和可选 disabled", "Option[]", "[]"),
  api("disabled", "禁用组件", "boolean", "false"),
];

const components: DocEntry[] = [
  {
    slug: "pro-form",
    name: "ProForm",
    title: "ProForm 高级表单",
    category: "表单容器",
    description: "管理表单数据、验证、异步提交和受控的底部操作区。",
    since: "1.0.0",
    code: `<template>
  <ProForm :initial-value="initialValue" :rules="rules" :submitter="save">
    <template #default="{ formData }">
      <ProFormText v-model="formData.name" name="name" label="项目名称" required />
      <ProFormSelect v-model="formData.status" name="status" label="状态" :options="options" />
    </template>
  </ProForm>
</template>`,
    props: [
      api("initialValue", "初始化及切换记录时的表单值", "Record<string, unknown>"),
      api("rules", "Element UI 表单校验规则", "Record<string, FormRule[]>", "{}"),
      api("labelPosition", "标签位置", '"left" | "right" | "top"', '"top"'),
      api("labelWidth", "标签宽度", "string"),
      api("readonly", "只读展示模式", "boolean", "false"),
      api("disabled", "禁用整张表单", "boolean", "false"),
      api("showFooter", "显示取消与提交按钮", "boolean", "true"),
      api("cancelText", "取消按钮文案", "string", '"取消"'),
      api("confirmText", "提交按钮文案", "string", '"提交"'),
      api("inDrawer", "启用抽屉内吸底操作区", "boolean", "false"),
      api("submitter", "可等待的提交函数；期间锁定重复提交", "(values) => void | Promise<void>"),
    ],
    events: [
      event("submit", "验证和 submitter 成功后触发", "(values) => void"),
      event("reset", "重置为 initialValue 后触发", "() => void"),
      event("cancel", "点击取消后触发", "() => void"),
    ],
    slots: [api("default", "表单内容", "{ formData, isDetail }")],
    methods: [
      api("submit", "验证并提交表单", "() => Promise<boolean>"),
      api("reset", "重置数据和校验状态", "() => void"),
      api("validate", "校验整张表单", "() => Promise<boolean>"),
      api("setFieldsValue", "合并设置字段", "(values) => void"),
      api("getFieldsValue", "获取当前值的浅拷贝", "() => Record<string, unknown>"),
    ],
  },
  {
    slug: "pro-form-item",
    name: "ProFormItem",
    title: "ProFormItem 表单项",
    category: "表单容器",
    description: "统一栅格、校验规则与帮助信息的基础表单项。",
    since: "1.0.0",
    code: `<ProFormItem name="email" label="邮箱" :rules="emailRules" tooltip="用于接收通知">
  <el-input v-model="email" />
</ProFormItem>`,
    props: [
      ...fieldBase(),
      api("formItemStyle", "el-form-item 自定义样式", "Record<string, string>", "{}"),
    ],
    slots: [api("default", "字段控件", "VNode")],
    methods: [
      api("resetField", "重置当前字段", "() => void"),
      api("clearValidate", "清除当前字段校验", "() => void"),
    ],
  },
  {
    slug: "modal-form",
    name: "ModalForm",
    title: "ModalForm 弹窗表单",
    category: "表单容器",
    description: "在 Element UI Dialog 内提供可验证、可等待提交的 ProForm。",
    since: "1.0.0",
    code: `<ModalForm :open="open" title="编辑成员" :initial-value="record" :submitter="save" @close="open = false">
  <template #default="{ formData }">
    <ProFormText v-model="formData.name" name="name" label="姓名" />
  </template>
</ModalForm>`,
    props: [
      api("title", "弹窗标题", "string", "必填"),
      api("open", "是否打开", "boolean", "必填"),
      api("isDetail", "详情只读模式", "boolean", "false"),
      api("initialValue", "初始表单值", "Record<string, unknown>"),
      api("rules", "校验规则", "Record<string, FormRule[]>", "{}"),
      api("width", "弹窗宽度", "string | number", '"800px"'),
      api("submitter", "可等待的提交函数", "(values) => void | Promise<void>"),
      api("onClose", "与 useDrawerForm 风格一致的关闭回调", "() => void"),
    ],
    events: [
      event("close", "请求关闭时触发", "() => void"),
      event("submit", "提交成功后触发", "(values) => void"),
    ],
    slots: [api("default", "表单内容", "{ formData, isDetail }")],
  },
  {
    slug: "drawer-form",
    name: "DrawerForm",
    title: "DrawerForm 抽屉表单",
    category: "表单容器",
    description: "适合长表单与详情编辑，操作区在抽屉内保持可见。",
    since: "1.0.0",
    code: `<DrawerForm v-bind="drawerFormProps" :submitter="save">
  <template #default="{ formData }">
    <ProFormTextarea v-model="formData.description" name="description" label="说明" />
  </template>
</DrawerForm>`,
    props: [
      api("title", "抽屉标题", "string", "必填"),
      api("open", "是否打开", "boolean", "必填"),
      api("isDetail", "详情只读模式", "boolean", "false"),
      api("initialValue", "初始表单值", "Record<string, unknown>"),
      api("rules", "校验规则", "Record<string, FormRule[]>", "{}"),
      api("width", "抽屉宽度", "string | number", '"800px"'),
      api("submitter", "可等待的提交函数", "(values) => void | Promise<void>"),
      api("onClose", "关闭回调", "() => void"),
    ],
    events: [
      event("close", "请求关闭时触发", "() => void"),
      event("submit", "提交成功后触发", "(values) => void"),
    ],
    slots: [api("default", "表单内容", "{ formData, isDetail }")],
  },
  field(
    "pro-form-text",
    "ProFormText",
    "文本、密码等单行输入场景。",
    [
      api("value", "字段值", "string | number", '""'),
      api("type", "原生输入类型", "string", '"text"'),
      api("placeholder", "占位文案", "string", '""'),
      api("disabled", "禁用", "boolean", "false"),
      api("readonly", "只读", "boolean", "false"),
      api("maxlength", "最大字符数", "number"),
      api("showWordLimit", "显示字数统计", "boolean"),
    ],
    [inputEvent],
    fieldCode("ProFormText", 'placeholder="请输入项目名称"', "name")
  ),
  field("pro-form-textarea", "ProFormTextarea", "多行文本输入与自适应高度。", [
    api("value", "字段值", "string | number", '""'),
    api("placeholder", "占位文案", "string", '""'),
    api("disabled", "禁用", "boolean", "false"),
    api("readonly", "只读", "boolean", "false"),
    api("maxlength", "最大字符数", "number"),
    api("showWordLimit", "显示字数统计", "boolean"),
    api("rows", "可见行数", "number", "3"),
    api("autosize", "自动高度配置", "boolean | { minRows; maxRows }", "false"),
    api("resize", "缩放方向", "string", '"vertical"'),
  ]),
  field("pro-form-number", "ProFormNumber", "具有边界、步长和精度的数字输入。", [
    api("value", "字段值", "string | number"),
    api("placeholder", "占位文案", "string", '"请输入数字"'),
    api("disabled", "禁用", "boolean", "false"),
    api("readonly", "只读", "boolean", "false"),
    api("min", "最小值", "number"),
    api("max", "最大值", "number"),
    api("step", "步长", "number", "1"),
    api("precision", "数值精度", "number"),
    api("controls", "显示增减按钮", "boolean", "true"),
  ]),
  field(
    "pro-form-select",
    "ProFormSelect",
    "单选或多选下拉字段。",
    [
      api("value", "字段值", "string | number | unknown[]"),
      ...optionProps,
      api("placeholder", "占位文案", "string", '"请选择"'),
      api("clearable", "允许清空", "boolean", "true"),
      api("multiple", "多选模式", "boolean", "false"),
      api("filterable", "允许筛选", "boolean", "false"),
    ],
    [inputEvent, event("change", "选中值变化", "(value) => void")],
    fieldCode("ProFormSelect", ":options=\"[{ label: '运行中', value: 1 }]\"", "status")
  ),
  field("pro-form-radio", "ProFormRadio", "单项选择按钮组。", [
    api("value", "字段值", "string | number | boolean"),
    ...optionProps,
    api("size", "尺寸", '"medium" | "small" | "mini"', '"medium"'),
    api("textColor", "激活文字色", "string", '"#409EFF"'),
    api("fill", "激活填充色", "string", '"#409EFF"'),
    api("border", "显示边框样式", "boolean", "false"),
  ]),
  field(
    "pro-form-checkbox",
    "ProFormCheckbox",
    "支持数量边界的多项选择。",
    [
      api("value", "选中值数组", "unknown[]", "[]"),
      ...optionProps,
      api("min", "最少勾选数", "number"),
      api("max", "最多勾选数", "number"),
      api("size", "尺寸", '"medium" | "small" | "mini"', '"medium"'),
      api("textColor", "激活文字色", "string", '"#409EFF"'),
      api("fill", "激活填充色", "string", '"#409EFF"'),
      api("border", "显示边框样式", "boolean", "false"),
    ],
    [inputEvent, event("change", "勾选值变化", "(value) => void")]
  ),
  field("pro-form-date", "ProFormDate", "日期、日期时间及范围选择。", [
    api("value", "日期值", "string | number | Date | unknown[]"),
    api("type", "选择器类型", '"date" | "daterange" | "datetime" | "datetimerange"', '"date"'),
    api("placeholder", "单值占位文案", "string", '"请选择"'),
    api("startPlaceholder", "范围开始占位文案", "string", '"开始时间"'),
    api("endPlaceholder", "范围结束占位文案", "string", '"结束时间"'),
    api("disabled", "禁用", "boolean", "false"),
    api("readonly", "只读", "boolean", "false"),
    api("clearable", "允许清空", "boolean", "true"),
    api("format", "输入框展示格式", "string"),
    api("valueFormat", "绑定值格式", "string"),
  ]),
  field(
    "pro-form-cascader",
    "ProFormCascader",
    "级联数据选择，并完整转发 Element UI 交互事件。",
    [
      api("value", "字段值", "string | number | unknown[]"),
      api("options", "级联选项树", "CascaderOption[]", "[]"),
      api("cascaderProps", "级联字段映射及多选配置", "CascaderProps", "{}"),
      api("size", "尺寸", "string", '"medium"'),
      api("placeholder", "占位文案", "string", '"请选择"'),
      api("disabled", "禁用", "boolean", "false"),
      api("clearable", "允许清空", "boolean", "true"),
      api("showAllLevels", "输入框显示完整路径", "boolean", "true"),
      api("collapseTags", "多选时折叠标签", "boolean", "false"),
      api("separator", "路径分隔符", "string", '" / "'),
      api("filterable", "允许搜索", "boolean", "false"),
      api("filterMethod", "自定义搜索", "(node, keyword) => boolean"),
      api("debounce", "搜索防抖毫秒数", "number", "300"),
      api("beforeFilter", "搜索前钩子", "(value) => boolean"),
      api("popperClass", "浮层类名", "string", '""'),
      api("popperAppendToBody", "浮层挂载到 body", "boolean", "true"),
      api("tagType", "多选标签类型", "string", '"info"'),
      api("validateEvent", "触发表单校验", "boolean", "true"),
    ],
    [
      inputEvent,
      event("change", "值变化", "(value) => void"),
      event("expand-change", "展开节点变化", "(path) => void"),
      event("blur / focus", "焦点变化", "(event) => void"),
      event("visible-change", "浮层显隐变化", "(visible) => void"),
      event("remove-tag", "移除多选标签", "(value) => void"),
    ]
  ),
  field("pro-form-switch", "ProFormSwitch", "布尔值或自定义值之间的即时切换。", [
    api("value", "字段值", "boolean | string | number", "false"),
    api("disabled", "禁用", "boolean", "false"),
    api("activeText", "打开文案", "string", '""'),
    api("inactiveText", "关闭文案", "string", '""'),
    api("activeValue", "打开时的值", "boolean | string | number", "true"),
    api("inactiveValue", "关闭时的值", "boolean | string | number", "false"),
    api("activeColor", "打开颜色", "string", '"#409EFF"'),
    api("inactiveColor", "关闭颜色", "string", '"#C0CCDA"'),
  ]),
  field(
    "pro-form-upload",
    "ProFormUpload",
    "文件选择、拖拽上传与文件列表同步。",
    [
      api("value", "文件值或文件数组", "string | unknown[]", '""'),
      api("action", "上传地址", "string", '""'),
      api("headers", "请求头", "Record<string, string>", "{}"),
      api("multiple", "允许多选", "boolean", "false"),
      api("data", "额外请求参数", "Record<string, unknown>", "{}"),
      api("uploadName", "文件字段名", "string", '"file"'),
      api("withCredentials", "携带 Cookie", "boolean", "false"),
      api("showFileList", "显示文件列表", "boolean", "true"),
      api("drag", "拖拽上传", "boolean", "false"),
      api("accept", "接受的文件类型", "string", '""'),
      api("listType", "列表样式", "string", '"text"'),
      api("autoUpload", "选择后立即上传", "boolean", "true"),
      api("fileList", "初始文件列表", "unknown[]", "[]"),
      api("disabled", "禁用", "boolean", "false"),
      api("limit", "最大文件数", "number"),
      api("tip", "帮助文案", "string", '""'),
      api("beforeUpload / beforeRemove", "上传或删除前钩子", "Function"),
      api("httpRequest", "覆盖默认上传实现", "Function"),
      api("onPreview / onRemove / onSuccess", "对应事件的 prop 回调", "Function"),
      api("onError / onProgress / onChange / onExceed", "对应事件的 prop 回调", "Function"),
    ],
    [
      inputEvent,
      event("preview / remove", "预览或移除文件", "(...args) => void"),
      event("success / error / progress", "上传生命周期", "(...args) => void"),
      event("change / exceed", "文件变化或超限", "(...args) => void"),
    ],
    fieldCode("ProFormUpload", ':auto-upload="false" tip="演示环境不发起网络请求"', "files")
  ),
  field(
    "pro-form-range",
    "ProFormRange",
    "输入框、滑块或选择器三种范围编辑方式。",
    [
      api("value", "起止值", "number[]", "[]"),
      api("mode", "编辑模式", '"input" | "slider" | "select"', '"input"'),
      api("min / max", "数值边界", "number", "0 / 100"),
      api("step", "步长", "number", "1"),
      api("precision", "精度", "number", "0"),
      api("disabled", "禁用", "boolean", "false"),
      api("showValue", "展示当前范围", "boolean", "false"),
      api("showTooltip", "显示滑块提示", "boolean", "true"),
      api("separator", "分隔文案", "string", '"至"'),
      api("startPlaceholder / endPlaceholder", "两端占位文案", "string", '"起始值 / 结束值"'),
      api("options", "select 模式选项", "RangeOption[]", "[]"),
      api("size", "尺寸", "string", '"small"'),
      api("tagType / tagSize", "值标签外观", "string", '"\"\" / \"small\""'),
      api("formatTooltip", "提示格式化", "(value: number) => string"),
    ],
    [inputEvent, event("change", "范围变化", "(value: number[]) => void")]
  ),
  field(
    "pro-form-rate",
    "ProFormRate",
    "评分输入，支持半星、文案和分数显示。",
    [
      api("value", "评分值", "number", "0"),
      api("max", "最大分值", "number", "5"),
      api("disabled", "禁用", "boolean", "false"),
      api("allowHalf", "允许半星", "boolean", "false"),
      api("lowThreshold / highThreshold", "颜色分界", "number", "2 / 4"),
      api("colors", "三个区间颜色", "string | string[]", "Element 默认"),
      api("voidColor / disabledVoidColor", "未选中颜色", "string", "Element 默认"),
      api("iconClasses", "区间图标", "string[]", "星形"),
      api("voidIconClass / disabledVoidIconClass", "未选中图标", "string", "星形"),
      api("showText / showScore", "显示辅助文字或分数", "boolean", "false"),
      api("textColor", "辅助文字颜色", "string", '"#1F2D3D"'),
      api("texts", "每档文案", "string[]", "极差…惊喜"),
      api("scoreTemplate", "分数模板", "string", '"{ value }"'),
    ],
    [inputEvent, event("change", "评分变化", "(value: number) => void")]
  ),
  field(
    "pro-form-slider",
    "ProFormSlider",
    "单值或范围滑块，并正确显示零值。",
    [
      api("value", "当前值", "number | number[]", "0"),
      api("min / max", "数值边界", "number", "0 / 100"),
      api("disabled", "禁用", "boolean", "false"),
      api("step", "步长", "number", "1"),
      api("showInput / showInputControls", "显示数值输入及控制按钮", "boolean", "false / true"),
      api("inputSize", "输入框尺寸", "string", '"small"'),
      api("showStops / showTooltip", "显示间断点或提示", "boolean", "false / true"),
      api("formatTooltip", "提示格式化", "(value: number) => string"),
      api("range", "范围模式", "boolean", "false"),
      api("vertical", "竖向模式", "boolean", "false"),
      api("height", "竖向高度", "string", '""'),
      api("sliderLabel", "无障碍标签", "string", '""'),
      api("debounce", "输入防抖毫秒数", "number", "300"),
      api("tooltipClass", "提示类名", "string", '""'),
      api("showValue", "显示当前值", "boolean", "true"),
    ],
    [inputEvent, event("change", "滑块值变化", "(value) => void")]
  ),
  field("pro-form-dynamic-tags", "ProFormDynamicTags", "可增删、可限制数量的标签输入。", [
    api("value", "标签列表", "string[]", "[]"),
    api("readonly", "只读", "boolean", "false"),
    api("disabled", "禁用", "boolean", "false"),
    api("size", "尺寸", "string", '"medium"'),
    api("addButtonText", "添加按钮文案", "string", '"添加"'),
    api("emptyText", "空状态文案", "string", '"暂无数据"'),
    api("minItems / maxItems", "数量边界", "number", "0 / 10"),
    api("inputProps", "新增标签输入配置", "Record<string, unknown>", "内置默认值"),
  ]),
  field(
    "pro-form-list",
    "ProFormList",
    "可增加、删除、拖拽排序的结构化表单列表。",
    [
      api("value", "列表值", "Record<string, unknown>[]", "[]"),
      api("disabled / readonly", "禁用或只读", "boolean", "false"),
      api("minItems / maxItems", "数量边界", "number", "0 / —"),
      api("addButtonText", "添加按钮文案", "string", '"添加项目"'),
      api("addButtonIcon", "添加按钮图标类", "string", '"el-icon-plus"'),
      api("showRemove", "显示删除操作", "boolean", "true"),
      api("defaultItem", "新增项工厂", "() => Record<string, unknown>", "() => ({})"),
      api("segmentedItemLabel", "标签生成函数", "(item, index) => string"),
    ],
    [inputEvent, event("add / remove / move", "列表结构变化", "(...args) => void")],
    fieldCode("ProFormList", ":default-item=\"() => ({ text: '新项目' })\"", "items")
  ),
  field(
    "pro-form-dependency",
    "ProFormDependency",
    "按字段值条件显示或控制下游表单内容。",
    [
      api("dependencies", "依赖规则", "DependencyRule[]", "必填"),
      api("dependentFields", "默认渲染的字段配置", "DependentField[]", "[]"),
      api("formData", "用于计算条件的整张表单数据", "Record<string, unknown>", "必填"),
      api("showNoDependency", "条件不满足时显示说明", "boolean", "false"),
      api("noDependencyText", "条件不满足文案", "string", '"请先满足依赖条件"'),
      api("logic", "多规则组合逻辑", '"and" | "or"', '"and"'),
    ],
    [
      inputEvent,
      event("dependency-change", "依赖计算结果变化", "({ visible, disabled, required }) => void"),
    ],
    `<ProFormDependency
  name="advanced"
  label="高级配置"
  :form-data="formData"
  :dependencies="[{ field: 'enabled', operator: 'eq', value: true }]"
  show-no-dependency
>
  <template #default><el-alert title="高级配置已启用" type="success" /></template>
</ProFormDependency>`
  ),
  {
    slug: "pro-form-info",
    name: "ProFormInfo",
    title: "ProFormInfo 信息展示",
    category: "表单字段",
    description: "在表单栅格中展示不可编辑的文本信息。",
    since: "1.0.0",
    code: `<ProFormInfo label="创建人" value="Grace Hopper" />`,
    props: [
      api("label", "字段标签", "string", "必填"),
      api("span", "el-col 栅格占位", "number", "24"),
      api("required", "显示必填状态", "boolean", "false"),
      api("tooltip", "帮助说明", "string", '""'),
      api("value", "展示值", "string | number", '""'),
    ],
  },
  {
    slug: "pro-table",
    name: "ProTable",
    title: "ProTable 高级表格",
    category: "数据展示",
    description: "用一份列配置生成搜索、表格、分页、枚举状态和行操作。",
    since: "1.0.0",
    code: `<ProTable :columns="columns" :request="loadUsers" row-key="id">
  <template #toolBar><el-button type="primary">新建</el-button></template>
</ProTable>`,
    props: [
      api("columns", "列与搜索字段配置", "ICommonTableColumn[]", "必填"),
      api("request", "分页请求函数", "(params, sort, filter) => Promise<{ data; total; success }>"),
      api("dataSource", "静态数据、请求、回调和分页总配置", "DataSourceConfig", "{}"),
      api("rowKey", "行唯一键，支持点路径", "string", '"id"'),
      api("scroll", "滚动区域；当前支持 y", "{ y?: string | number }", "{}"),
      api("rowSelection", "启用行选择", "Record<string, unknown> | null", "null"),
    ],
    slots: [
      api("toolBar", "搜索区右侧工具栏", "{ selectedRowKeys, selectedRows }"),
      api("extra-search-buttons", "额外搜索操作", "VNode"),
      api("tableAlert", "选中行后的提示区", "{ selectedRowKeys, selectedRows }"),
      api("[column.slotName]", "自定义单元格", "{ row, column, $index }"),
      api("empty", "空状态", "VNode"),
    ],
    methods: [api("clearSelection", "清空 Element Table 选择", "() => void")],
  },
  {
    slug: "search-form",
    name: "SearchForm",
    title: "SearchForm 查询表单",
    category: "数据录入",
    description: "由字段 Schema 生成查询表单，支持 Vue 2 v-model、校验和异步 loading。",
    since: "1.0.0",
    code: `<SearchForm v-model="query" :fields="fields" :search-handler="search" @reset="reload" />`,
    props: [
      api("fields", "查询字段配置", "SearchField[]", "必填"),
      api("value", "Vue 2 v-model 值", "Record<string, unknown>"),
      api("modelValue", "显式 model-value 兼容绑定", "Record<string, unknown>"),
      api("rules", "字段校验规则", "FormRules", "{}"),
      api("loading", "外部受控加载状态", "boolean"),
      api(
        "searchHandler",
        "未传 loading 时自动管理状态的异步查询",
        "(values) => void | Promise<void>"
      ),
    ],
    events: [
      inputEvent,
      event("update:modelValue", "显式 modelValue 同步", "(value) => void"),
      event("search", "校验和 handler 完成后触发", "(value) => void"),
      event("reset", "重置后触发", "(value) => void"),
    ],
    slots: [api("extra-buttons", "查询按钮旁的自定义操作", "VNode")],
  },
  {
    slug: "custom-tabs",
    name: "CustomTabs",
    title: "CustomTabs 标签页",
    category: "导航",
    description: "支持受控值、零值、方向键/Home/End 导航的无障碍标签页。",
    since: "1.0.0",
    code: `<CustomTabs v-model="active" :tabs="tabs">
  <template #default="{ tab }">{{ tab.label }} 的内容</template>
</CustomTabs>`,
    props: [
      api("tabs", "标签页列表，每项包含 value 与 label", "Tab[]", "必填"),
      api("value", "当前激活值", "string | number"),
      api("defaultActiveTab", "非受控初始值", "string | number"),
      api("ariaLabel", "标签组无障碍名称", "string", '"标签页"'),
    ],
    events: [inputEvent, event("change", "激活页变化", "(value) => void")],
    slots: [
      api("label", "标签标题", "{ tab }"),
      api("default", "标签面板", "{ tab, value, index }"),
    ],
  },
  {
    slug: "segmented",
    name: "Segmented",
    title: "Segmented 分段列表",
    category: "导航",
    description: "适合多段配置的可增加、删除、排序标签面板。",
    since: "1.0.0",
    code: `<Segmented v-model="items" label="规则" :min-items="1" @add="addRule">
  <template #default="{ item, index }">第 {{ index + 1 }} 条：{{ item.name }}</template>
</Segmented>`,
    props: [
      api("value", "分段项列表", "Array<{ id?: string; [key: string]: unknown }>", "[]"),
      api("label", "分段名称", "string", '""'),
      api("itemLabel", "标题生成函数", "(item, index) => string"),
      api("disabled", "禁用交互和拖拽", "boolean", "false"),
      api("minItems / maxItems", "数量边界", "number", "0 / —"),
      api("showAdd / showDelete", "显示增删操作", "boolean", "true"),
      api("addText", "添加按钮文案", "string", '"添加"'),
      api("addIcon", "添加图标类", "string", '"el-icon-plus"'),
      api("defaultActiveIndex", "初始激活索引", "number", "0"),
    ],
    events: [
      inputEvent,
      event("change", "列表变化", "(items) => void"),
      event("add / remove / move", "结构操作", "(...args) => void"),
    ],
    slots: [
      api("label", "分段标题", "{ item, index }"),
      api("default", "面板内容", "{ item, index }"),
      api("empty", "空状态", "VNode"),
    ],
  },
];

export const componentDocs = components;
export const componentBySlug = (slug: string) => components.find(item => item.slug === slug);

export const componentGroups = components.reduce<Record<string, DocEntry[]>>((groups, item) => {
  (groups[item.category] ||= []).push(item);
  return groups;
}, {});
