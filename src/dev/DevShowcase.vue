<script setup>
/**
 * Dev-only layout wrapper for component showcase pages.
 * Stacks its children (usually DevShowcaseSection) with consistent spacing.
 * Not exported from src/index.js — internal to the dev preview app only.
 */
</script>

<template>
  <div class="dev-showcase">
    <slot />
  </div>
</template>

<style scoped>
.dev-showcase {
  display:        flex;
  flex-direction: column;
  gap:            var(--primitive-space-10);
}
</style>
