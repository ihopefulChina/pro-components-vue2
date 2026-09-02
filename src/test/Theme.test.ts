import { mount } from "@vue/test-utils";
import SiteHeader from "../../docs/src/components/SiteHeader.vue";
import { THEME_STORAGE_KEY, resolveTheme } from "../../docs/src/theme";

const createMediaQuery = (matches: boolean) => ({
  matches,
  media: "(prefers-color-scheme: dark)",
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

describe("documentation theme", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.head.innerHTML = '<meta name="theme-color" content="#ffffff">';
  });
  afterEach(() => vi.unstubAllGlobals());

  it("uses an explicit choice before the system preference", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
    expect(resolveTheme(null, true)).toBe("dark");
  });

  it("starts from the system theme and persists a manual switch", async () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => createMediaQuery(true))
    );
    const wrapper = mount(SiteHeader, {
      stubs: { RouterLink: true, LogoMark: true },
    });
    const toggle = wrapper.find(".theme-toggle");

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(toggle.attributes("aria-label")).toBe("切换到亮色模式");

    await toggle.trigger("click");

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(document.querySelector('meta[name="theme-color"]')?.getAttribute("content")).toBe(
      "#ffffff"
    );
  });

  it("tracks system theme changes until the user makes a choice", async () => {
    const mediaQuery = createMediaQuery(true);
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => mediaQuery)
    );
    const wrapper = mount(SiteHeader, {
      stubs: { RouterLink: true, LogoMark: true },
    });
    const handleThemeChange = mediaQuery.addEventListener.mock.calls[0][1];

    handleThemeChange({ matches: false } as MediaQueryListEvent);
    await wrapper.vm.$nextTick();

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });
});
