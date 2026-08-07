<script setup>
import { computed } from 'vue'
import SeneuIcon from '../display/SeneuIcon.vue'

/**
 * Page navigation. `default` variant shows numbered page buttons with
 * ellipsis collapsing for long ranges; `simple` variant shows a compact
 * "current / total" readout — handy for tight spaces or infinite lists.
 */
const props = defineProps({
  /** Current page number (1-based). Use with v-model. */
  modelValue: {
    type: Number,
    default: 1,
  },
  /** Total number of items being paginated. */
  total: {
    type: Number,
    default: 0,
  },
  perPage: {
    type: Number,
    default: 10,
  },
  /** Number of page buttons shown on each side of the current page. */
  siblingCount: {
    type: Number,
    default: 1,
  },
  variant: {
    type: String,
    default: 'default',
    validator: v => ['default', 'simple'].includes(v),
  },
  size: {
    type: String,
    default: 'base',
    validator: v => ['sm', 'base', 'lg'].includes(v),
  },
  /** Shows "Previous"/"Next" text next to the arrows (default variant only) */
  showLabels: {
    type: Boolean,
    default: true,
  },
  /** Shows jump-to-first/last-page buttons */
  showEdgeButtons: {
    type: Boolean,
    default: false,
  },
  /** Shows shimmer placeholders instead of page buttons */
  loading: {
    type: Boolean,
    default: false,
  },
  ariaLabel: {
    type: String,
    default: 'Pagination navigation',
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const iconSize = computed(() => ({ sm: 16, base: 18, lg: 20 }[props.size]))

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.perPage)))

const pageList = computed(() => {
  const total = totalPages.value
  if (total <= 1) return [1]

  const current = Math.min(Math.max(props.modelValue, 1), total)
  const delta = props.siblingCount

  const pages = new Set([1, total])
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    pages.add(i)
  }

  const sorted = [...pages].sort((a, b) => a - b)
  const result = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...')
    result.push(sorted[i])
  }
  return result
})

function go(page) {
  const clamped = Math.max(1, Math.min(page, totalPages.value))
  if (clamped === props.modelValue) return
  emit('change', { from: props.modelValue, to: clamped })
  emit('update:modelValue', clamped)
}
</script>

<template>
  <nav
    class="seneu-pagination"
    :class="[`seneu-pagination--${size}`, `seneu-pagination--${variant}`]"
    :aria-label="ariaLabel"
  >
    <template v-if="loading">
      <span class="seneu-pagination__skeleton seneu-pagination__skeleton--btn" aria-hidden="true" />
      <span v-for="n in 3" :key="n" class="seneu-pagination__skeleton" aria-hidden="true" />
      <span class="seneu-pagination__skeleton seneu-pagination__skeleton--btn" aria-hidden="true" />
    </template>

    <template v-else>
      <button
        v-if="showEdgeButtons"
        type="button"
        class="seneu-pagination__btn"
        :disabled="modelValue <= 1"
        aria-label="Go to first page"
        @click="go(1)"
      >
        <SeneuIcon name="first_page" :size="iconSize" />
      </button>

      <button
        type="button"
        class="seneu-pagination__btn seneu-pagination__btn--prev"
        :disabled="modelValue <= 1"
        :aria-label="`Go to page ${modelValue - 1}`"
        @click="go(modelValue - 1)"
      >
        <SeneuIcon name="chevron_left" :size="iconSize" />
        <span v-if="showLabels" class="seneu-pagination__btn-label">Previous</span>
      </button>

      <template v-if="variant === 'default'">
        <template v-for="(item, i) in pageList" :key="`${item}-${i}`">
          <span v-if="item === '...'" class="seneu-pagination__ellipsis" aria-hidden="true">&middot;&middot;&middot;</span>
          <button
            v-else
            type="button"
            class="seneu-pagination__page"
            :class="{ 'seneu-pagination__page--active': item === modelValue }"
            :aria-label="`Page ${item}`"
            :aria-current="item === modelValue ? 'page' : undefined"
            @click="go(item)"
          >{{ item }}</button>
        </template>
      </template>

      <span v-else class="seneu-pagination__info" aria-live="polite">
        <span class="seneu-pagination__info-current">{{ modelValue }}</span>
        <span class="seneu-pagination__info-sep">/</span>
        <span class="seneu-pagination__info-total">{{ totalPages }}</span>
      </span>

      <button
        type="button"
        class="seneu-pagination__btn seneu-pagination__btn--next"
        :disabled="modelValue >= totalPages"
        :aria-label="`Go to page ${modelValue + 1}`"
        @click="go(modelValue + 1)"
      >
        <span v-if="showLabels" class="seneu-pagination__btn-label">Next</span>
        <SeneuIcon name="chevron_right" :size="iconSize" />
      </button>

      <button
        v-if="showEdgeButtons"
        type="button"
        class="seneu-pagination__btn"
        :disabled="modelValue >= totalPages"
        aria-label="Go to last page"
        @click="go(totalPages)"
      >
        <SeneuIcon name="last_page" :size="iconSize" />
      </button>
    </template>
  </nav>
</template>

<style>
/* ── Shell ─────────────────────────────────────────────── */
.seneu-pagination {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-sans);
}

/* ── Prev / Next / edge buttons ────────────────────────── */
.seneu-pagination__btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 10px;
  height: 36px;
  border-radius: var(--radius-element);
  border: 1px solid var(--color-border-default);
  background: var(--color-surface-raised);
  color: var(--color-text-muted);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--easing-standard),
              color var(--duration-fast) var(--easing-standard),
              border-color var(--duration-fast) var(--easing-standard);
}
.seneu-pagination__btn:hover:not(:disabled) {
  background-color: var(--color-surface-raised-hover);
  color: var(--color-text-default);
  border-color: var(--color-border-interactive);
}
.seneu-pagination__btn:active:not(:disabled) { background-color: var(--color-surface-raised-active); }
.seneu-pagination__btn:disabled { opacity: var(--opacity-disabled); cursor: not-allowed; }
.seneu-pagination__btn:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 1px;
}
/* ── Page number buttons ───────────────────────────────── */
.seneu-pagination__page {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 4px;
  border-radius: var(--radius-element);
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-text-muted);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--easing-standard),
              color var(--duration-fast) var(--easing-standard),
              border-color var(--duration-fast) var(--easing-standard);
}
.seneu-pagination__page:hover:not(.seneu-pagination__page--active) {
  background-color: var(--color-surface-raised-hover);
  color: var(--color-text-default);
  border-color: var(--color-border-default);
}
.seneu-pagination__page--active {
  background-color: var(--color-surface-brand);
  color: var(--color-text-on-brand);
  border-color: var(--color-surface-brand);
  font-weight: var(--font-weight-semibold);
  cursor: default;
}
.seneu-pagination__page:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 1px;
}

/* ── Ellipsis ──────────────────────────────────────────── */
.seneu-pagination__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  font-size: var(--font-size-small);
  color: var(--color-text-disabled);
  letter-spacing: 2px;
  user-select: none;
}

/* ── Simple info ───────────────────────────────────────── */
.seneu-pagination__info {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  height: 36px;
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
}
.seneu-pagination__info-current { font-weight: var(--font-weight-semibold); color: var(--color-text-default); }
.seneu-pagination__info-sep { color: var(--color-text-disabled); }

/* ── Skeleton (loading) ────────────────────────────────── */
.seneu-pagination__skeleton {
  display: block;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-element);
  background: linear-gradient(
    90deg,
    var(--color-surface-raised-hover) 25%,
    var(--color-surface-raised-active) 50%,
    var(--color-surface-raised-hover) 75%
  );
  background-size: 200% 100%;
  animation: seneu-pagination-shimmer 1.5s ease-in-out infinite;
}
.seneu-pagination__skeleton--btn { width: 76px; }
@keyframes seneu-pagination-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Sizes ─────────────────────────────────────────────── */
.seneu-pagination--sm .seneu-pagination__btn,
.seneu-pagination--sm .seneu-pagination__page,
.seneu-pagination--sm .seneu-pagination__ellipsis,
.seneu-pagination--sm .seneu-pagination__info,
.seneu-pagination--sm .seneu-pagination__skeleton { height: 28px; font-size: var(--font-size-xs); }
.seneu-pagination--sm .seneu-pagination__page,
.seneu-pagination--sm .seneu-pagination__ellipsis,
.seneu-pagination--sm .seneu-pagination__skeleton { min-width: 28px; width: 28px; }
.seneu-pagination--sm .seneu-pagination__skeleton--btn { width: 60px; }
.seneu-pagination--sm .seneu-pagination__btn { padding: 0 8px; }

.seneu-pagination--lg .seneu-pagination__btn,
.seneu-pagination--lg .seneu-pagination__page,
.seneu-pagination--lg .seneu-pagination__ellipsis,
.seneu-pagination--lg .seneu-pagination__info,
.seneu-pagination--lg .seneu-pagination__skeleton { height: 44px; font-size: var(--font-size-body); }
.seneu-pagination--lg .seneu-pagination__page,
.seneu-pagination--lg .seneu-pagination__ellipsis,
.seneu-pagination--lg .seneu-pagination__skeleton { min-width: 44px; width: 44px; }
.seneu-pagination--lg .seneu-pagination__skeleton--btn { width: 92px; }
.seneu-pagination--lg .seneu-pagination__btn { padding: 0 14px; }

/* ── Responsive ────────────────────────────────────────── */
@media (max-width: 480px) {
  .seneu-pagination__btn-label { display: none !important; }
}
</style>
