<template>
  <div :key="name" class="component-demo">
    <ProForm
      v-if="name === 'ProForm'"
      :initial-value="profile"
      :rules="profileRules"
      :submitter="saveDemo"
    >
      <template #default="{ formData }">
        <ProFormText
          v-model="formData.name"
          name="name"
          label="项目名称"
          required
          placeholder="请输入项目名称"
        />
        <ProFormSelect
          v-model="formData.status"
          name="status"
          label="状态"
          :options="statusOptions"
        />
      </template>
    </ProForm>

    <el-form v-else-if="name === 'ProFormItem'" :model="standaloneForm" label-position="top">
      <ProFormItem name="email" label="通知邮箱" tooltip="状态变化会发送到这个地址">
        <el-input v-model="standaloneForm.email" placeholder="name@example.com" />
      </ProFormItem>
    </el-form>

    <template v-else-if="name === 'ModalForm'">
      <el-button type="primary" @click="modalOpen = true">打开弹窗表单</el-button>
      <ModalForm
        :open="modalOpen"
        title="编辑成员"
        :initial-value="profile"
        :submitter="saveDemo"
        @close="modalOpen = false"
        @submit="modalOpen = false"
      >
        <template #default="{ formData }">
          <ProFormText v-model="formData.name" name="name" label="姓名" />
        </template>
      </ModalForm>
    </template>

    <template v-else-if="name === 'DrawerForm'">
      <el-button type="primary" @click="drawerOpen = true">打开抽屉表单</el-button>
      <DrawerForm
        :open="drawerOpen"
        title="项目详情"
        :initial-value="profile"
        :submitter="saveDemo"
        @close="drawerOpen = false"
        @submit="drawerOpen = false"
      >
        <template #default="{ formData }">
          <ProFormTextarea v-model="formData.description" name="description" label="项目说明" />
        </template>
      </DrawerForm>
    </template>

    <ProForm v-else-if="name === 'ProFormText'" :initial-value="fieldInitials" :show-footer="false">
      <template #default="{ formData }">
        <ProFormText
          v-model="formData.text"
          name="text"
          label="项目名称"
          placeholder="请输入项目名称"
        />
      </template>
    </ProForm>
    <ProForm
      v-else-if="name === 'ProFormTextarea'"
      :initial-value="fieldInitials"
      :show-footer="false"
    >
      <template #default="{ formData }">
        <ProFormTextarea
          v-model="formData.textarea"
          name="textarea"
          label="项目说明"
          :rows="4"
          :maxlength="120"
          show-word-limit
        />
      </template>
    </ProForm>
    <ProForm
      v-else-if="name === 'ProFormNumber'"
      :initial-value="fieldInitials"
      :show-footer="false"
    >
      <template #default="{ formData }">
        <ProFormNumber v-model="formData.number" name="number" label="并发数" :min="0" :max="100" />
      </template>
    </ProForm>
    <ProForm
      v-else-if="name === 'ProFormSelect'"
      :initial-value="fieldInitials"
      :show-footer="false"
    >
      <template #default="{ formData }">
        <ProFormSelect
          v-model="formData.select"
          name="select"
          label="运行状态"
          :options="statusOptions"
          clearable
        />
      </template>
    </ProForm>
    <ProForm
      v-else-if="name === 'ProFormRadio'"
      :initial-value="fieldInitials"
      :show-footer="false"
    >
      <template #default="{ formData }">
        <ProFormRadio
          v-model="formData.radio"
          name="radio"
          label="部署策略"
          :options="strategyOptions"
          border
        />
      </template>
    </ProForm>
    <ProForm
      v-else-if="name === 'ProFormCheckbox'"
      :initial-value="fieldInitials"
      :show-footer="false"
    >
      <template #default="{ formData }">
        <ProFormCheckbox
          v-model="formData.checkbox"
          name="checkbox"
          label="通知渠道"
          :options="channelOptions"
          :max="2"
        />
      </template>
    </ProForm>
    <ProForm v-else-if="name === 'ProFormDate'" :initial-value="fieldInitials" :show-footer="false">
      <template #default="{ formData }">
        <ProFormDate
          v-model="formData.date"
          name="date"
          label="发布日期"
          value-format="yyyy-MM-dd"
        />
      </template>
    </ProForm>
    <ProForm
      v-else-if="name === 'ProFormCascader'"
      :initial-value="fieldInitials"
      :show-footer="false"
    >
      <template #default="{ formData }">
        <ProFormCascader
          v-model="formData.cascader"
          name="cascader"
          label="部署区域"
          :options="regionOptions"
        />
      </template>
    </ProForm>
    <ProForm
      v-else-if="name === 'ProFormSwitch'"
      :initial-value="fieldInitials"
      :show-footer="false"
    >
      <template #default="{ formData }">
        <ProFormSwitch
          v-model="formData.switchValue"
          name="switchValue"
          label="自动发布"
          active-text="开启"
          inactive-text="关闭"
        />
      </template>
    </ProForm>
    <ProForm
      v-else-if="name === 'ProFormUpload'"
      :initial-value="fieldInitials"
      :show-footer="false"
    >
      <template #default="{ formData }">
        <ProFormUpload
          v-model="formData.files"
          name="files"
          label="发布附件"
          :auto-upload="false"
          tip="演示环境只维护文件列表，不会发起网络请求"
        />
      </template>
    </ProForm>
    <ProForm
      v-else-if="name === 'ProFormRange'"
      :initial-value="fieldInitials"
      :show-footer="false"
    >
      <template #default="{ formData }">
        <ProFormRange
          v-model="formData.range"
          name="range"
          label="灰度比例"
          mode="slider"
          show-value
        />
      </template>
    </ProForm>
    <ProForm v-else-if="name === 'ProFormRate'" :initial-value="fieldInitials" :show-footer="false">
      <template #default="{ formData }">
        <ProFormRate v-model="formData.rate" name="rate" label="交付质量" show-text />
      </template>
    </ProForm>
    <ProForm
      v-else-if="name === 'ProFormSlider'"
      :initial-value="fieldInitials"
      :show-footer="false"
    >
      <template #default="{ formData }">
        <ProFormSlider
          v-model="formData.slider"
          name="slider"
          label="流量比例"
          :format-tooltip="formatPercent"
        />
      </template>
    </ProForm>
    <ProForm
      v-else-if="name === 'ProFormDynamicTags'"
      :initial-value="fieldInitials"
      :show-footer="false"
    >
      <template #default="{ formData }">
        <ProFormDynamicTags v-model="formData.tags" name="tags" label="环境标签" :max-items="5" />
      </template>
    </ProForm>
    <ProForm v-else-if="name === 'ProFormList'" :initial-value="fieldInitials" :show-footer="false">
      <template #default="{ formData }">
        <ProFormList
          v-model="formData.items"
          name="items"
          label="发布阶段"
          :min-items="1"
          :max-items="4"
          :default-item="createListItem"
        />
      </template>
    </ProForm>
    <ProForm
      v-else-if="name === 'ProFormDependency'"
      :initial-value="fieldInitials"
      :show-footer="false"
    >
      <template #default="{ formData }">
        <ProFormSwitch v-model="formData.switchValue" name="switchValue" label="启用高级配置" />
        <ProFormDependency
          name="advanced"
          label="高级配置"
          :form-data="formData"
          :dependencies="dependencyRules"
          show-no-dependency
        >
          <template #default>
            <el-alert title="依赖条件已满足，可以编辑高级配置。" type="success" :closable="false" />
          </template>
        </ProFormDependency>
      </template>
    </ProForm>
    <ProForm v-else-if="name === 'ProFormInfo'" :initial-value="fieldInitials" :show-footer="false">
      <template>
        <ProFormInfo label="创建人" value="Grace Hopper" tooltip="该字段为只读信息" />
      </template>
    </ProForm>

    <ProTable
      v-else-if="name === 'ProTable'"
      :columns="tableColumns"
      :data-source="tableDataSource"
      row-key="id"
    >
      <template #toolBar><el-button type="primary" size="small">新建项目</el-button></template>
    </ProTable>

    <SearchForm
      v-else-if="name === 'SearchForm'"
      v-model="query"
      :fields="searchFields"
      :search-handler="runSearch"
      @reset="showResetMessage"
    >
      <template #extra-buttons><el-button type="text">保存条件</el-button></template>
    </SearchForm>

    <CustomTabs
      v-else-if="name === 'CustomTabs'"
      v-model="activeTab"
      :tabs="tabs"
      aria-label="发布环境"
    >
      <template #default="{ tab }">
        <div class="demo-pane">
          <strong>{{ tab.label }}</strong>
          <p>{{ tab.description }}</p>
        </div>
      </template>
    </CustomTabs>

    <Segmented
      v-else-if="name === 'Segmented'"
      v-model="segments"
      label="规则"
      :min-items="1"
      :max-items="4"
      @add="addSegment"
    >
      <template #label="{ item, index }">规则 {{ index + 1 }}</template>
      <template #default="{ item, index }">
        <div class="demo-pane">
          <strong>规则 {{ index + 1 }}</strong>
          <p>{{ item.name }}</p>
        </div>
      </template>
    </Segmented>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "@vue/composition-api";
import {
  CustomTabs,
  DrawerForm,
  ModalForm,
  ProForm,
  ProFormCascader,
  ProFormCheckbox,
  ProFormDate,
  ProFormDependency,
  ProFormDynamicTags,
  ProFormInfo,
  ProFormItem,
  ProFormList,
  ProFormNumber,
  ProFormRadio,
  ProFormRange,
  ProFormRate,
  ProFormSelect,
  ProFormSlider,
  ProFormSwitch,
  ProFormText,
  ProFormTextarea,
  ProFormUpload,
  ProTable,
  SearchForm,
  Segmented,
  useMessage,
} from "pro-components-vue2";

interface SegmentItem {
  id: string;
  name: string;
}

export default defineComponent({
  name: "ComponentDemo",
  components: {
    CustomTabs,
    DrawerForm,
    ModalForm,
    ProForm,
    ProFormCascader,
    ProFormCheckbox,
    ProFormDate,
    ProFormDependency,
    ProFormDynamicTags,
    ProFormInfo,
    ProFormItem,
    ProFormList,
    ProFormNumber,
    ProFormRadio,
    ProFormRange,
    ProFormRate,
    ProFormSelect,
    ProFormSlider,
    ProFormSwitch,
    ProFormText,
    ProFormTextarea,
    ProFormUpload,
    ProTable,
    SearchForm,
    Segmented,
  },
  props: { name: { type: String as PropType<string>, required: true } },
  setup() {
    const message = useMessage();
    const modalOpen = ref(false);
    const drawerOpen = ref(false);
    const activeTab = ref("uat");
    const query = ref<Record<string, unknown>>({});
    const standaloneForm = ref({ email: "maintainer@example.com" });
    const profile = {
      name: "Pro Components Vue2",
      status: 1,
      description: "可预测的 Vue 2 业务组件。",
    };
    const profileRules = { name: [{ required: true, message: "请输入项目名称", trigger: "blur" }] };
    const fieldInitials = {
      text: "组件库 1.0",
      textarea: "让重复的后台页面开发更稳定。",
      number: 8,
      select: 1,
      radio: "rolling",
      checkbox: ["email"],
      date: "2026-09-02",
      cascader: ["cn", "shanghai"],
      switchValue: true,
      files: [],
      range: [20, 70],
      rate: 4,
      slider: 40,
      tags: ["Vue 2.6", "TypeScript"],
      items: [
        { id: "design", text: "设计评审" },
        { id: "release", text: "发布验证" },
      ],
    };
    const statusOptions = [
      { label: "运行中", value: 1 },
      { label: "已暂停", value: 0 },
    ];
    const strategyOptions = [
      { label: "滚动发布", value: "rolling" },
      { label: "蓝绿发布", value: "blue-green" },
    ];
    const channelOptions = [
      { label: "邮件", value: "email" },
      { label: "飞书", value: "feishu" },
      { label: "Webhook", value: "webhook" },
    ];
    const regionOptions = [
      {
        value: "cn",
        label: "中国",
        children: [
          { value: "shanghai", label: "上海" },
          { value: "shenzhen", label: "深圳" },
        ],
      },
    ];
    const dependencyRules = [{ field: "switchValue", operator: "eq", value: true }];
    const tabs = [
      { value: "dev", label: "开发", description: "快速反馈与本地联调。" },
      { value: "uat", label: "UAT", description: "上线前的业务验收环境。" },
      { value: "prod", label: "生产", description: "受变更窗口保护的正式环境。" },
    ];
    const segments = ref<SegmentItem[]>([
      { id: "rule-1", name: "错误率低于 1% 时继续发布" },
      { id: "rule-2", name: "5 分钟后扩大流量" },
    ]);
    const tableColumns = [
      { prop: "name", label: "项目", searchPlaceholder: "搜索项目" },
      { prop: "owner", label: "负责人", hideInSearch: true },
      {
        prop: "status",
        label: "状态",
        valueType: "select",
        valueEnum: {
          1: { label: "运行中", value: 1, status: "success" },
          0: { label: "已暂停", value: 0, status: "warning" },
        },
      },
      {
        prop: "action",
        label: "操作",
        type: "actions",
        hideInSearch: true,
        buttons: [
          {
            text: "查看",
            type: "text",
            onClick: (row: { name: string }) => message.info(`查看 ${row.name}`),
          },
        ],
      },
    ];
    const tableDataSource = {
      dataSource: [
        { id: 1, name: "会员中心", owner: "Ada", status: 1 },
        { id: 2, name: "订单工作台", owner: "Linus", status: 0 },
      ],
      pagination: { pageSize: 10 },
    };
    const searchFields = [
      { prop: "keyword", label: "关键词", type: "input", placeholder: "名称或负责人" },
      { prop: "status", label: "状态", type: "select", options: statusOptions },
      { prop: "date", label: "发布日期", type: "date", valueFormat: "yyyy-MM-dd" },
    ];
    const wait = (duration: number) =>
      new Promise<void>(resolve => window.setTimeout(resolve, duration));
    const saveDemo = async () => {
      await wait(500);
      message.success("示例已保存");
    };
    const runSearch = async () => {
      await wait(500);
      message.success("查询完成");
    };
    const showResetMessage = () => message.info("查询条件已重置");
    const createListItem = () => ({ text: "新发布阶段" });
    const formatPercent = (value: number) => `${value}%`;
    const addSegment = () => {
      segments.value = [...segments.value, { id: `rule-${Date.now()}`, name: "新规则，等待配置" }];
    };
    return {
      activeTab,
      addSegment,
      channelOptions,
      createListItem,
      dependencyRules,
      drawerOpen,
      fieldInitials,
      formatPercent,
      modalOpen,
      profile,
      profileRules,
      query,
      regionOptions,
      runSearch,
      saveDemo,
      searchFields,
      segments,
      showResetMessage,
      standaloneForm,
      statusOptions,
      strategyOptions,
      tableColumns,
      tableDataSource,
      tabs,
    };
  },
});
</script>

<style lang="scss" scoped>
.component-demo {
  min-height: 64px;
}
.component-demo ::v-deep .el-form-item {
  margin-bottom: 18px;
}
.demo-pane {
  min-height: 72px;
  padding: 18px;
}
.demo-pane p {
  color: var(--muted);
  margin: 8px 0 0;
}
</style>
