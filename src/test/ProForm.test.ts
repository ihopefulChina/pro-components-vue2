import ProForm from "@/components/proForm/ProForm.vue";
import { createLocalVue, mount } from "@vue/test-utils";
import ElementUI from "element-ui";

const localVue = createLocalVue();
localVue.use(ElementUI);

describe("ProForm", () => {
  it("renders and synchronizes a changed initial value", async () => {
    const wrapper = mount(ProForm, {
      localVue,
      propsData: {
        initialValue: { name: "first" },
        rules: {},
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm.getFieldsValue()).toEqual({ name: "first" });

    await wrapper.setProps({ initialValue: { name: "second" } });
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.getFieldsValue()).toEqual({ name: "second" });
  });

  it("awaits the submitter and blocks duplicate submits", async () => {
    let resolveSubmit!: () => void;
    const submitter = vi.fn(
      () =>
        new Promise<void>(resolve => {
          resolveSubmit = resolve;
        })
    );
    const wrapper = mount(ProForm, {
      localVue,
      propsData: {
        initialValue: { name: "test" },
        rules: {},
        submitter,
      },
    });

    const firstSubmit = wrapper.vm.submit();
    const duplicateSubmit = await wrapper.vm.submit();

    expect(duplicateSubmit).toBe(false);
    expect(submitter).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.isSubmitting).toBe(true);

    resolveSubmit();
    await firstSubmit;

    expect(wrapper.vm.isSubmitting).toBe(false);
    expect(wrapper.emitted().submit?.[0]).toEqual([{ name: "test" }]);
  });
});
