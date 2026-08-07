<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, useId } from 'vue'
import SeneuIcon from '../display/SeneuIcon.vue'

/**
 * Primary app navigation. Renders as a collapsible rail on desktop, a
 * locked icon-only rail on tablet, and an off-canvas drawer (opened via a
 * built-in hamburger trigger) on mobile — all from the same `sections`
 * data, no separate markup needed per breakpoint. A bottom tab bar isn't
 * used on mobile since CMS nav trees can have far more items than a tab
 * bar can reasonably hold.
 */
const props = defineProps({
  /** Collapses the desktop rail to icon-only width. Use with v-model:collapsed. */
  collapsed: {
    type: Boolean,
    default: false,
  },
  /** Whether the mobile drawer is open. Use with v-model:mobileOpen. */
  mobileOpen: {
    type: Boolean,
    default: false,
  },
  /**
   * Nav structure: an array of sections, each with an optional label and
   * a list of items. An item becomes an expandable group when it has
   * `children`. Item shape: { id, label, icon, href?, active?, disabled?,
   * badge?, badgeVariant?, children?: [{ id, label, icon?, href?, active?, disabled? }] }
   */
  sections: {
    type: Array,
    default: () => [],
  },
  brandName: {
    type: String,
    default: 'Brand',
  },
  brandIcon: {
    type: String,
    default: 'apps',
  },
  brandHref: {
    type: String,
    default: '#',
  },
  /** Shows the desktop collapse/expand toggle button */
  showCollapseToggle: {
    type: Boolean,
    default: true,
  },
  /** Shows the built-in floating hamburger button that opens the mobile drawer */
  showMobileTrigger: {
    type: Boolean,
    default: true,
  },
  mobileTriggerLabel: {
    type: String,
    default: 'Open navigation menu',
  },
  ariaLabel: {
    type: String,
    default: 'Main navigation',
  },
  /** Shows shimmer placeholders instead of nav data */
  loading: {
    type: Boolean,
    default: false,
  },
  /** Forces mobile layout (hamburger + off-canvas drawer) regardless of viewport — for docs/demo previews only */
  forceMobile: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:collapsed', 'update:mobileOpen', 'item-click', 'brand-click'])

const _uid = useId()
const sidebarId = computed(() => props.id || _uid)

// ─── Viewport detection ─────────────────────────────────────────────────────
// Needed because label/badge/chevron nodes are conditionally rendered (v-if)
// rather than just hidden via CSS — a desktop-collapsed rail (collapsed=true)
// would otherwise have no label nodes left for the mobile media query to
// reveal once the drawer opens. effectiveCollapsed forces them back.
const isNarrowViewport = ref(false)
let mql = null
function syncViewport(e) {
  isNarrowViewport.value = e.matches
}
onMounted(() => {
  if (typeof window === 'undefined' || !window.matchMedia) return
  mql = window.matchMedia('(max-width: 767px)')
  isNarrowViewport.value = mql.matches
  mql.addEventListener('change', syncViewport)
})
onBeforeUnmount(() => {
  mql?.removeEventListener('change', syncViewport)
})

const isMobileMode = computed(() => props.forceMobile || isNarrowViewport.value)
const effectiveCollapsed = computed(() => (isMobileMode.value ? false : props.collapsed))

// ─── Expandable group state ────────────────────────────────────────────────
const openGroups = ref(new Set())

watch(
  () => props.sections,
  (sections) => {
    for (const section of sections) {
      for (const item of section.items || []) {
        if (item.children?.some(c => c.active)) openGroups.value.add(item.id)
      }
    }
  },
  { immediate: true, deep: true },
)

function isGroupOpen(id) {
  return openGroups.value.has(id)
}
function toggleGroup(id) {
  if (openGroups.value.has(id)) openGroups.value.delete(id)
  else openGroups.value.add(id)
}

function handleItemClick(item) {
  if (item.disabled) return
  emit('item-click', item)
  if (props.mobileOpen) closeMobile()
}

function toggleCollapse() {
  emit('update:collapsed', !props.collapsed)
}

function openMobile() {
  emit('update:mobileOpen', true)
}
function closeMobile() {
  emit('update:mobileOpen', false)
}

// ─── Mobile drawer: Escape to close + focus management ─────────────────────
const asideRef = ref(null)
let lastFocused = null

function onKeydown(e) {
  if (e.key === 'Escape' && props.mobileOpen) closeMobile()
}

watch(
  () => props.mobileOpen,
  async (open) => {
    if (open) {
      lastFocused = document.activeElement
      await nextTick()
      asideRef.value?.querySelector('a, button, [tabindex]')?.focus()
    } else if (lastFocused) {
      lastFocused.focus?.()
      lastFocused = null
    }
  },
)

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <!-- Mobile hamburger trigger — hidden at >=768px via CSS, always visible when forceMobile -->
  <button
    v-if="showMobileTrigger"
    type="button"
    class="seneu-sidebar__mobile-trigger"
    :class="{ 'seneu-sidebar__mobile-trigger--forced': forceMobile }"
    :aria-label="mobileTriggerLabel"
    aria-haspopup="true"
    :aria-expanded="mobileOpen"
    :aria-controls="sidebarId"
    @click="openMobile"
  >
    <SeneuIcon name="menu" :size="22" />
  </button>

  <!-- Backdrop -->
  <Transition name="seneu-sidebar-backdrop">
    <div
      v-if="mobileOpen"
      class="seneu-sidebar__backdrop"
      :class="{ 'seneu-sidebar__backdrop--forced': forceMobile }"
      @click="closeMobile"
    />
  </Transition>

  <!-- Rail (desktop/tablet) / drawer (mobile) -->
  <aside
    :id="sidebarId"
    ref="asideRef"
    class="seneu-sidebar"
    :class="{
      'seneu-sidebar--collapsed': effectiveCollapsed,
      'seneu-sidebar--mobile-open': mobileOpen,
      'seneu-sidebar--force-mobile': forceMobile,
    }"
    role="navigation"
    :aria-label="ariaLabel"
  >
    <div class="seneu-sidebar__header">
      <slot name="brand">
        <a
          class="seneu-sidebar__brand"
          :href="brandHref"
          @click.prevent="emit('brand-click')"
        >
          <SeneuIcon :name="brandIcon" :size="26" class="seneu-sidebar__brand-icon" />
          <Transition name="seneu-sidebar-fade">
            <span v-if="!effectiveCollapsed" class="seneu-sidebar__brand-name">{{ brandName }}</span>
          </Transition>
        </a>
      </slot>

      <button
        v-if="showCollapseToggle"
        type="button"
        class="seneu-sidebar__collapse-btn"
        :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        :aria-expanded="!collapsed"
        :aria-controls="sidebarId"
        @click="toggleCollapse"
      >
        <SeneuIcon :name="collapsed ? 'chevron_right' : 'chevron_left'" :size="18" />
      </button>

      <button
        type="button"
        class="seneu-sidebar__mobile-close-btn"
        aria-label="Close navigation"
        @click="closeMobile"
      >
        <SeneuIcon name="close" :size="20" />
      </button>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="seneu-sidebar__nav" aria-hidden="true">
      <div class="seneu-sidebar__skeleton-group">
        <span
          v-for="n in 8"
          :key="n"
          class="seneu-sidebar__skeleton-row"
          :style="{ width: n % 3 === 0 ? '70%' : '100%' }"
        />
      </div>
    </div>

    <!-- Nav -->
    <nav v-else class="seneu-sidebar__nav">
      <div v-if="!sections.length" class="seneu-sidebar__empty">
        <SeneuIcon name="inbox" :size="22" class="seneu-sidebar__empty-icon" />
        <Transition name="seneu-sidebar-fade">
          <span v-if="!effectiveCollapsed" class="seneu-sidebar__empty-text">No navigation items yet</span>
        </Transition>
      </div>

      <div v-for="(section, sIdx) in sections" :key="section.label || sIdx" class="seneu-sidebar__section">
        <Transition name="seneu-sidebar-fade">
          <p v-if="section.label && !effectiveCollapsed" class="seneu-sidebar__section-label">{{ section.label }}</p>
        </Transition>

        <template v-for="item in section.items" :key="item.id">
          <!-- Leaf item -->
          <a
            v-if="!item.children"
            :href="item.disabled ? undefined : (item.href || '#')"
            class="seneu-sidebar__item"
            :class="{
              'seneu-sidebar__item--active': item.active,
              'seneu-sidebar__item--disabled': item.disabled,
            }"
            :aria-disabled="item.disabled || undefined"
            :aria-current="item.active ? 'page' : undefined"
            :title="effectiveCollapsed ? item.label : undefined"
            @click.prevent="handleItemClick(item)"
          >
            <SeneuIcon v-if="item.icon" :name="item.icon" :size="20" class="seneu-sidebar__item-icon" />
            <Transition name="seneu-sidebar-fade">
              <span v-if="!effectiveCollapsed" class="seneu-sidebar__item-label">{{ item.label }}</span>
            </Transition>
            <Transition name="seneu-sidebar-fade">
              <span
                v-if="item.badge != null && !effectiveCollapsed"
                class="seneu-sidebar__badge"
                :class="`seneu-sidebar__badge--${item.badgeVariant || 'brand'}`"
              >{{ item.badge }}</span>
            </Transition>
          </a>

          <!-- Expandable group -->
          <div v-else class="seneu-sidebar__group">
            <button
              type="button"
              class="seneu-sidebar__item seneu-sidebar__group-header"
              :class="{
                'seneu-sidebar__item--active': item.children.some(c => c.active),
                'seneu-sidebar__item--disabled': item.disabled,
              }"
              :disabled="item.disabled"
              :aria-expanded="isGroupOpen(item.id) || effectiveCollapsed"
              :title="effectiveCollapsed ? item.label : undefined"
              @click="toggleGroup(item.id)"
            >
              <SeneuIcon v-if="item.icon" :name="item.icon" :size="20" class="seneu-sidebar__item-icon" />
              <Transition name="seneu-sidebar-fade">
                <span v-if="!effectiveCollapsed" class="seneu-sidebar__item-label">{{ item.label }}</span>
              </Transition>
              <Transition name="seneu-sidebar-fade">
                <SeneuIcon
                  v-if="!effectiveCollapsed"
                  name="expand_more"
                  :size="18"
                  class="seneu-sidebar__chevron"
                  :class="{ 'seneu-sidebar__chevron--open': isGroupOpen(item.id) }"
                />
              </Transition>
            </button>

            <Transition name="seneu-sidebar-expand">
              <ul
                v-if="isGroupOpen(item.id) || effectiveCollapsed"
                class="seneu-sidebar__children"
                :class="{ 'seneu-sidebar__children--collapsed': effectiveCollapsed }"
              >
                <li v-for="child in item.children" :key="child.id">
                  <a
                    :href="child.disabled ? undefined : (child.href || '#')"
                    class="seneu-sidebar__item seneu-sidebar__item--child"
                    :class="{
                      'seneu-sidebar__item--active': child.active,
                      'seneu-sidebar__item--disabled': child.disabled,
                    }"
                    :aria-disabled="child.disabled || undefined"
                    :aria-current="child.active ? 'page' : undefined"
                    :title="effectiveCollapsed ? child.label : undefined"
                    @click.prevent="handleItemClick(child)"
                  >
                    <SeneuIcon
                      v-if="effectiveCollapsed"
                      :name="child.icon || 'fiber_manual_record'"
                      :size="16"
                      class="seneu-sidebar__item-icon"
                    />
                    <span v-else class="seneu-sidebar__item-dot" aria-hidden="true" />
                    <Transition name="seneu-sidebar-fade">
                      <span v-if="!effectiveCollapsed" class="seneu-sidebar__item-label">{{ child.label }}</span>
                    </Transition>
                  </a>
                </li>
              </ul>
            </Transition>
          </div>
        </template>
      </div>
    </nav>

    <!--
      Footer slot: wrap any text label in your content with class
      "seneu-sidebar__footer-label" so it auto-hides when the rail
      collapses to icon-only width (desktop collapsed state and tablet lock).
    -->
    <div v-if="$slots.footer" class="seneu-sidebar__footer">
      <slot name="footer" />
    </div>
  </aside>
</template>

<style>
/* ── Rail shell ──────────────────────────────────────── */
.seneu-sidebar {
  display: flex;
  flex-direction: column;
  width: 260px;
  height: 100%;
  background-color: var(--color-surface-raised);
  border-right: 1px solid var(--color-border-default);
  box-shadow: var(--elevation-sticky);
  overflow-x: hidden;
  flex-shrink: 0;
  transition: width var(--duration-normal) var(--easing-standard);
}
.seneu-sidebar--collapsed { width: 72px; }

/* ── Header / brand ──────────────────────────────────── */
.seneu-sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-inline-normal);
  padding: var(--space-component-padding-block) var(--space-component-padding-inline);
  height: 60px;
  border-bottom: 1px solid var(--color-border-default);
  flex-shrink: 0;
}
.seneu-sidebar--collapsed .seneu-sidebar__header { justify-content: center; }

.seneu-sidebar__brand {
  display: flex;
  align-items: center;
  gap: var(--space-inline-normal);
  text-decoration: none;
  overflow: hidden;
  min-width: 0;
}
.seneu-sidebar--collapsed .seneu-sidebar__brand { display: none; }

.seneu-sidebar__brand-icon { color: var(--color-text-brand); flex-shrink: 0; }
.seneu-sidebar__brand-name {
  font-family: var(--font-sans);
  font-size: var(--font-size-lead);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-default);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.seneu-sidebar__collapse-btn,
.seneu-sidebar__mobile-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-element);
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color var(--duration-fast) var(--easing-standard),
              color var(--duration-fast) var(--easing-standard);
}
.seneu-sidebar__mobile-close-btn { display: none; }
.seneu-sidebar__collapse-btn:hover,
.seneu-sidebar__mobile-close-btn:hover {
  background-color: var(--color-surface-raised-hover);
  color: var(--color-text-default);
}
.seneu-sidebar__collapse-btn:focus-visible,
.seneu-sidebar__mobile-close-btn:focus-visible,
.seneu-sidebar__mobile-trigger:focus-visible,
.seneu-sidebar__item:focus-visible,
.seneu-sidebar__brand:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: -2px;
}

/* ── Nav ─────────────────────────────────────────────── */
.seneu-sidebar__nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--space-inline-normal) 0;
}
.seneu-sidebar__section { padding: var(--space-inline-tight) 0; }
.seneu-sidebar__section + .seneu-sidebar__section {
  border-top: 1px solid var(--color-border-muted);
  margin-top: var(--space-inline-tight);
  padding-top: var(--space-stack-tight);
}
.seneu-sidebar__section-label {
  font-family: var(--font-sans);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
  color: var(--color-text-muted);
  padding: var(--space-inline-tight) var(--space-component-padding-inline);
  margin: 0 0 var(--space-inline-tight) 0;
  white-space: nowrap;
}

/* ── Empty state ─────────────────────────────────────── */
.seneu-sidebar__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-stack-tight);
  padding: var(--space-layout-content) var(--space-component-padding-inline);
  color: var(--color-text-muted);
  text-align: center;
}
.seneu-sidebar__empty-icon { color: var(--color-text-disabled); }
.seneu-sidebar__empty-text {
  font-family: var(--font-sans);
  font-size: var(--font-size-small);
}

/* ── Items & group headers ───────────────────────────── */
.seneu-sidebar__item,
.seneu-sidebar__group-header {
  display: flex;
  align-items: center;
  gap: var(--space-inline-normal);
  width: calc(100% - (2 * var(--space-inline-tight)));
  box-sizing: border-box;
  padding: 6px var(--space-component-padding-inline);
  margin: 1px var(--space-inline-tight);
  border-radius: var(--radius-element);
  font-family: var(--font-sans);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-muted);
  background: transparent;
  border: none;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-align: left;
  transition: background-color var(--duration-fast) var(--easing-standard),
              color var(--duration-fast) var(--easing-standard);
}
.seneu-sidebar--collapsed .seneu-sidebar__item,
.seneu-sidebar--collapsed .seneu-sidebar__group-header {
  justify-content: center;
  width: 40px;
  padding: 6px 0;
  margin: 1px auto;
}
.seneu-sidebar__item:hover:not(.seneu-sidebar__item--disabled),
.seneu-sidebar__group-header:hover:not(.seneu-sidebar__item--disabled) {
  background-color: var(--color-surface-raised-hover);
  color: var(--color-text-default);
}
.seneu-sidebar__item:active:not(.seneu-sidebar__item--disabled),
.seneu-sidebar__group-header:active:not(.seneu-sidebar__item--disabled) {
  background-color: var(--color-surface-raised-active);
}
.seneu-sidebar__item--active {
  background-color: var(--color-surface-brand-subtle);
  color: var(--color-text-brand);
  font-weight: var(--font-weight-semibold);
}
.seneu-sidebar__item--disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
  pointer-events: none;
  opacity: var(--opacity-disabled);
}
.seneu-sidebar__item--child { padding-left: calc(var(--space-component-padding-inline) + 26px); }

.seneu-sidebar__item-icon { flex-shrink: 0; transition: color var(--duration-fast) var(--easing-standard); }
.seneu-sidebar__item-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
.seneu-sidebar__item-dot {
  width: 4px;
  height: 4px;
  border-radius: var(--radius-circle);
  background-color: currentColor;
  flex-shrink: 0;
}
.seneu-sidebar__chevron {
  color: var(--color-text-muted);
  transition: transform var(--duration-normal) var(--easing-standard);
  flex-shrink: 0;
  margin-left: auto;
}
.seneu-sidebar__chevron--open { transform: rotate(180deg); }

/* ── Badges ──────────────────────────────────────────── */
.seneu-sidebar__badge {
  flex-shrink: 0;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  border-radius: var(--radius-pill);
  font-family: var(--font-sans);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  line-height: 18px;
  text-align: center;
}
.seneu-sidebar__badge--brand   { background-color: var(--color-surface-brand);   color: var(--color-text-on-brand); }
.seneu-sidebar__badge--danger  { background-color: var(--color-surface-danger);  color: var(--color-text-on-danger); }
.seneu-sidebar__badge--success { background-color: var(--color-surface-success); color: var(--color-text-on-success); }
.seneu-sidebar__badge--muted   { background-color: var(--color-surface-raised-hover); color: var(--color-text-muted); }

/* ── Children list ───────────────────────────────────── */
.seneu-sidebar__children { list-style: none; margin: 0; padding: 0; overflow: hidden; }
.seneu-sidebar__children--collapsed .seneu-sidebar__item--child { padding-left: 0; }

/* ── Footer slot ─────────────────────────────────────── */
.seneu-sidebar__footer {
  flex-shrink: 0;
  padding: var(--space-component-padding-block) var(--space-component-padding-inline);
  border-top: 1px solid var(--color-border-default);
}
.seneu-sidebar--collapsed .seneu-sidebar__footer-label { display: none; }

/* ── Skeleton (loading) ──────────────────────────────── */
.seneu-sidebar__skeleton-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-stack-normal);
  padding: 0 var(--space-component-padding-inline);
}
.seneu-sidebar__skeleton-row {
  height: 14px;
  border-radius: var(--radius-subtle);
  background: linear-gradient(
    90deg,
    var(--color-surface-raised-hover) 25%,
    var(--color-surface-raised-active) 50%,
    var(--color-surface-raised-hover) 75%
  );
  background-size: 200% 100%;
  animation: seneu-sidebar-shimmer 1.5s ease-in-out infinite;
}
.seneu-sidebar--collapsed .seneu-sidebar__skeleton-row { width: 24px !important; margin: 0 auto; }

@keyframes seneu-sidebar-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Transitions ─────────────────────────────────────── */
.seneu-sidebar-expand-enter-active,
.seneu-sidebar-expand-leave-active {
  transition: max-height var(--duration-normal) var(--easing-standard),
              opacity var(--duration-normal) var(--easing-standard);
  max-height: 600px;
  overflow: hidden;
}
.seneu-sidebar-expand-enter-from,
.seneu-sidebar-expand-leave-to { max-height: 0; opacity: 0; }

.seneu-sidebar-fade-enter-active {
  transition: opacity var(--duration-fast) var(--easing-enter),
              transform var(--duration-fast) var(--easing-enter);
}
.seneu-sidebar-fade-leave-active {
  transition: opacity var(--duration-fast) var(--easing-exit),
              transform var(--duration-fast) var(--easing-exit);
  position: absolute;
}
.seneu-sidebar-fade-enter-from,
.seneu-sidebar-fade-leave-to { opacity: 0; transform: translateX(-6px); }

.seneu-sidebar-backdrop-enter-active,
.seneu-sidebar-backdrop-leave-active {
  transition: opacity var(--duration-normal) var(--easing-standard);
}
.seneu-sidebar-backdrop-enter-from,
.seneu-sidebar-backdrop-leave-to { opacity: 0; }

/* ── Mobile hamburger trigger ─────────────────────────── */
.seneu-sidebar__mobile-trigger {
  display: none;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: var(--space-inline-normal);
  left: var(--space-inline-normal);
  width: 40px;
  height: 40px;
  border-radius: var(--radius-element);
  border: 1px solid var(--color-border-default);
  background-color: var(--color-surface-raised);
  color: var(--color-text-default);
  box-shadow: var(--elevation-floating);
  cursor: pointer;
  z-index: var(--z-index-overlay);
  transition: background-color var(--duration-fast) var(--easing-standard);
}
.seneu-sidebar__mobile-trigger:hover { background-color: var(--color-surface-raised-hover); }
.seneu-sidebar__mobile-trigger--forced { display: flex; }

/* ── Backdrop ──────────────────────────────────────────── */
.seneu-sidebar__backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background-color: color-mix(in srgb, var(--primitive-color-neutral-950) 50%, transparent);
  z-index: var(--z-index-overlay-backdrop);
}
.seneu-sidebar__backdrop--forced { display: block; }

/* ── Tablet: lock to icon-only rail ──────────────────── */
@media (max-width: 1023px) and (min-width: 768px) {
  .seneu-sidebar { width: 72px; }
  .seneu-sidebar__header { justify-content: center; }
  .seneu-sidebar__brand { display: none; }
  .seneu-sidebar__collapse-btn { display: none; }
  .seneu-sidebar__section-label { display: none; }
  .seneu-sidebar__item,
  .seneu-sidebar__group-header {
    justify-content: center;
    width: 40px;
    padding: 6px 0;
    margin: 1px auto;
  }
  .seneu-sidebar__item-label,
  .seneu-sidebar__badge,
  .seneu-sidebar__chevron { display: none; }
  .seneu-sidebar__children { display: none; }
  .seneu-sidebar__skeleton-row { width: 24px !important; margin: 0 auto; }
}

/* ── Mobile: off-canvas drawer, opened via hamburger trigger ── */
@media (max-width: 767px) {
  .seneu-sidebar__mobile-trigger { display: flex; }
  .seneu-sidebar__backdrop { display: block; }

  .seneu-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 280px !important;
    max-width: 84vw;
    z-index: var(--z-index-overlay);
    box-shadow: var(--elevation-overlay);
    transform: translateX(-100%);
    transition: transform var(--duration-normal) var(--easing-standard);
  }
  .seneu-sidebar--mobile-open { transform: translateX(0); }

  .seneu-sidebar__collapse-btn { display: none; }
  .seneu-sidebar__mobile-close-btn { display: flex; }
}

/*
  forceMobile (docs/demo preview only) — mirrors the @media (max-width: 767px)
  block above so the mobile drawer can be previewed without shrinking the
  viewport. Keep in sync with the block above.
*/
.seneu-sidebar--force-mobile {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px !important;
  max-width: 84vw;
  z-index: var(--z-index-overlay);
  box-shadow: var(--elevation-overlay);
  transform: translateX(-100%);
  transition: transform var(--duration-normal) var(--easing-standard);
}
.seneu-sidebar--force-mobile.seneu-sidebar--mobile-open { transform: translateX(0); }
.seneu-sidebar--force-mobile .seneu-sidebar__collapse-btn { display: none; }
.seneu-sidebar--force-mobile .seneu-sidebar__mobile-close-btn { display: flex; }
</style>
