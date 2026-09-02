<template>
  <div class="home-page">
    <SiteHeader
      :menu-open="mobileNav"
      @toggle-menu="mobileNav = !mobileNav"
      @open-search="searchOpen = true"
    />
    <nav v-if="mobileNav" class="home-mobile-nav" aria-label="移动导航">
      <RouterLink to="/guide/getting-started">指南</RouterLink>
      <RouterLink to="/components">组件</RouterLink>
      <RouterLink to="/hooks">Hooks</RouterLink>
    </nav>
    <main>
      <section class="hero blueprint-grid">
        <div class="hero__copy">
          <div class="eyebrow">
            <span />
            Vue 2.6 · TypeScript · Element UI
          </div>
          <h1>
            把后台页面的
            <br />
            <em>重复工作</em>
            变成组件。
          </h1>
          <p>
            面向存量 Vue 2 项目的 ProForm、ProTable
            与业务字段库。明确的类型、可等待的异步状态、可直接复制的完整示例。
          </p>
          <div class="hero__actions">
            <RouterLink class="button button--primary" to="/guide/getting-started">
              开始使用
              <span>→</span>
            </RouterLink>
            <RouterLink class="button button--quiet" to="/components">浏览 25 个组件</RouterLink>
          </div>
          <div class="install-line">
            <code>pnpm add pro-components-vue2</code>
            <button type="button" @click="copyInstall">{{ copied ? "已复制" : "复制" }}</button>
          </div>
        </div>
        <div class="hero__stage" aria-label="ProForm 实时组件预览">
          <div class="stage-ruler stage-ruler--top">
            <span>0</span>
            <span>320</span>
            <span>640</span>
          </div>
          <div class="stage-ruler stage-ruler--left">
            <span>0</span>
            <span>240</span>
            <span>480</span>
          </div>
          <div class="stage-card">
            <div class="stage-card__bar">
              <span />
              <span />
              <span />
              <b>release-form.vue</b>
              <small>LIVE</small>
            </div>
            <ProForm :initial-value="heroForm" :show-footer="false">
              <template #default="{ formData }">
                <ProFormText v-model="formData.name" name="name" label="版本名称" />
                <ProFormSelect
                  v-model="formData.channel"
                  name="channel"
                  label="发布通道"
                  :options="channels"
                />
                <ProFormSlider
                  v-model="formData.traffic"
                  name="traffic"
                  label="灰度流量"
                  :format-tooltip="formatPercent"
                />
              </template>
            </ProForm>
            <div class="stage-card__footer">
              <span>
                <i />
                校验规则已连接
              </span>
              <el-button type="primary" size="small">创建发布</el-button>
            </div>
          </div>
          <div class="stage-note stage-note--api">typed API</div>
          <div class="stage-note stage-note--async">await submit</div>
        </div>
      </section>

      <section class="signal-strip" aria-label="项目能力">
        <div>
          <strong>25</strong>
          <span>公开组件</span>
        </div>
        <div>
          <strong>9</strong>
          <span>组合式 Hooks</span>
        </div>
        <div>
          <strong>100%</strong>
          <span>TypeScript 声明</span>
        </div>
        <div>
          <strong>0</strong>
          <span>已知发布阻断</span>
        </div>
      </section>

      <section class="home-section architecture-section">
        <div class="section-heading">
          <span>01 / ARCHITECTURE</span>
          <h2>升级工程，不重写成熟组件。</h2>
          <p>
            根包继续保持单一 npm 入口；独立文档 workspace
            负责官网、演示和视觉回归。两者共享同一源码和质量门禁。
          </p>
        </div>
        <div class="architecture-map">
          <div class="map-node map-node--root">
            <LogoMark />
            <span>
              <b>pro-components-vue2</b>
              <small>publishable root package</small>
            </span>
          </div>
          <div class="map-line"><span>pnpm workspace</span></div>
          <div class="map-branches">
            <div class="map-node">
              <span class="map-icon">&lt;/&gt;</span>
              <span>
                <b>src/</b>
                <small>components · hooks · types</small>
              </span>
            </div>
            <div class="map-node">
              <span class="map-icon">◫</span>
              <span>
                <b>docs/</b>
                <small>Vite site · live demos · API</small>
              </span>
            </div>
            <div class="map-node">
              <span class="map-icon">✓</span>
              <span>
                <b>CI</b>
                <small>lint · type · test · build</small>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section class="home-section components-section">
        <div class="section-heading">
          <span>02 / COMPONENTS</span>
          <h2>从一个字段，到完整数据工作台。</h2>
          <p>
            组件按照任务而不是技术细节分组。每个页面都有可操作示例、源码片段、Props、Events、Slots
            与 Methods。
          </p>
        </div>
        <div class="component-family-grid">
          <RouterLink
            v-for="family in families"
            :key="family.name"
            :to="family.to"
            class="family-card"
          >
            <span class="family-card__index">{{ family.index }}</span>
            <div>
              <h3>{{ family.name }}</h3>
              <p>{{ family.description }}</p>
            </div>
            <strong>{{ family.count }}</strong>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
          </RouterLink>
        </div>
      </section>

      <section class="home-section quality-section">
        <div class="quality-board blueprint-grid">
          <div>
            <span>03 / RELEASE CONFIDENCE</span>
            <h2>
              发布不是一个按钮，
              <br />
              是一组可复现的证据。
            </h2>
            <p>
              异步竞态、重复提交、受控值切换、键盘导航等高风险路径已经有回归覆盖。静态检查、类型、测试、库构建和文档构建在同一流水线执行。
            </p>
            <RouterLink to="/guide/architecture">查看质量与发布架构 →</RouterLink>
          </div>
          <ol>
            <li>
              <i>01</i>
              <span>
                <b>Contract</b>
                <small>公开导出与类型声明</small>
              </span>
              <em>PASS</em>
            </li>
            <li>
              <i>02</i>
              <span>
                <b>Behavior</b>
                <small>Vitest 组件与 Hook 回归</small>
              </span>
              <em>PASS</em>
            </li>
            <li>
              <i>03</i>
              <span>
                <b>Artifacts</b>
                <small>ESM · UMD · CSS · DTS</small>
              </span>
              <em>PASS</em>
            </li>
            <li>
              <i>04</i>
              <span>
                <b>Documentation</b>
                <small>25 个真实组件示例</small>
              </span>
              <em>LIVE</em>
            </li>
          </ol>
        </div>
      </section>
    </main>
    <footer class="site-footer">
      <div>
        <LogoMark />
        <span>
          <b>Pro Components Vue2</b>
          <small>MIT License · built for dependable Vue 2 delivery</small>
        </span>
      </div>
      <p>Generated concept refined into a transparent, code-native mark.</p>
    </footer>
    <SearchDialog :open="searchOpen" @close="searchOpen = false" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import { ProForm, ProFormSelect, ProFormSlider, ProFormText } from "pro-components-vue2";
import LogoMark from "@docs/components/LogoMark.vue";
import SearchDialog from "@docs/components/SearchDialog.vue";
import SiteHeader from "@docs/components/SiteHeader.vue";

export default defineComponent({
  name: "HomePage",
  components: {
    LogoMark,
    ProForm,
    ProFormSelect,
    ProFormSlider,
    ProFormText,
    SearchDialog,
    SiteHeader,
  },
  setup() {
    const copied = ref(false);
    const mobileNav = ref(false);
    const searchOpen = ref(false);
    const heroForm = { name: "v1.0.0", channel: "uat", traffic: 30 };
    const channels = [
      { label: "UAT 灰度", value: "uat" },
      { label: "正式发布", value: "prod" },
    ];
    const formatPercent = (value: number) => `${value}%`;
    const copyInstall = async () => {
      await navigator.clipboard.writeText("pnpm add pro-components-vue2");
      copied.value = true;
      window.setTimeout(() => {
        copied.value = false;
      }, 1200);
    };
    const families = [
      {
        index: "A",
        name: "表单容器",
        description: "验证、异步提交、弹窗与抽屉工作流。",
        count: 4,
        to: "/components/pro-form",
      },
      {
        index: "B",
        name: "表单字段",
        description: "覆盖文本、选择、日期、上传和动态结构。",
        count: 17,
        to: "/components/pro-form-text",
      },
      {
        index: "C",
        name: "数据工作台",
        description: "Schema 查询、表格、分页与行操作。",
        count: 2,
        to: "/components/pro-table",
      },
      {
        index: "D",
        name: "导航与结构",
        description: "键盘可达的标签与可排序分段面板。",
        count: 2,
        to: "/components/custom-tabs",
      },
    ];
    return {
      channels,
      copied,
      copyInstall,
      families,
      formatPercent,
      heroForm,
      mobileNav,
      searchOpen,
    };
  },
});
</script>
