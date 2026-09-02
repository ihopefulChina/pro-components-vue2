import { componentDocs } from "../../docs/src/content/components";
import ComponentDemo from "../../docs/src/components/ComponentDemo.vue";
import { guides } from "../../docs/src/content/guides";
import { hookDocs } from "../../docs/src/content/hooks";
import router, { getLegacyRoutePath } from "../../docs/src/router";
import { mount } from "@vue/test-utils";

describe("documentation inventory", () => {
  it("documents every public component exactly once", () => {
    expect(componentDocs).toHaveLength(25);
    expect(new Set(componentDocs.map(item => item.name)).size).toBe(25);
    expect(new Set(componentDocs.map(item => item.slug)).size).toBe(25);

    componentDocs.forEach(item => {
      expect(item.description).toBeTruthy();
      expect(item.code).toBeTruthy();
      expect(item.props?.length).toBeGreaterThan(0);
    });
  });

  it("keeps hooks and guides searchable", () => {
    expect(hookDocs).toHaveLength(10);
    expect(guides).toHaveLength(4);
    expect(new Set([...hookDocs, ...guides].map(item => item.slug)).size).toBe(14);
  });

  it("replaces the live example when navigating between form field pages", async () => {
    const wrapper = mount(ComponentDemo, {
      propsData: { name: "ProFormDependency" },
    });

    expect(wrapper.text()).toContain("高级配置");

    await wrapper.setProps({ name: "ProFormText" });

    expect(wrapper.text()).toContain("项目名称");
    expect(wrapper.text()).not.toContain("高级配置");
  });

  it("uses clean URLs, keeps section anchors, and recognizes legacy hash routes", () => {
    expect(router.mode).toBe("history");
    expect(router.resolve({ path: "/components/pro-form", hash: "#api" }).href).toBe(
      "/components/pro-form#api"
    );
    expect(getLegacyRoutePath("#/components/pro-form#api")).toBe("/components/pro-form#api");
    expect(getLegacyRoutePath("#api")).toBeUndefined();
  });
});
