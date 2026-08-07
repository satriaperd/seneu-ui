<script setup>
import { ref, computed } from 'vue'
import SeneuIcon from '../display/SeneuIcon.vue'

/**
 * Path trail navigation. Router-agnostic — items with `to` render as
 * <a href> and emit `select` instead of navigating, so pair it with your
 * router's `@click` handling (e.g. router.push(item.to)).
 */
const props = defineProps({
  /** Array of { label?, to?, icon?, disabled? }. Last item = current page. */
  items: {
    type: Array,
    default: () => [],
  },
  separator: {
    type: String,
    default: 'chevron',
    validator: v => ['chevron', 'slash', 'arrow', 'dot'].includes(v),
  },
  /** Collapse middle items into an ellipsis when total items exceeds this. Omit to always show all. */
  maxItems: {
    type: Number,
    default: undefined,
  },
  size: {
    type: String,
    default: 'base',
    validator: v => ['sm', 'base', 'lg'].includes(v),
  },
  /** Shows shimmer placeholders instead of items */
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select'])

const expanded = ref(false)

const sepChar = { slash: '/', arrow: '›', dot: '·' }

const visibleItems = computed(() => {
  const tagged = props.items.map((item, i) => ({
    ...item,
    _key: i,
    _current: i === props.items.length - 1,
    _ellipsis: false,
  }))

  if (!props.maxItems || tagged.length <= props.maxItems || expanded.value) {
    return tagged
  }

  return [
    tagged[0],
    { _key: 'ellipsis', label: '', _ellipsis: true, _current: false },
    tagged[tagged.length - 1],
  ]
})

const iconSize = computed(() => ({ sm: 14, base: 16, lg: 18 }[props.size]))

function handleSelect(item, idx) {
  if (item.disabled) return
  emit('select', item, idx)
}
</script>

<template>
  <nav class="seneu-breadcrumb" :class="`seneu-breadcrumb--${size}`" aria-label="Breadcrumb">
    <ol v-if="loading" class="seneu-breadcrumb__list" aria-hidden="true">
      <li v-for="n in 3" :key="n" class="seneu-breadcrumb__li">
        <span class="seneu-breadcrumb__skeleton" :style="{ width: n === 3 ? '80px' : '56px' }" />
        <span v-if="n < 3" class="seneu-breadcrumb__sep">
          <SeneuIcon v-if="separator === 'chevron'" name="chevron_right" :size="iconSize" />
          <span v-else>{{ sepChar[separator] }}</span>
        </span>
      </li>
    </ol>

    <ol v-else class="seneu-breadcrumb__list">
      <template v-for="(entry, idx) in visibleItems" :key="entry._key">
        <li v-if="idx > 0" class="seneu-breadcrumb__sep-li" aria-hidden="true">
          <SeneuIcon v-if="separator === 'chevron'" name="chevron_right" :size="iconSize" class="seneu-breadcrumb__sep seneu-breadcrumb__sep--chevron" />
          <span v-else class="seneu-breadcrumb__sep">{{ sepChar[separator] }}</span>
        </li>

        <li v-if="entry._ellipsis" class="seneu-breadcrumb__li">
          <button
            type="button"
            class="seneu-breadcrumb__ellipsis"
            aria-label="Show all breadcrumb items"
            @click="expanded = true"
          >&hellip;</button>
        </li>

        <li v-else-if="entry.to && !entry._current && !entry.disabled" class="seneu-breadcrumb__li">
          <a
            :href="entry.to"
            class="seneu-breadcrumb__item seneu-breadcrumb__item--link"
            @click.prevent="handleSelect(entry, idx)"
          >
            <SeneuIcon v-if="entry.icon" :name="entry.icon" :size="iconSize" class="seneu-breadcrumb__icon" />
            <span v-if="entry.label">{{ entry.label }}</span>
          </a>
        </li>

        <li v-else-if="!entry._current" class="seneu-breadcrumb__li">
          <span
            class="seneu-breadcrumb__item"
            :class="entry.disabled ? 'seneu-breadcrumb__item--disabled' : 'seneu-breadcrumb__item--static'"
          >
            <SeneuIcon v-if="entry.icon" :name="entry.icon" :size="iconSize" class="seneu-breadcrumb__icon" />
            <span v-if="entry.label">{{ entry.label }}</span>
          </span>
        </li>

        <li v-else class="seneu-breadcrumb__li">
          <span class="seneu-breadcrumb__item seneu-breadcrumb__item--current" aria-current="page">
            <SeneuIcon v-if="entry.icon" :name="entry.icon" :size="iconSize" class="seneu-breadcrumb__icon" />
            <span v-if="entry.label">{{ entry.label }}</span>
          </span>
        </li>
      </template>
    </ol>
  </nav>
</template>

<style>
/* ── Base ──────────────────────────────────────────────── */
.seneu-breadcrumb { display: inline-block; max-width: 100%; }

.seneu-breadcrumb__list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
  font-family: var(--font-sans);
}
.seneu-breadcrumb__li,
.seneu-breadcrumb__sep-li {
  display: flex;
  align-items: center;
}

/* ── Items ─────────────────────────────────────────────── */
.seneu-breadcrumb__item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  padding: 2px 6px;
  border-radius: var(--radius-subtle);
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color var(--duration-fast) var(--easing-standard),
              background-color var(--duration-fast) var(--easing-standard);
}
.seneu-breadcrumb__item--link {
  color: var(--color-text-muted);
  cursor: pointer;
}
.seneu-breadcrumb__item--link:hover {
  color: var(--color-text-default);
  background-color: var(--color-surface-raised-hover);
}
.seneu-breadcrumb__item--link:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: -1px;
}
.seneu-breadcrumb__item--static {
  color: var(--color-text-muted);
  cursor: default;
}
.seneu-breadcrumb__item--disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}
.seneu-breadcrumb__item--current {
  color: var(--color-text-default);
  font-weight: var(--font-weight-semibold);
  cursor: default;
}
.seneu-breadcrumb__icon { flex-shrink: 0; }

/* ── Separator ─────────────────────────────────────────── */
.seneu-breadcrumb__sep {
  display: inline-flex;
  align-items: center;
  color: var(--color-text-disabled);
  user-select: none;
  padding: 0 2px;
  font-size: var(--font-size-small);
  line-height: 1;
}

/* ── Ellipsis ──────────────────────────────────────────── */
.seneu-breadcrumb__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1px 8px;
  border-radius: var(--radius-element);
  border: 1px solid var(--color-border-default);
  background: transparent;
  color: var(--color-text-muted);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--easing-standard),
              color var(--duration-fast) var(--easing-standard);
}
.seneu-breadcrumb__ellipsis:hover {
  background-color: var(--color-surface-raised-hover);
  color: var(--color-text-default);
}
.seneu-breadcrumb__ellipsis:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 1px;
}

/* ── Skeleton (loading) ────────────────────────────────── */
.seneu-breadcrumb__skeleton {
  display: block;
  height: 14px;
  border-radius: var(--radius-subtle);
  background: linear-gradient(
    90deg,
    var(--color-surface-raised-hover) 25%,
    var(--color-surface-raised-active) 50%,
    var(--color-surface-raised-hover) 75%
  );
  background-size: 200% 100%;
  animation: seneu-breadcrumb-shimmer 1.5s ease-in-out infinite;
}
@keyframes seneu-breadcrumb-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Sizes ─────────────────────────────────────────────── */
.seneu-breadcrumb--sm .seneu-breadcrumb__item { font-size: var(--font-size-xs);   padding: 1px 5px; }
.seneu-breadcrumb--sm .seneu-breadcrumb__sep  { font-size: var(--font-size-xs); }
.seneu-breadcrumb--lg .seneu-breadcrumb__item { font-size: var(--font-size-body); padding: 3px 7px; }
.seneu-breadcrumb--lg .seneu-breadcrumb__sep  { font-size: var(--font-size-body); }

/* ── Responsive ────────────────────────────────────────── */
@media (max-width: 767px) {
  .seneu-breadcrumb__item { max-width: 120px; }
}
</style>
