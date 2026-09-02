<template>
  <div class="docs-shell">
    <SiteHeader
      :menu-open="menuOpen"
      @toggle-menu="menuOpen = !menuOpen"
      @open-search="searchOpen = true"
    />
    <div v-if="menuOpen" class="nav-mask" @click="menuOpen = false" />
    <SideNav :open="menuOpen" :mobile="mobile" @close="menuOpen = false" />
    <main class="docs-main" :class="{ 'docs-main--with-toc': $slots.toc }">
      <div class="docs-content"><slot /></div>
      <aside v-if="$slots.toc" class="docs-toc"><slot name="toc" /></aside>
    </main>
    <SearchDialog :open="searchOpen" @close="searchOpen = false" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from "@vue/composition-api";
import SearchDialog from "./SearchDialog.vue";
import SideNav from "./SideNav.vue";
import SiteHeader from "./SiteHeader.vue";

export default defineComponent({
  name: "SiteShell",
  components: { SearchDialog, SideNav, SiteHeader },
  setup() {
    const menuOpen = ref(false);
    const mobile = ref(false);
    const searchOpen = ref(false);
    let mediaQuery: MediaQueryList | undefined;
    const updateMobile = () => {
      mobile.value = mediaQuery?.matches ?? false;
      if (!mobile.value) menuOpen.value = false;
    };
    const onKeydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchOpen.value = true;
      }
    };
    onMounted(() => {
      window.addEventListener("keydown", onKeydown);
      mediaQuery = window.matchMedia("(max-width: 760px)");
      updateMobile();
      mediaQuery.addEventListener("change", updateMobile);
    });
    onBeforeUnmount(() => {
      window.removeEventListener("keydown", onKeydown);
      mediaQuery?.removeEventListener("change", updateMobile);
    });
    return { menuOpen, mobile, searchOpen };
  },
});
</script>
