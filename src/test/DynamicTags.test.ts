import ProFormDynamicTags from "@/components/proForm/fields/ProFormDynamicTags.vue";
import { createLocalVue, mount } from "@vue/test-utils";
import ElementUI from "element-ui";

const localVue = createLocalVue();
localVue.use(ElementUI);

describe("ProFormDynamicTags", () => {
  it("removes the selected tag while preserving the other values", async () => {
    const wrapper = mount(ProFormDynamicTags, {
      localVue,
      propsData: {
        name: "tags",
        label: "标签",
        value: ["first", "second"],
      },
      stubs: {
        ProFormItem: {
          template: "<div><slot /></div>",
        },
      },
      provide: {
        proForm: { formRef: { value: undefined }, getFieldsValue: () => ({}) },
      },
    });

    await wrapper.findAll(".el-tag__close").at(0).trigger("click");

    const inputEvents = wrapper.emitted().input;
    expect(inputEvents?.[inputEvents.length - 1]).toEqual([["second"]]);
  });

  it("honors the minimum item limit", () => {
    const wrapper = mount(ProFormDynamicTags, {
      localVue,
      propsData: {
        name: "tags",
        label: "标签",
        value: ["only"],
        minItems: 1,
      },
      stubs: {
        ProFormItem: {
          template: "<div><slot /></div>",
        },
      },
      provide: {
        proForm: { formRef: { value: undefined }, getFieldsValue: () => ({}) },
      },
    });

    wrapper.vm.removeTag(0);

    expect(wrapper.emitted().input).toBeUndefined();
  });
});
