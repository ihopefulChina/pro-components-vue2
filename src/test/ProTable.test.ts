import ProTable from "@/components/proTable/index.vue";
import { shallowMount } from "@vue/test-utils";

describe("ProTable", () => {
  it("builds valid search fields and preserves string widths and zero enum values", () => {
    const wrapper = shallowMount(ProTable, {
      propsData: {
        columns: [
          { prop: "name", label: "名称", searchWidth: "50%" },
          {
            prop: "status",
            label: "状态",
            valueType: "select",
            valueEnum: { enabled: { label: "启用", value: 0 } },
          },
          { prop: "photo", label: "图片", valueType: "image" },
          { prop: "actions", label: "操作", type: "actions" },
        ],
        dataSource: { manualRequest: true },
      },
    });

    expect(wrapper.vm.searchFields.map(field => field.prop)).toEqual(["name", "status"]);
    expect(wrapper.vm.searchFields[0].width).toBe("50%");
    expect(wrapper.vm.searchFields[1].options?.[0].value).toBe(0);
    expect(wrapper.vm.$options.name).toBe("ProTable");
  });

  it("keeps the newest async request result", async () => {
    const resolvers: Array<
      (value: { data: Array<{ id: number }>; total: number; success: boolean }) => void
    > = [];
    const request = vi.fn(
      () =>
        new Promise<{ data: Array<{ id: number }>; total: number; success: boolean }>(resolve => {
          resolvers.push(resolve);
        })
    );
    const wrapper = shallowMount(ProTable, {
      propsData: {
        columns: [{ prop: "id", label: "ID" }],
        dataSource: { manualRequest: true, request },
      },
    });

    const first = wrapper.vm.handleSearch({ keyword: "old" });
    const second = wrapper.vm.handleSearch({ keyword: "new" });
    resolvers[1]({ data: [{ id: 2 }], total: 1, success: true });
    await second;
    resolvers[0]({ data: [{ id: 1 }], total: 1, success: true });
    await first;

    expect(wrapper.vm.data).toEqual([{ id: 2 }]);
    expect(wrapper.vm.loading).toBe(false);
  });
});
