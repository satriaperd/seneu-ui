<script setup>
import { computed } from 'vue'

/**
 * Linear progress indicator. Determinate by default (drive it with
 * `value`/`max`); set `indeterminate` for unknown-duration tasks.
 */
const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  size: {
    type: String,
    default: 'base',
    validator: v => ['xs', 'sm', 'base', 'lg'].includes(v),
  },
  variant: {
    type: String,
    default: 'brand',
    validator: v => ['default', 'brand', 'success', 'warning', 'danger', 'info'].includes(v),
  },
  striped: {
    type: Boolean,
    default: false,
  },
  /** Slides the stripes — only visible when `striped` is also true */
  animated: {
    type: Boolean,
    default: false,
  },
  /** Unknown-duration mode — ignores value/max, animates a sweeping segment */
  indeterminate: {
    type: Boolean,
    default: false,
  },
  showValue: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
})

const clampedValue = computed(() => Math.min(Math.max(props.value, 0), props.max))
const percentage = computed(() => (clampedValue.value / props.max) * 100)
</script>

<template>
  <div
    class="seneu-progress"
    :class="[
      `seneu-progress--${size}`,
      `seneu-progress--${variant}`,
      { 'seneu-progress--striped': striped, 'seneu-progress--animated': striped && animated },
    ]"
    role="progressbar"
    :aria-valuenow="indeterminate ? undefined : clampedValue"
    :aria-valuemin="indeterminate ? undefined : 0"
    :aria-valuemax="indeterminate ? undefined : max"
    :aria-label="label || (indeterminate ? 'Loading' : `${clampedValue}%`)"
    :aria-valuetext="indeterminate ? 'Loading' : `${clampedValue}%`"
  >
    <div class="seneu-progress__track">
      <div
        class="seneu-progress__fill"
        :class="{ 'seneu-progress__fill--indeterminate': indeterminate }"
        :style="indeterminate ? {} : { width: `${percentage}%` }"
      />
    </div>

    <span v-if="showValue && !indeterminate" class="seneu-progress__value">{{ clampedValue }}%</span>
  </div>
</template>

<style>
/* ── Wrapper ───────────────────────────────────────────── */
.seneu-progress {
  display: flex;
  align-items: center;
  gap: var(--space-inline-tight);
  width: 100%;
  font-family: var(--font-sans);
}

/* ── Track ─────────────────────────────────────────────── */
.seneu-progress__track {
  flex: 1;
  background-color: var(--color-surface-raised-hover);
  border-radius: var(--radius-pill);
  overflow: hidden;
  position: relative;
}

/* ── Sizes (track height) ──────────────────────────────── */
.seneu-progress--xs   .seneu-progress__track { height: 0.25rem; }
.seneu-progress--sm   .seneu-progress__track { height: 0.375rem; }
.seneu-progress--base .seneu-progress__track { height: 0.625rem; }
.seneu-progress--lg   .seneu-progress__track { height: 1rem; }

/* ── Fill ──────────────────────────────────────────────── */
.seneu-progress__fill {
  height: 100%;
  border-radius: var(--radius-pill);
  background-color: var(--seneu-progress-fill);
  transition: width var(--duration-slow) var(--easing-standard);
  min-width: 0;
}

/* ── Variants ──────────────────────────────────────────── */
.seneu-progress--default { --seneu-progress-fill: var(--color-text-muted); }
.seneu-progress--brand   { --seneu-progress-fill: var(--color-surface-brand); }
.seneu-progress--success { --seneu-progress-fill: var(--color-surface-success); }
.seneu-progress--warning { --seneu-progress-fill: var(--color-surface-warning); }
.seneu-progress--danger  { --seneu-progress-fill: var(--color-surface-danger); }
.seneu-progress--info    { --seneu-progress-fill: var(--color-surface-info); }

/* ── Striped ───────────────────────────────────────────── */
.seneu-progress--striped .seneu-progress__fill {
  background-image: linear-gradient(
    45deg,
    color-mix(in srgb, var(--color-text-on-brand) 18%, transparent) 25%,
    transparent 25%,
    transparent 50%,
    color-mix(in srgb, var(--color-text-on-brand) 18%, transparent) 50%,
    color-mix(in srgb, var(--color-text-on-brand) 18%, transparent) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1.5rem 1.5rem;
}

/* ── Animated stripes ──────────────────────────────────── */
.seneu-progress--animated .seneu-progress__fill {
  animation: seneu-progress-stripe-slide 0.6s linear infinite;
}
@keyframes seneu-progress-stripe-slide {
  from { background-position: 1.5rem 0; }
  to   { background-position: 0 0; }
}

/* ── Indeterminate ─────────────────────────────────────── */
.seneu-progress__fill--indeterminate {
  width: 40% !important;
  animation: seneu-progress-indeterminate 1.4s ease-in-out infinite;
}
@keyframes seneu-progress-indeterminate {
  0%   { transform: translateX(-150%); }
  100% { transform: translateX(350%); }
}

/* ── Value label ───────────────────────────────────────── */
.seneu-progress__value {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 2.8ch;
  text-align: right;
}
</style>
