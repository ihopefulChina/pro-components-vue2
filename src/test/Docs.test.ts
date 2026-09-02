import { componentDocs } from "../../docs/src/content/components";
import { guides } from "../../docs/src/content/guides";
import { hookDocs } from "../../docs/src/content/hooks";

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
});
