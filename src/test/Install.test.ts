import ProComponentsVue2 from "@/index";

describe("global plugin install", () => {
  it("registers the complete public component set", () => {
    const component = vi.fn();

    ProComponentsVue2.install({ component });

    const registeredNames = component.mock.calls.map(([name]) => name);
    expect(registeredNames).toHaveLength(25);
    expect(new Set(registeredNames).size).toBe(25);
    expect(registeredNames).toContain("ProFormText");
    expect(registeredNames).toContain("ProTable");
    expect(registeredNames).toContain("SearchForm");
  });
});
