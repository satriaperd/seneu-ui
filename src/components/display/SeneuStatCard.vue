<script setup>
import { computed } from 'vue'
import SeneuIcon from './SeneuIcon.vue'
import SeneuSkeleton from './SeneuSkeleton.vue'

/**
 * KPI/metric card — a label, a big value, and an optional trend
 * (up/down/flat vs. a prior period). Use the default slot for extras
 * like a sparkline.
 */
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  value: {
    type: [String, Number],
    default: '—',
  },
  /** Percentage change vs. the prior period — positive/negative/omitted drive the trend */
  change: {
    type: Number,
    default: null,
  },
  changePeriod: {
    type: String,
    default: '',
  },
  /** Material Symbols icon name for the badge in the top-right corner */
  icon: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: 'brand',
    validator: v => ['default', 'brand', 'success', 'warning', 'danger', 'info'].includes(v),
  },
  hoverable: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const trendDir = computed(() => {
  if (props.change === null || props.change === undefined) return 'flat'
  if (props.change > 0) return 'up'
  if (props.change < 0) return 'down'
  return 'flat'
})

const trendIcon = computed(() => ({
  up: 'trending_up',
  down: 'trending_down',
  flat: 'trending_flat',
}[trendDir.value]))

const formattedChange = computed(() => {
  if (props.change === null || props.change === undefined) return ''
  const abs = Math.abs(props.change)
  const prefix = props.change > 0 ? '+' : props.change < 0 ? '−' : ''
  return `${prefix}${abs}%`
})
</script>

<template>
  <div
    class="seneu-stat-card"
    :class="{ 'seneu-stat-card--hoverable': hoverable, 'seneu-stat-card--has-icon': icon }"
  >
    <div v-if="icon" class="seneu-stat-card__icon-wrap" :class="`seneu-stat-card__icon-wrap--${variant}`">
      <SeneuIcon :name="icon" :size="22" class="seneu-stat-card__icon" />
    </div>

    <template v-if="loading">
      <SeneuSkeleton variant="text" width="5.5rem" height="0.6875rem" />
      <SeneuSkeleton variant="text" width="9rem" height="2.125rem" style="margin-top: var(--space-stack-tight)" />
      <SeneuSkeleton variant="text" width="7.5rem" height="0.875rem" style="margin-top: var(--space-stack-normal)" />
    </template>

    <template v-else>
      <span class="seneu-stat-card__label">{{ label }}</span>
      <div class="seneu-stat-card__value">{{ value }}</div>
      <div
        v-if="change !== null && change !== undefined"
        class="seneu-stat-card__change"
        :class="`seneu-stat-card__change--${trendDir}`"
      >
        <SeneuIcon :name="trendIcon" :size="16" />
        <span>{{ formattedChange }}</span>
        <span v-if="changePeriod" class="seneu-stat-card__period">{{ changePeriod }}</span>
      </div>
      <div v-if="$slots.default" class="seneu-stat-card__extra">
        <slot />
      </div>
    </template>
  </div>
</template>

<style>
/* ── Card ──────────────────────────────────────────────── */
.seneu-stat-card {
  position: relative;
  background-color: var(--color-surface-raised);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-container);
  padding: var(--space-inline-normal);
  display: flex;
  flex-direction: column;
  gap: var(--space-stack-tight);
  font-family: var(--font-sans);
  transition: box-shadow var(--duration-fast) var(--easing-standard),
              transform var(--duration-fast) var(--easing-standard);
}
.seneu-stat-card--hoverable:hover {
  box-shadow: var(--elevation-raised);
  transform: translateY(-2px);
}

/* ── Icon badge ────────────────────────────────────────── */
.seneu-stat-card__icon-wrap {
  position: absolute;
  top: var(--space-inline-normal);
  right: var(--space-inline-normal);
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--radius-element);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--seneu-stat-card-icon-bg);
  color: var(--seneu-stat-card-icon-color);
}

.seneu-stat-card__icon-wrap--default {
  --seneu-stat-card-icon-bg: var(--color-surface-raised-hover);
  --seneu-stat-card-icon-color: var(--color-text-muted);
}
.seneu-stat-card__icon-wrap--brand {
  --seneu-stat-card-icon-bg: var(--color-surface-brand-subtle);
  --seneu-stat-card-icon-color: var(--color-text-brand);
}
.seneu-stat-card__icon-wrap--success {
  --seneu-stat-card-icon-bg: var(--color-surface-success-subtle);
  --seneu-stat-card-icon-color: var(--color-text-success);
}
.seneu-stat-card__icon-wrap--warning {
  --seneu-stat-card-icon-bg: var(--color-surface-warning-subtle);
  --seneu-stat-card-icon-color: var(--color-text-warning);
}
.seneu-stat-card__icon-wrap--danger {
  --seneu-stat-card-icon-bg: var(--color-surface-danger-subtle);
  --seneu-stat-card-icon-color: var(--color-text-danger);
}
.seneu-stat-card__icon-wrap--info {
  --seneu-stat-card-icon-bg: var(--color-surface-info-subtle);
  --seneu-stat-card-icon-color: var(--color-text-info);
}

/* ── Content ───────────────────────────────────────────── */
.seneu-stat-card__label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  color: var(--color-text-muted);
}
.seneu-stat-card__value {
  font-size: var(--font-size-heading-3);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-default);
  line-height: var(--line-height-tight);
}
.seneu-stat-card--has-icon .seneu-stat-card__label,
.seneu-stat-card--has-icon .seneu-stat-card__value {
  padding-right: 3.5rem;
}

/* ── Trend ─────────────────────────────────────────────── */
.seneu-stat-card__change {
  display: flex;
  align-items: center;
  gap: var(--space-inline-tight);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-semibold);
}
.seneu-stat-card__change--up   { color: var(--color-text-success); }
.seneu-stat-card__change--down { color: var(--color-text-danger); }
.seneu-stat-card__change--flat { color: var(--color-text-muted); }
.seneu-stat-card__period {
  color: var(--color-text-muted);
  font-weight: var(--font-weight-medium);
}

/* ── Extra slot (sparkline, etc.) ──────────────────────── */
.seneu-stat-card__extra {
  margin-top: var(--space-stack-tight);
}
</style>
