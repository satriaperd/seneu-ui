<script setup>
import { ref, computed } from 'vue'
import SeneuIcon from '../display/SeneuIcon.vue'

/**
 * Tab strip following the WAI-ARIA tabs pattern with automatic activation:
 * arrow keys move focus and select in one step, Home/End jump to the
 * first/last enabled tab. Renders the tab list only — pair with your own
 * panel markup and optionally set `panelId` on each tab for aria-controls.
 */
const props = defineProps({
  /** Active tab id. Use with v-model. */
  modelValue: {
    type: String,
    default: '',
  },
  /** Array of { id, label, icon?, count?, disabled?, panelId? } */
  tabs: {
    type: Array,
    default: () => [],
  },
  variant: {
    type: String,
    default: 'line',
    validator: v => ['line', 'pill', 'boxed'].includes(v),
  },
  size: {
    type: String,
    default: 'base',
    validator: v => ['sm', 'base', 'lg'].includes(v),
  },
  /** Stretches tabs to fill the available width evenly */
  fullWidth: {
    type: Boolean,
    default: false,
  },
  /** Shows shimmer placeholders instead of tabs */
  loading: {
    type: Boolean,
    default: false,
  },
  ariaLabel: {
    type: String,
    default: 'Tabs',
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const iconSize = computed(() => ({ sm: 16, base: 18, lg: 20 }[props.size]))

const tabRefs = ref([])
function setTabRef(el, index) {
  if (el) tabRefs.value[index] = el
}

function isActive(tab) {
  return props.modelValue === tab.id
}

function selectTab(tab) {
  if (tab.disabled || tab.id === props.modelValue) return
  emit('change', { from: props.modelValue, to: tab.id })
  emit('update:modelValue', tab.id)
}

function nextEnabledIndex(fromIndex, direction) {
  const n = props.tabs.length
  let i = fromIndex
  for (let step = 0; step < n; step++) {
    i = (i + direction + n) % n
    if (!props.tabs[i].disabled) return i
  }
  return fromIndex
}

function onKeydown(e, index) {
  let nextIndex
  if (e.key === 'ArrowRight') nextIndex = nextEnabledIndex(index, 1)
  else if (e.key === 'ArrowLeft') nextIndex = nextEnabledIndex(index, -1)
  else if (e.key === 'Home') nextIndex = nextEnabledIndex(-1, 1)
  else if (e.key === 'End') nextIndex = nextEnabledIndex(props.tabs.length, -1)
  else return

  e.preventDefault()
  tabRefs.value[nextIndex]?.focus()
  selectTab(props.tabs[nextIndex])
}

function tabIndexFor(tab, index) {
  if (props.modelValue) return tab.id === props.modelValue ? 0 : -1
  return index === 0 ? 0 : -1
}
</script>

<template>
  <div
    class="seneu-tabs"
    :class="[`seneu-tabs--${variant}`, `seneu-tabs--${size}`, { 'seneu-tabs--full-width': fullWidth }]"
    role="tablist"
    :aria-label="ariaLabel"
  >
    <template v-if="loading">
      <span v-for="n in 4" :key="n" class="seneu-tabs__skeleton" aria-hidden="true" />
    </template>

    <template v-else>
      <button
        v-for="(tab, index) in tabs"
        :key="tab.id"
        :ref="el => setTabRef(el, index)"
        type="button"
        class="seneu-tab"
        :class="{
          'seneu-tab--active': isActive(tab),
          'seneu-tab--disabled': tab.disabled,
        }"
        role="tab"
        :aria-selected="isActive(tab)"
        :aria-controls="tab.panelId || undefined"
        :disabled="tab.disabled"
        :tabindex="tabIndexFor(tab, index)"
        @click="selectTab(tab)"
        @keydown="onKeydown($event, index)"
      >
        <SeneuIcon v-if="tab.icon" :name="tab.icon" :size="iconSize" class="seneu-tab__icon" />
        <span class="seneu-tab__label">{{ tab.label }}</span>
        <span
          v-if="tab.count != null"
          class="seneu-tab__badge"
          :class="{ 'seneu-tab__badge--active': isActive(tab) }"
        >{{ tab.count > 99 ? '99+' : tab.count }}</span>
      </button>
    </template>
  </div>
</template>

<style>
/* ── Shell ─────────────────────────────────────────────── */
.seneu-tabs {
  display: flex;
  align-items: flex-end;
  overflow-x: auto;
  scrollbar-width: none;
  font-family: var(--font-sans);
}
.seneu-tabs::-webkit-scrollbar { display: none; }
.seneu-tabs--full-width .seneu-tab { flex: 1; justify-content: center; }

/* ── Line variant ──────────────────────────────────────── */
.seneu-tabs--line { border-bottom: 2px solid var(--color-border-default); }
.seneu-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-sans);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: color var(--duration-fast) var(--easing-standard),
              background-color var(--duration-fast) var(--easing-standard),
              border-color var(--duration-fast) var(--easing-standard);
}
.seneu-tabs--line .seneu-tab {
  padding: 8px 16px;
  font-size: var(--font-size-small);
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
}
.seneu-tabs--line .seneu-tab:hover:not(.seneu-tab--active):not(.seneu-tab--disabled) {
  color: var(--color-text-default);
  background-color: var(--color-surface-raised-hover);
}
.seneu-tabs--line .seneu-tab--active {
  color: var(--color-text-brand);
  border-bottom-color: var(--color-surface-brand);
  font-weight: var(--font-weight-semibold);
}

/* ── Pill variant ──────────────────────────────────────── */
.seneu-tabs--pill {
  display: inline-flex;
  gap: 4px;
  background-color: var(--color-surface-default);
  border: 1px solid var(--color-border-muted);
  padding: 4px;
  border-radius: var(--radius-container);
}
.seneu-tabs--pill .seneu-tab {
  padding: 6px 16px;
  border-radius: var(--radius-element);
  font-size: var(--font-size-small);
}
.seneu-tabs--pill .seneu-tab:hover:not(.seneu-tab--active):not(.seneu-tab--disabled) {
  color: var(--color-text-default);
  background-color: var(--color-surface-raised-hover);
}
.seneu-tabs--pill .seneu-tab--active {
  background-color: var(--color-surface-raised);
  color: var(--color-text-default);
  font-weight: var(--font-weight-semibold);
  box-shadow: var(--elevation-surface);
}

/* ── Boxed variant ─────────────────────────────────────── */
.seneu-tabs--boxed { border-bottom: 1px solid var(--color-border-default); gap: 4px; }
.seneu-tabs--boxed .seneu-tab {
  padding: 8px 16px;
  font-size: var(--font-size-small);
  border: 1px solid transparent;
  border-bottom: none;
  border-radius: var(--radius-element) var(--radius-element) 0 0;
}
.seneu-tabs--boxed .seneu-tab:hover:not(.seneu-tab--active):not(.seneu-tab--disabled) {
  color: var(--color-text-default);
  background-color: var(--color-surface-raised-hover);
  border-color: var(--color-border-muted);
}
.seneu-tabs--boxed .seneu-tab--active {
  color: var(--color-text-default);
  font-weight: var(--font-weight-semibold);
  background-color: var(--color-surface-raised);
  border-color: var(--color-border-default);
  border-bottom-color: var(--color-surface-raised);
  margin-bottom: -1px;
  padding-bottom: 9px;
}

/* ── Icon, label, badge ────────────────────────────────── */
.seneu-tab__icon { flex-shrink: 0; }
.seneu-tab__label { overflow: hidden; text-overflow: ellipsis; }
.seneu-tab__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: var(--radius-pill);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  background-color: var(--color-surface-raised-hover);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border-default);
  line-height: 1;
  transition: background-color var(--duration-fast) var(--easing-standard),
              color var(--duration-fast) var(--easing-standard);
}
.seneu-tab__badge--active {
  background-color: var(--color-surface-brand-subtle);
  color: var(--color-text-brand);
  border-color: transparent;
}

/* ── States ────────────────────────────────────────────── */
.seneu-tab:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}
.seneu-tab:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: -2px;
  border-radius: var(--radius-subtle);
}

/* ── Skeleton (loading) ────────────────────────────────── */
.seneu-tabs__skeleton {
  display: block;
  width: 84px;
  height: 32px;
  border-radius: var(--radius-element);
  flex-shrink: 0;
  background: linear-gradient(
    90deg,
    var(--color-surface-raised-hover) 25%,
    var(--color-surface-raised-active) 50%,
    var(--color-surface-raised-hover) 75%
  );
  background-size: 200% 100%;
  animation: seneu-tabs-shimmer 1.5s ease-in-out infinite;
}
.seneu-tabs__skeleton + .seneu-tabs__skeleton { margin-left: 8px; }
@keyframes seneu-tabs-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Sizes ─────────────────────────────────────────────── */
.seneu-tabs--sm .seneu-tab { padding: 6px 12px;  font-size: var(--font-size-xs); }
.seneu-tabs--sm .seneu-tabs__skeleton { height: 26px; }
.seneu-tabs--lg .seneu-tab { padding: 10px 20px; font-size: var(--font-size-body); }
.seneu-tabs--lg .seneu-tabs__skeleton { height: 40px; }
.seneu-tabs--boxed.seneu-tabs--lg .seneu-tab--active { padding-bottom: 11px; }
.seneu-tabs--boxed.seneu-tabs--sm .seneu-tab--active { padding-bottom: 7px; }
</style>
