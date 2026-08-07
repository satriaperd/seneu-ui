<script setup>
import { computed } from 'vue'

/**
 * Shimmer placeholder for content that hasn't loaded yet.
 * Used internally by other components' `loading` state, and standalone
 * for custom loading layouts (e.g. a grid of skeleton cards).
 */
const props = defineProps({
  variant: {
    type: String,
    default: 'text',
    validator: v => ['text', 'title', 'circle', 'rect', 'button'].includes(v),
  },
  /** Overrides the variant's default width (any valid CSS width) */
  width: {
    type: String,
    default: '',
  },
  /** Overrides the variant's default height (any valid CSS height) */
  height: {
    type: String,
    default: '',
  },
  /** Stacks this many text lines, the last one shorter — only applies to the text variant */
  lines: {
    type: Number,
    default: 1,
  },
  /** Disables the shimmer sweep, showing a static placeholder */
  animated: {
    type: Boolean,
    default: true,
  },
})

const VARIANT_DEFAULTS = {
  text:   { width: '100%', height: '0.8125rem', radius: 'var(--radius-subtle)' },
  title:  { width: '55%',  height: '1.375rem',  radius: 'var(--radius-subtle)' },
  circle: { width: '2.5rem', height: '2.5rem',  radius: 'var(--radius-circle)' },
  rect:   { width: '100%', height: '7.5rem',    radius: 'var(--radius-element)' },
  button: { width: '6rem', height: '2.25rem',   radius: 'var(--radius-element)' },
}

const singleStyle = computed(() => {
  const d = VARIANT_DEFAULTS[props.variant]
  return {
    width: props.width || d.width,
    height: props.height || d.height,
    borderRadius: d.radius,
  }
})

function lineStyle(index) {
  const isLast = index === props.lines
  return {
    width: isLast ? '65%' : '100%',
    height: VARIANT_DEFAULTS.text.height,
    borderRadius: VARIANT_DEFAULTS.text.radius,
  }
}
</script>

<template>
  <div v-if="variant === 'text' && lines > 1" class="seneu-skeleton-lines" aria-hidden="true">
    <span
      v-for="i in lines"
      :key="i"
      class="seneu-skeleton"
      :class="{ 'seneu-skeleton--animated': animated }"
      :style="lineStyle(i)"
    />
  </div>
  <span
    v-else
    class="seneu-skeleton"
    :class="[`seneu-skeleton--${variant}`, { 'seneu-skeleton--animated': animated }]"
    :style="singleStyle"
    aria-hidden="true"
  />
</template>

<style>
.seneu-skeleton {
  display: block;
  flex-shrink: 0;
  background-color: var(--color-surface-raised-hover);
}

.seneu-skeleton--animated {
  background: linear-gradient(
    90deg,
    var(--color-surface-raised-hover) 25%,
    var(--color-surface-raised-active) 50%,
    var(--color-surface-raised-hover) 75%
  );
  background-size: 200% 100%;
  animation: seneu-skeleton-shimmer 1.5s ease-in-out infinite;
}

@keyframes seneu-skeleton-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.seneu-skeleton-lines {
  display: flex;
  flex-direction: column;
  gap: var(--space-stack-tight);
  width: 100%;
}
</style>
