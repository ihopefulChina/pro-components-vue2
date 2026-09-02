<template>
  <SiteShell v-if="guide">
    <article class="doc-article guide-article">
      <header class="component-header">
        <div>
          <span>{{ guide.kicker }}</span>
          <h1>{{ guide.title }}</h1>
          <p>{{ guide.summary }}</p>
        </div>
      </header>
      <template v-if="guide.slug === 'getting-started'">
        <section class="doc-section">
          <div class="section-title">
            <span>01</span>
            <div>
              <h2>安装</h2>
              <p>Vue、Composition API 与 Element UI 是 peer dependencies。</p>
            </div>
          </div>
          <pre
            class="standalone-code"
          ><code>pnpm add pro-components-vue2 vue@2.6.14 @vue/composition-api element-ui</code></pre>
        </section>
        <section class="doc-section">
          <div class="section-title">
            <span>02</span>
            <div>
              <h2>注册</h2>
              <p>Composition API 必须先于组件库注册。</p>
            </div>
          </div>
          <pre class="standalone-code"><code>{{ installCode }}</code></pre>
        </section>
        <section class="doc-section">
          <div class="section-title">
            <span>03</span>
            <div>
              <h2>第一个页面</h2>
              <p>也可以使用命名导出进行按需引入。</p>
            </div>
          </div>
          <pre class="standalone-code"><code>{{ usageCode }}</code></pre>
          <RouterLink class="inline-next" to="/components/pro-form">继续阅读 ProForm →</RouterLink>
        </section>
      </template>
      <template v-else-if="guide.slug === 'architecture'">
        <section class="doc-section">
          <div class="section-title">
            <span>01</span>
            <div>
              <h2>为什么不是全量重写</h2>
              <p>成熟组件已有用户价值，迁移目录只会扩大回归面。</p>
            </div>
          </div>
          <div class="decision-grid">
            <div>
              <b>根包</b>
              <p>保持 npm 包名、入口和源码路径稳定。</p>
            </div>
            <div>
              <b>docs workspace</b>
              <p>独立依赖、构建与发布，不进入 npm tarball。</p>
            </div>
            <div>
              <b>共享门禁</b>
              <p>库和文档由同一 CI 验证，避免示例漂移。</p>
            </div>
          </div>
        </section>
        <section class="doc-section">
          <div class="section-title">
            <span>02</span>
            <div>
              <h2>发布门禁</h2>
              <p>本地和 CI 使用相同顺序。</p>
            </div>
          </div>
          <pre class="standalone-code"><code>pnpm lint:check
pnpm format:check
pnpm type-check
pnpm test
pnpm build:docs
npm pack --dry-run</code></pre>
        </section>
      </template>
      <template v-else-if="guide.slug === 'compatibility'">
        <section class="doc-section">
          <div class="section-title">
            <span>01</span>
            <div>
              <h2>支持矩阵</h2>
              <p>1.0.0 的边界是明确的，不依赖运行时猜测。</p>
            </div>
          </div>
          <table class="compat-table">
            <tbody>
              <tr>
                <th>Vue</th>
                <td>2.6.14（不含 2.7）</td>
              </tr>
              <tr>
                <th>@vue/composition-api</th>
                <td>1.7+</td>
              </tr>
              <tr>
                <th>Element UI</th>
                <td>2.15+</td>
              </tr>
              <tr>
                <th>Node.js</th>
                <td>18+</td>
              </tr>
              <tr>
                <th>模块</th>
                <td>ESM + UMD + CSS + DTS</td>
              </tr>
            </tbody>
          </table>
        </section>
      </template>
      <template v-else>
        <section class="doc-section">
          <div class="section-title">
            <span>01</span>
            <div>
              <h2>提交原则</h2>
              <p>最小完整改动，先复用同类实现。</p>
            </div>
          </div>
          <ol class="principle-list">
            <li>为缺陷写一个能失败的最窄回归。</li>
            <li>保持公开属性、事件和插槽向后兼容。</li>
            <li>依次运行格式、类型、测试与构建。</li>
            <li>在变更日志中解释用户可感知的行为。</li>
          </ol>
        </section>
      </template>
    </article>
  </SiteShell>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import SiteShell from "@docs/components/SiteShell.vue";
import { guideBySlug } from "@docs/content/guides";

export default defineComponent({
  name: "GuidePage",
  components: { SiteShell },
  setup(_, { root }) {
    const guide = computed(() => guideBySlug(String(root.$route.params.slug)));
    const installCode = `import Vue from "vue";
import VueCompositionAPI from "@vue/composition-api";
import ElementUI from "element-ui";
import ProComponentsVue2 from "pro-components-vue2";
import "element-ui/lib/theme-chalk/index.css";
import "pro-components-vue2/style.css";

Vue.use(VueCompositionAPI);
Vue.use(ElementUI);
Vue.use(ProComponentsVue2);`;
    const usageCode = `<ProForm :initial-value="record" :submitter="save">
  <template #default="{ formData }">
    <ProFormText v-model="formData.name" name="name" label="名称" />
  </template>
</ProForm>`;
    return { guide, installCode, usageCode };
  },
});
</script>
