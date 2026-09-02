import SearchForm from "@/components/searchForm/index.vue";
import { createLocalVue, mount } from "@vue/test-utils";
import ElementUI from "element-ui";

const localVue = createLocalVue();
localVue.use(ElementUI);

describe("SearchForm", () => {
  it("uses the Vue 2 value/input model contract", async () => {
    const wrapper = mount(SearchForm, {
      localVue,
      propsData: {
        value: { keyword: "old" },
        fields: [{ prop: "keyword", label: "关键词", type: "input" }],
      },
    });

    await wrapper.find("input").setValue("new");
    await wrapper.vm.$nextTick();

    const inputEvents = wrapper.emitted().input;
    expect(inputEvents?.[inputEvents.length - 1]).toEqual([{ keyword: "new" }]);
  });

  it("keeps loading active while the search handler is pending", async () => {
    let resolveSearch!: () => void;
    const searchHandler = vi.fn(
      () =>
        new Promise<void>(resolve => {
          resolveSearch = resolve;
        })
    );
    const wrapper = mount(SearchForm, {
      localVue,
      propsData: {
        value: { keyword: "test" },
        fields: [{ prop: "keyword", label: "关键词", type: "input" }],
        searchHandler,
      },
    });

    const searching = wrapper.vm.handleSearch();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.searchLoading).toBe(true);
    expect(searchHandler).toHaveBeenCalledWith({ keyword: "test" });

    resolveSearch();
    await searching;

    expect(wrapper.vm.searchLoading).toBe(false);
  });
});
