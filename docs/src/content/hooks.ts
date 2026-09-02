import type { ApiRow, DocEntry } from "./types";

const api = (name: string, description: string, type: string, defaultValue = "—"): ApiRow => ({
  name,
  description,
  type,
  defaultValue,
});

export const hookDocs: DocEntry[] = [
  {
    slug: "use-message",
    name: "useMessage",
    title: "useMessage 消息反馈",
    category: "反馈",
    description: "在 setup 中以可测试、类型化的方式调用 Element UI Message。",
    code: `const message = useMessage();
message.success("保存成功", { duration: 1600 });
message.closeAll();`,
    methods: [
      api("success / error / warning / info", "显示对应状态消息", "(message, config?) => void"),
      api("closeAll", "关闭所有消息", "() => void"),
    ],
  },
  {
    slug: "use-dialog",
    name: "useDialog",
    title: "useDialog 确认对话框",
    category: "反馈",
    description: "将确认、取消和异步 onOk 整理为明确的 Promise<boolean>。",
    code: `const dialog = useDialog();
const confirmed = await dialog.warning({
  title: "删除成员",
  content: "该操作不可撤销",
  onOk: removeMember,
});`,
    props: [
      api("title / content", "标题和内容", "string"),
      api("okText / cancelText", "按钮文案", "string"),
      api("type", "状态类型", '"success" | "warning" | "info" | "error"', '"warning"'),
      api("onOk / onCancel", "确认或取消回调", "Function"),
      api("showCancelButton / showConfirmButton", "按钮显隐", "boolean", "true"),
      api("closeOnClickModal / closeOnPressEscape", "关闭策略", "boolean", "true"),
      api("customClass", "自定义类名", "string"),
      api("dangerouslyUseHTMLString", "将内容解释为 HTML", "boolean", "false"),
    ],
    methods: [
      api(
        "confirm / warning / info / success / error",
        "打开对应类型对话框",
        "(config) => Promise<boolean>"
      ),
    ],
  },
  {
    slug: "use-drawer-form",
    name: "useDrawerForm",
    title: "useDrawerForm 抽屉状态",
    category: "表单",
    description: "集中管理 DrawerForm 的新增、编辑、详情和复制状态。",
    code: `const { drawerFormProps, onAdd, onEdit, onDetail, onCopy } = useDrawerForm<User>({
  drawerTitle: "用户",
  rowKey: "id",
});`,
    props: [
      api("drawerTitle", "标题中的业务名", "string", '""'),
      api("rowKey", "复制时移除的主键", "string", '"id"'),
    ],
    methods: [
      api("onAdd", "打开新增", "() => void"),
      api("onEdit / onDetail / onCopy", "以记录打开对应模式", "(record?: T) => void"),
      api("drawerFormProps", "可直接 v-bind 给 DrawerForm", "DrawerFormProps<T>"),
    ],
  },
  {
    slug: "use-pro-table-request",
    name: "useProTableRequest",
    title: "useProTableRequest 请求适配",
    category: "数据",
    description: "把 pageNow 接口适配为 ProTable request，并保证最后一次请求获胜。",
    code: `const table = useProTableRequest(fetchUsers, {
  paramsFormat: params => ({ ...params, tenantId }),
  dataFormat: list => list.map(normalizeUser),
});

const request = table.request;`,
    props: [
      api(
        "api",
        "接收分页参数并返回 list/total 的接口",
        "(params) => Promise<{ list?: T[]; total?: number }>",
        "必填"
      ),
      api("paramsFormat", "请求参数转换", "(params) => params"),
      api("dataFormat", "列表转换", "(data: T[]) => T[]"),
    ],
    methods: [
      api("request", "ProTable 请求函数", "(params, sort?, filter?) => Promise<Result<T>>"),
      api("onRefresh", "按当前条件刷新", "(resetPage?: boolean) => Promise<Result<T>>"),
      api("onReset", "重置条件并回到第一页", "() => Promise<Result<T>>"),
      api(
        "handleSizeChange / handleCurrentChange",
        "分页操作",
        "(value: number) => Promise<Result<T>>"
      ),
      api("loading / data / pagination / requestParams", "响应式请求状态", "Ref / Reactive"),
    ],
  },
  {
    slug: "use-mutate",
    name: "useMutate",
    title: "useMutate 详情请求",
    category: "数据",
    description: "管理详情加载、空状态、错误与重复调用锁。",
    code: `const { mutate, detail, loading, noData, error } = useMutate({
  getData: params => api.getDetail(params),
  params: { id },
  initRequest: true,
});`,
    props: [
      api("defaultData", "默认数据", "T"),
      api("params", "请求参数", "Record<string, unknown>", "{}"),
      api("initRequest", "mounted 后自动请求", "boolean", "true"),
      api("getData", "数据请求", "(params) => Promise<{ data?: T }>", "必填"),
      api("dataFormat", "响应转换", "(data?: T) => unknown"),
      api("successCallback", "成功回调", "(data?: T) => void"),
    ],
    methods: [
      api("mutate", "发起请求", "() => Promise<void>"),
      api("detail / loading / noData / error", "响应式状态", "Ref"),
    ],
  },
  {
    slug: "use-state",
    name: "useState",
    title: "useState 受控状态",
    category: "状态",
    description: "为 Vue 2 组件提供受控/非受控一致的状态模型。",
    code: `const [value, setValue] = useState(0, props.value, next => emit("input", next));
setValue(previous => previous + 1);`,
    props: [
      api("defaultValue", "非受控初始值", "T"),
      api("value", "可选受控 Ref", "Ref<T | undefined>"),
      api("onChange", "值真正变化时回调", "(value, ...args) => void"),
    ],
    methods: [api("setValue", "设置值或使用函数更新", "(value | updater, ...args) => void")],
  },
  {
    slug: "use-super-lock",
    name: "useSuperLock",
    title: "useSuperLock 异步锁",
    category: "状态",
    description: "阻止异步函数并发和短时间重复执行，同时保留 this。",
    code: `const [submit, locked] = useSuperLock(saveOrder, 500);
await submit(order);`,
    props: [
      api("fun", "需要锁定的函数", "(...args) => unknown", "必填"),
      api("delay", "成功后的冷却时间", "number", "500"),
    ],
    methods: [api("fn", "锁定后的函数", "T"), api("lock", "当前锁定状态", "Ref<boolean>")],
  },
  {
    slug: "use-validate-form",
    name: "useValidateForm",
    title: "useValidateForm 字段校验",
    category: "表单",
    description: "字段组件通过 ProForm provide 主动触发单字段校验。",
    code: `const { validateField, formRef } = useValidateForm("email");
validateField();`,
    props: [api("name", "默认字段名", "string")],
    methods: [
      api("validateField", "在 nextTick 校验一个或多个字段", "(key?: string | string[]) => void"),
      api("formRef / proFormRef", "注入的表单引用", "ComputedRef / ProFormProvide"),
    ],
  },
  {
    slug: "use-global-this",
    name: "useGlobalThis",
    title: "useGlobalThis 组件实例",
    category: "基础",
    description: "在 setup 内取得 Vue 2 组件代理；脱离 setup 调用会抛出描述性错误。",
    code: `const proxy = useGlobalThis();
proxy.$emit("ready");`,
    methods: [api("useGlobalThis", "返回当前 Vue 实例代理", "() => Vue")],
  },
  {
    slug: "guid",
    name: "guid",
    title: "guid 唯一标识",
    category: "工具",
    description: "生成适合前端局部标识的随机字符串。",
    code: `const id = guid();
const compactId = guid(true);`,
    props: [api("short", "省略分隔符", "boolean", "false")],
    methods: [api("guid", "生成标识", "(short?: boolean) => string")],
  },
];

export const hookBySlug = (slug: string) => hookDocs.find(item => item.slug === slug);

export const hookGroups = hookDocs.reduce<Record<string, DocEntry[]>>((groups, item) => {
  (groups[item.category] ||= []).push(item);
  return groups;
}, {});
