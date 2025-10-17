import ProForm from "@/components/proForm/ProForm.vue";
import VueCompositionAPI from "@vue/composition-api";
import { createLocalVue, mount } from "@vue/test-utils";
import ElementUI from "element-ui";

const localVue = createLocalVue();
localVue.use(VueCompositionAPI);
localVue.use(ElementUI);

describe("ProForm", () => {
  it("renders correctly", () => {
    const wrapper = mount(ProForm, {
      localVue,
      propsData: {
        initialValue: {},
        rules: {},
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("emits submit event", async () => {
    const wrapper = mount(ProForm, {
      localVue,
      propsData: {
        initialValue: { name: "test" },
        rules: {},
      },
    });

    await wrapper.vm.$nextTick();

    // 模拟提交
    wrapper.vm.handleSubmit();

    expect(wrapper.emitted().submit).toBeTruthy();
  });
});
