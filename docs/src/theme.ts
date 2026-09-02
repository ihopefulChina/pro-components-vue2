import { computed, onBeforeUnmount, onMounted, ref } from "@vue/composition-api";

export type SiteTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "pro-components-vue2-theme";

export const resolveTheme = (storedTheme: string | null, prefersDark: boolean): SiteTheme => {
  if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
  return prefersDark ? "dark" : "light";
};

const readStoredTheme = (): SiteTheme | null => {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme === "light" || storedTheme === "dark" ? storedTheme : null;
  } catch {
    return null;
  }
};

const storeTheme = (theme: SiteTheme) => {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The selected theme still applies for this page when storage is unavailable.
  }
};

const applyTheme = (theme: SiteTheme) => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document
    .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#0f1117" : "#ffffff");
};

export const useTheme = () => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const theme = ref<SiteTheme>(resolveTheme(readStoredTheme(), mediaQuery.matches));
  let hasManualOverride = readStoredTheme() !== null;

  applyTheme(theme.value);

  const themeActionLabel = computed(() =>
    theme.value === "dark" ? "切换到亮色模式" : "切换到暗夜模式"
  );

  const handleSystemThemeChange = (event: MediaQueryListEvent) => {
    if (!hasManualOverride) {
      theme.value = event.matches ? "dark" : "light";
      applyTheme(theme.value);
    }
  };

  const toggleTheme = () => {
    theme.value = theme.value === "dark" ? "light" : "dark";
    hasManualOverride = true;
    storeTheme(theme.value);
    applyTheme(theme.value);
  };

  onMounted(() => {
    if (mediaQuery.addEventListener) mediaQuery.addEventListener("change", handleSystemThemeChange);
    else mediaQuery.addListener(handleSystemThemeChange);
  });
  onBeforeUnmount(() => {
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    } else {
      mediaQuery.removeListener(handleSystemThemeChange);
    }
  });

  return { theme, themeActionLabel, toggleTheme };
};
