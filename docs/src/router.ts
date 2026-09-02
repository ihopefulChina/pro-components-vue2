import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import { componentBySlug } from "./content/components";
import { guideBySlug } from "./content/guides";
import { hookBySlug } from "./content/hooks";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  { path: "/", name: "home", component: () => import("./views/HomePage.vue") },
  { path: "/guide/:slug", name: "guide", component: () => import("./views/GuidePage.vue") },
  {
    path: "/components",
    name: "components",
    component: () => import("./views/ComponentsOverview.vue"),
  },
  {
    path: "/components/:slug",
    name: "component",
    component: () => import("./views/ComponentPage.vue"),
  },
  { path: "/hooks", name: "hooks", component: () => import("./views/HooksOverview.vue") },
  { path: "/hooks/:slug", name: "hook", component: () => import("./views/HookPage.vue") },
  { path: "*", redirect: "/" },
];

const router = new VueRouter({
  mode: "hash",
  routes,
  scrollBehavior: to => (to.hash ? { selector: to.hash, offset: { x: 0, y: 72 } } : { x: 0, y: 0 }),
});

router.afterEach(route => {
  const slug = String(route.params.slug || "");
  const title =
    route.name === "component"
      ? componentBySlug(slug)?.title
      : route.name === "hook"
        ? hookBySlug(slug)?.title
        : route.name === "guide"
          ? guideBySlug(slug)?.title
          : route.name === "components"
            ? "组件总览"
            : route.name === "hooks"
              ? "Hooks 与工具"
              : undefined;
  document.title = title ? `${title} - Pro Components Vue2` : "Pro Components Vue2";
});

export default router;
