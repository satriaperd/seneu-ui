<script setup>
import { computed } from 'vue'
import SeneuIcon from './SeneuIcon.vue'

/**
 * Compact, non-interactive status/label pill. For a removable or
 * clickable chip (filters, multi-select), use SeneuTag instead.
 */
const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: v => ['default', 'brand', 'success', 'warning', 'danger', 'info'].includes(v),
  },
  type: {
    type: String,
    default: 'subtle',
    validator: v => ['subtle', 'solid', 'outline'].includes(v),
  },
  size: {
    type: String,
    default: 'base',
    validator: v => ['sm', 'base'].includes(v),
  },
  /** Shows a small status dot before the content */
  dot: {
    type: Boolean,
    default: false,
  },
  /** Animates the dot — for "live"/"new" indicators */
  pulse: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: '',
  },
  /**
   * Numeric mode — when set, renders this instead of the default slot
   * (capped by `max`, e.g. 99+). Use for unread/notification counts.
   */
  count: {
    type: [Number, String],
    default: null,
  },
  max: {
    type: Number,
    default: 99,
  },
  /** Still renders the badge when count is exactly 0 */
  showZero: {
    type: Boolean,
    default: false,
  },
})

const iconSize = computed(() => (props.size === 'sm' ? 11 : 13))

const shouldShow = computed(() => {
  if (props.count === null || props.count === '') return true
  return Number(props.count) !== 0 || props.showZero
})

const displayCount = computed(() => {
  const n = Number(props.count)
  if (Number.isNaN(n)) return props.count
  return n > props.max ? `${props.max}+` : String(n)
})
</script>

<template>
  <span
    v-if="shouldShow"
    class="seneu-badge"
    :class="[`seneu-badge--${variant}`, `seneu-badge--${type}`, `seneu-badge--${size}`]"
  >
    <span v-if="dot" class="seneu-badge__dot" :class="{ 'seneu-badge__dot--pulse': pulse }" />
    <SeneuIcon v-if="icon" :name="icon" :size="iconSize" class="seneu-badge__icon" />
    <span v-if="count !== null && count !== ''">{{ displayCount }}</span>
    <slot v-else />
  </span>
</template>

<style>
/* ── Base ──────────────────────────────────────────────── */
.seneu-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: var(--radius-pill);
  font-family: var(--font-sans);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  line-height: 1.4;
  white-space: nowrap;
  background-color: var(--seneu-badge-bg);
  color: var(--seneu-badge-text);
  border: 1px solid var(--seneu-badge-border);
}
.seneu-badge--sm { padding: 1px 6px; font-size: 11px; gap: 3px; }

/* ── Default (neutral) ─────────────────────────────────── */
.seneu-badge--default.seneu-badge--subtle {
  --seneu-badge-bg: var(--color-surface-raised-hover);
  --seneu-badge-text: var(--color-text-muted);
  --seneu-badge-border: var(--color-border-default);
}
.seneu-badge--default.seneu-badge--solid {
  --seneu-badge-bg: var(--color-text-default);
  --seneu-badge-text: var(--color-surface-raised);
  --seneu-badge-border: transparent;
}
.seneu-badge--default.seneu-badge--outline {
  --seneu-badge-bg: transparent;
  --seneu-badge-text: var(--color-text-muted);
  --seneu-badge-border: var(--color-border-interactive);
}

/* ── Brand ─────────────────────────────────────────────── */
.seneu-badge--brand.seneu-badge--subtle {
  --seneu-badge-bg: var(--color-surface-brand-subtle);
  --seneu-badge-text: var(--color-text-brand);
  --seneu-badge-border: var(--color-border-brand);
}
.seneu-badge--brand.seneu-badge--solid {
  --seneu-badge-bg: var(--color-surface-brand);
  --seneu-badge-text: var(--color-text-on-brand);
  --seneu-badge-border: transparent;
}
.seneu-badge--brand.seneu-badge--outline {
  --seneu-badge-bg: transparent;
  --seneu-badge-text: var(--color-text-brand);
  --seneu-badge-border: var(--color-border-brand);
}

/* ── Success ───────────────────────────────────────────── */
.seneu-badge--success.seneu-badge--subtle {
  --seneu-badge-bg: var(--color-surface-success-subtle);
  --seneu-badge-text: var(--color-text-success);
  --seneu-badge-border: var(--color-border-success);
}
.seneu-badge--success.seneu-badge--solid {
  --seneu-badge-bg: var(--color-surface-success);
  --seneu-badge-text: var(--color-text-on-success);
  --seneu-badge-border: transparent;
}
.seneu-badge--success.seneu-badge--outline {
  --seneu-badge-bg: transparent;
  --seneu-badge-text: var(--color-text-success);
  --seneu-badge-border: var(--color-border-success);
}

/* ── Danger ────────────────────────────────────────────── */
.seneu-badge--danger.seneu-badge--subtle {
  --seneu-badge-bg: var(--color-surface-danger-subtle);
  --seneu-badge-text: var(--color-text-danger);
  --seneu-badge-border: var(--color-border-danger);
}
.seneu-badge--danger.seneu-badge--solid {
  --seneu-badge-bg: var(--color-surface-danger);
  --seneu-badge-text: var(--color-text-on-danger);
  --seneu-badge-border: transparent;
}
.seneu-badge--danger.seneu-badge--outline {
  --seneu-badge-bg: transparent;
  --seneu-badge-text: var(--color-text-danger);
  --seneu-badge-border: var(--color-border-danger);
}

/*
  Warning/info "solid" fall back to a stronger tonal treatment instead of
  true inverted white text — matches SeneuButton's precedent, since
  warning-500/info-500 + white text fails WCAG AA for text this small.
*/
.seneu-badge--warning.seneu-badge--subtle,
.seneu-badge--warning.seneu-badge--solid {
  --seneu-badge-bg: var(--color-surface-warning-subtle);
  --seneu-badge-text: var(--color-text-warning);
  --seneu-badge-border: var(--color-border-warning);
}
.seneu-badge--warning.seneu-badge--solid { --seneu-badge-bg: var(--color-surface-warning-hover); }
.seneu-badge--warning.seneu-badge--outline {
  --seneu-badge-bg: transparent;
  --seneu-badge-text: var(--color-text-warning);
  --seneu-badge-border: var(--color-border-warning);
}

.seneu-badge--info.seneu-badge--subtle,
.seneu-badge--info.seneu-badge--solid {
  --seneu-badge-bg: var(--color-surface-info-subtle);
  --seneu-badge-text: var(--color-text-info);
  --seneu-badge-border: var(--color-border-info);
}
.seneu-badge--info.seneu-badge--solid { --seneu-badge-bg: var(--color-surface-info-hover); }
.seneu-badge--info.seneu-badge--outline {
  --seneu-badge-bg: transparent;
  --seneu-badge-text: var(--color-text-info);
  --seneu-badge-border: var(--color-border-info);
}

/* ── Dot ───────────────────────────────────────────────── */
.seneu-badge__dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-circle);
  background-color: currentColor;
  flex-shrink: 0;
}
.seneu-badge--sm .seneu-badge__dot { width: 5px; height: 5px; }
.seneu-badge__dot--pulse { animation: seneu-badge-pulse 1.6s ease-in-out infinite; }
@keyframes seneu-badge-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 currentColor; }
  50% { opacity: 0.6; box-shadow: 0 0 0 3px transparent; }
}

/* ── Icon ──────────────────────────────────────────────── */
.seneu-badge__icon { flex-shrink: 0; }

@media (prefers-reduced-motion: reduce) {
  .seneu-badge__dot--pulse { animation: none; }
}
</style>
