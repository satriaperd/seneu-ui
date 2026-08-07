<script setup>
import { computed } from 'vue'
import SeneuIcon from './SeneuIcon.vue'

/**
 * Informative, actionable placeholder for empty lists, tables, search
 * results, and other "nothing here yet" states. Pair it with the `actions`
 * slot so the user has a next step instead of a dead end.
 */
const props = defineProps({
  /** Material Symbols icon name — ignored when the icon slot is used */
  icon: {
    type: String,
    default: 'inbox',
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'base',
    validator: v => ['sm', 'base', 'lg'].includes(v),
  },
})

const ICON_SIZE = { sm: 22, base: 32, lg: 44 }
const iconSize = computed(() => ICON_SIZE[props.size])
</script>

<template>
  <div class="seneu-empty-state" :class="`seneu-empty-state--${size}`">
    <div class="seneu-empty-state__icon-wrap">
      <slot name="icon">
        <SeneuIcon :name="icon" :size="iconSize" class="seneu-empty-state__icon" />
      </slot>
    </div>

    <div class="seneu-empty-state__content">
      <h3 v-if="title" class="seneu-empty-state__title">{{ title }}</h3>
      <p v-if="description" class="seneu-empty-state__desc">{{ description }}</p>
    </div>

    <div v-if="$slots.actions" class="seneu-empty-state__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style>
/* ── Base ──────────────────────────────────────────────── */
.seneu-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-stack-loose);
  padding: var(--space-layout-content) var(--space-inline-loose);
  width: 100%;
  font-family: var(--font-sans);
}

/* ── Icon ──────────────────────────────────────────────── */
.seneu-empty-state__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: var(--radius-circle);
  background-color: var(--color-surface-raised-hover);
  border: 1px solid var(--color-border-default);
  flex-shrink: 0;
}
.seneu-empty-state__icon {
  color: var(--color-text-muted);
}

/* ── Content ───────────────────────────────────────────── */
.seneu-empty-state__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-stack-tight);
  max-width: 22.5rem;
}
.seneu-empty-state__title {
  font-size: var(--font-size-heading-4);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-default);
  margin: 0;
  line-height: var(--line-height-tight);
}
.seneu-empty-state__desc {
  font-size: var(--font-size-body);
  color: var(--color-text-muted);
  margin: 0;
  line-height: var(--line-height-relaxed);
}

/* ── Actions ───────────────────────────────────────────── */
.seneu-empty-state__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--space-inline-tight);
}

/* ── Sizes ─────────────────────────────────────────────── */
.seneu-empty-state--sm {
  padding: var(--space-stack-loose) var(--space-inline-normal);
  gap: var(--space-stack-tight);
}
.seneu-empty-state--sm .seneu-empty-state__icon-wrap {
  width: 3rem;
  height: 3rem;
}
.seneu-empty-state--sm .seneu-empty-state__content { gap: var(--space-inline-tight); }
.seneu-empty-state--sm .seneu-empty-state__title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
}
.seneu-empty-state--sm .seneu-empty-state__desc { font-size: var(--font-size-small); }

.seneu-empty-state--lg {
  padding: var(--space-layout-section) var(--space-layout-content);
  gap: var(--space-layout-content);
}
.seneu-empty-state--lg .seneu-empty-state__icon-wrap {
  width: 6rem;
  height: 6rem;
}
.seneu-empty-state--lg .seneu-empty-state__content { max-width: 27.5rem; }
.seneu-empty-state--lg .seneu-empty-state__title { font-size: var(--font-size-heading-3); }
.seneu-empty-state--lg .seneu-empty-state__desc { font-size: var(--font-size-lead); }
</style>
