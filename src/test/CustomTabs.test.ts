import CustomTabs from "@/components/customTabs/index.vue";
import { mount } from "@vue/test-utils";

describe("CustomTabs", () => {
  it("supports arrow-key navigation with the tab accessibility roles", async () => {
    const wrapper = mount(CustomTabs, {
      propsData: {
        value: 0,
        tabs: [
          { label: "第一项", value: 0 },
          { label: "第二项", value: 1 },
        ],
      },
    });

    const tabs = wrapper.findAll("[role='tab']");
    expect(tabs.at(0).attributes("aria-selected")).toBe("true");

    await tabs.at(0).trigger("keydown", { key: "ArrowRight" });

    expect(wrapper.emitted().input?.[0]).toEqual([1]);
    expect(wrapper.emitted().change?.[0]).toEqual([1]);
  });
});
