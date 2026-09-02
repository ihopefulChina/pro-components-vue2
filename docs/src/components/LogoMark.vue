<template>
  <svg class="logo-mark" viewBox="0 0 128 128" role="img" aria-label="Pro Components Vue2">
    <path
      fill="currentColor"
      d="M28 12h66l12 12H22zM104 30l12 12v58l-12 12zM34 104h72l-12 12H22zM12 34l12-12v84l-12-12z"
    />
    <path class="logo-mark__accent" d="M100 12h16v16zM12 100l16 16H12z" />
    <path
      class="logo-mark__primary"
      d="M36 34h32c20 0 34 12 34 30 0 13-7 22-20 31l-13 9H48l25-21c9-7 13-12 13-19 0-9-7-15-18-15H53v18h17L52 83v21H36z"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({ name: "LogoMark" });
</script>

<style lang="scss" scoped>
.logo-mark {
  color: var(--ink);
  display: block;
}

.logo-mark__primary {
  fill: var(--primary);
}

.logo-mark__accent {
  fill: var(--cyan);
}
</style>
