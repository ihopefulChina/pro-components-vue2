import type { GuideEntry } from "./types";

export const guides: GuideEntry[] = [
  {
    slug: "getting-started",
    title: "快速开始",
    kicker: "Guide",
    summary: "安装依赖、注册插件，并在第一个页面中使用 ProForm 与 ProTable。",
  },
  {
    slug: "architecture",
    title: "工程架构",
    kicker: "Engineering",
    summary: "发布包与文档站分离的轻量 workspace，以及版本、构建和质量边界。",
  },
  {
    slug: "compatibility",
    title: "兼容性",
    kicker: "Runtime",
    summary: "Vue 2.6、Composition API、Element UI 与现代构建工具的明确支持矩阵。",
  },
  {
    slug: "contributing",
    title: "参与贡献",
    kicker: "Community",
    summary: "从最窄验证开始，保持公共 API 可预测，并用回归测试锁住行为。",
  },
];

export const guideBySlug = (slug: string) => guides.find(guide => guide.slug === slug);
