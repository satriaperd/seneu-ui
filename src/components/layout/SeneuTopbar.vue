<script setup>
import SeneuIcon from '../display/SeneuIcon.vue'

/**
 * App header bar. Renders a title (with optional section prefix), an
 * optional menu-toggle button for wiring up SeneuSidebar externally, and
 * slots for a center search field, right-side actions, and a user menu.
 * Framework/router-agnostic — pair the `menu-toggle` emit with your own
 * SeneuSidebar's `collapsed`/`mobileOpen` state.
 */
defineProps({
  title: {
    type: String,
    default: '',
  },
  /** Prefix shown before the title, e.g. "Components" → "Components / Button" */
  section: {
    type: String,
    default: '',
  },
  /** Sticks the topbar to the top of its scroll container */
  sticky: {
    type: Boolean,
    default: false,
  },
  /** Renders a bottom border */
  bordered: {
    type: Boolean,
    default: true,
  },
  /** Shows a menu-toggle button on the left — wire @menu-toggle to your sidebar */
  showMenuToggle: {
    type: Boolean,
    default: false,
  },
  menuToggleLabel: {
    type: String,
    default: 'Toggle navigation menu',
  },
  /** Shows a shimmer placeholder instead of the title */
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['menu-toggle'])
</script>

<template>
  <header
    class="seneu-topbar"
    :class="{
      'seneu-topbar--sticky': sticky,
      'seneu-topbar--bordered': bordered,
    }"
  >
    <div class="seneu-topbar__left">
      <button
        v-if="showMenuToggle"
        type="button"
        class="seneu-topbar__menu-btn"
        :aria-label="menuToggleLabel"
        @click="$emit('menu-toggle')"
      >
        <SeneuIcon name="menu" :size="22" />
      </button>

      <span v-if="loading" class="seneu-topbar__skeleton-title" aria-hidden="true" />
      <slot v-else name="title">
        <div class="seneu-topbar__title-group">
          <span v-if="section" class="seneu-topbar__section">{{ section }}</span>
          <span v-if="section" class="seneu-topbar__sep" aria-hidden="true">/</span>
          <span class="seneu-topbar__title">{{ title }}</span>
        </div>
      </slot>
    </div>

    <div v-if="$slots.search" class="seneu-topbar__center">
      <slot name="search" />
    </div>

    <div class="seneu-topbar__right">
      <slot name="actions" />
      <div v-if="$slots.user" class="seneu-topbar__user">
        <slot name="user" />
      </div>
    </div>
  </header>
</template>

<style>
/* ── Shell ─────────────────────────────────────────────── */
.seneu-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-inline-normal);
  height: 60px;
  padding: 0 var(--space-layout-content);
  background-color: var(--color-surface-raised);
  flex-shrink: 0;
}
.seneu-topbar--bordered { border-bottom: 1px solid var(--color-border-default); }
.seneu-topbar--sticky {
  position: sticky;
  top: 0;
  z-index: var(--z-index-sticky);
  box-shadow: var(--elevation-sticky);
}

/* ── Left zone ─────────────────────────────────────────── */
.seneu-topbar__left {
  display: flex;
  align-items: center;
  gap: var(--space-inline-normal);
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.seneu-topbar__menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: var(--radius-element);
  border: none;
  background: transparent;
  color: var(--color-text-default);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--easing-standard);
}
.seneu-topbar__menu-btn:hover { background-color: var(--color-surface-raised-hover); }

.seneu-topbar__title-group {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  font-family: var(--font-sans);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  overflow: hidden;
}
.seneu-topbar__section {
  color: var(--color-text-muted);
  font-weight: var(--font-weight-regular);
  white-space: nowrap;
}
.seneu-topbar__sep { color: var(--color-text-disabled); flex-shrink: 0; }
.seneu-topbar__title {
  color: var(--color-text-default);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.seneu-topbar__skeleton-title {
  display: block;
  width: 160px;
  height: 16px;
  border-radius: var(--radius-subtle);
  background: linear-gradient(
    90deg,
    var(--color-surface-raised-hover) 25%,
    var(--color-surface-raised-active) 50%,
    var(--color-surface-raised-hover) 75%
  );
  background-size: 200% 100%;
  animation: seneu-topbar-shimmer 1.5s ease-in-out infinite;
}
@keyframes seneu-topbar-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Center zone ───────────────────────────────────────── */
.seneu-topbar__center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  max-width: 420px;
}

/* ── Right zone ────────────────────────────────────────── */
.seneu-topbar__right {
  display: flex;
  align-items: center;
  gap: var(--space-inline-tight);
  flex-shrink: 0;
}
.seneu-topbar__user {
  display: flex;
  align-items: center;
  margin-left: var(--space-inline-tight);
  padding-left: var(--space-inline-normal);
  border-left: 1px solid var(--color-border-default);
}

/*
  Action button convention: wrap icon buttons slotted into #actions with
  this class to inherit the topbar's icon-button look (size, hover,
  focus-visible). Anchors and <button> both work.
*/
.seneu-topbar-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-element);
  border: none;
  background: transparent;
  color: var(--color-text-default);
  cursor: pointer;
  text-decoration: none;
  transition: background-color var(--duration-fast) var(--easing-standard),
              color var(--duration-fast) var(--easing-standard);
}
.seneu-topbar-action:hover { background-color: var(--color-surface-raised-hover); }

.seneu-topbar__menu-btn:focus-visible,
.seneu-topbar-action:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: -2px;
}

/* ── Responsive ────────────────────────────────────────── */
@media (max-width: 767px) {
  .seneu-topbar { padding: 0 var(--space-inline-normal); }
  .seneu-topbar__section,
  .seneu-topbar__sep { display: none; }
  .seneu-topbar__center { display: none; }
}
</style>
