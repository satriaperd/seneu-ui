<script setup>
/**
 * Dev-only titled section for component showcase pages.
 * Renders an uppercase label with a divider, then the slotted demo content.
 * Not exported from src/index.js — internal to the dev preview app only.
 */
defineProps({
  /** Section heading, e.g. "Variants", "Sizes", "States" */
  title: { type: String, required: true },
})
</script>

<template>
  <section class="dev-showcase-section">
    <h2 class="dev-showcase-section__title">{{ title }}</h2>
    <slot />
  </section>
</template>

<style scoped>
.dev-showcase-section {
  display:        flex;
  flex-direction: column;
  gap:            var(--primitive-space-4);
}

.dev-showcase-section__title {
  font-size:       var(--font-size-small);
  font-weight:     var(--font-weight-semibold);
  color:           var(--color-text-muted);
  text-transform:  uppercase;
  letter-spacing:  var(--letter-spacing-wide);
  padding-bottom:  var(--primitive-space-2);
  border-bottom:   1px solid var(--color-border-default);
}
</style>
