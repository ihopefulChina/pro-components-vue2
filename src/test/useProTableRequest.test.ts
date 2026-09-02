import { useProTableRequest } from "@/hooks/useProTableRequest";
import { defineComponent } from "@vue/composition-api";
import { mount } from "@vue/test-utils";

describe("useProTableRequest", () => {
  it("updates exposed data and pagination state", async () => {
    const api = vi.fn(async () => ({ list: [{ id: 1 }], total: 7 }));
    const Harness = defineComponent({
      setup() {
        return useProTableRequest(api);
      },
      render(createElement) {
        return createElement("div");
      },
    });
    const wrapper = mount(Harness);

    const result = await wrapper.vm.request({ currentPage: 2, pageSize: 20 });

    expect(result).toEqual({ data: [{ id: 1 }], success: true, total: 7 });
    expect(wrapper.vm.data).toEqual([{ id: 1 }]);
    expect(wrapper.vm.pagination).toMatchObject({ currentPage: 2, pageSize: 20, total: 7 });
    expect(api).toHaveBeenCalledWith({ pageSize: 20, pageNow: 2 });
  });
});
