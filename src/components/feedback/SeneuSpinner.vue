<script setup>
/**
 * Indeterminate loading indicator. Use `inverted` when placing it on
 * a solid/dark background (e.g. inside a brand-colored button).
 */
defineProps({
  size: {
    type: String,
    default: 'base',
    validator: v => ['xs', 'sm', 'base', 'lg', 'xl'].includes(v),
  },
  variant: {
    type: String,
    default: 'default',
    validator: v => ['default', 'brand', 'success', 'warning', 'danger', 'info', 'inverted'].includes(v),
  },
  /** Optional text next to the ring — also used as the accessible label */
  label: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <span
    class="seneu-spinner"
    :class="[`seneu-spinner--${size}`, `seneu-spinner--${variant}`]"
    role="status"
    :aria-label="label || 'Loading'"
  >
    <span class="seneu-spinner__ring" aria-hidden="true" />
    <span v-if="label" class="seneu-spinner__label">{{ label }}</span>
  </span>
</template>

<style>
/* ── Base ──────────────────────────────────────────────── */
.seneu-spinner {
  display: inline-flex;
  align-items: center;
  gap: var(--space-inline-tight);
  vertical-align: middle;
  font-family: var(--font-sans);
}

.seneu-spinner__ring {
  display: block;
  border-style: solid;
  border-radius: var(--radius-circle);
  border-color: var(--seneu-spinner-track) var(--seneu-spinner-track) var(--seneu-spinner-track) var(--seneu-spinner-arc);
  animation: seneu-spinner-spin 0.7s linear infinite;
  flex-shrink: 0;
}

.seneu-spinner__label {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
}

/* ── Sizes ─────────────────────────────────────────────── */
.seneu-spinner--xs   .seneu-spinner__ring { width: 0.875rem; height: 0.875rem; border-width: 2px; }
.seneu-spinner--sm   .seneu-spinner__ring { width: 1.125rem; height: 1.125rem; border-width: 2px; }
.seneu-spinner--base .seneu-spinner__ring { width: 1.5rem;   height: 1.5rem;   border-width: 3px; }
.seneu-spinner--lg   .seneu-spinner__ring { width: 2.25rem;  height: 2.25rem;  border-width: 3px; }
.seneu-spinner--xl   .seneu-spinner__ring { width: 3.25rem;  height: 3.25rem;  border-width: 4px; }

/* ── Variants ──────────────────────────────────────────── */
.seneu-spinner--default {
  --seneu-spinner-track: color-mix(in srgb, var(--color-border-default) 40%, transparent);
  --seneu-spinner-arc: var(--color-text-default);
}
.seneu-spinner--brand {
  --seneu-spinner-track: color-mix(in srgb, var(--color-border-brand) 30%, transparent);
  --seneu-spinner-arc: var(--color-border-brand);
}
.seneu-spinner--success {
  --seneu-spinner-track: color-mix(in srgb, var(--color-border-success) 30%, transparent);
  --seneu-spinner-arc: var(--color-border-success);
}
.seneu-spinner--warning {
  --seneu-spinner-track: color-mix(in srgb, var(--color-border-warning) 30%, transparent);
  --seneu-spinner-arc: var(--color-border-warning);
}
.seneu-spinner--danger {
  --seneu-spinner-track: color-mix(in srgb, var(--color-border-danger) 30%, transparent);
  --seneu-spinner-arc: var(--color-border-danger);
}
.seneu-spinner--info {
  --seneu-spinner-track: color-mix(in srgb, var(--color-border-info) 30%, transparent);
  --seneu-spinner-arc: var(--color-border-info);
}
.seneu-spinner--inverted {
  --seneu-spinner-track: color-mix(in srgb, var(--color-text-on-brand) 25%, transparent);
  --seneu-spinner-arc: var(--color-text-on-brand);
}
.seneu-spinner--inverted .seneu-spinner__label { color: var(--color-text-on-brand); }

/* ── Animation ─────────────────────────────────────────── */
@keyframes seneu-spinner-spin {
  to { transform: rotate(360deg); }
}
</style>
