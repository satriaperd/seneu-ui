<script setup>
import { useToast } from '../../composables/useToast.js'
import SeneuIcon from '../display/SeneuIcon.vue'

/**
 * Toast notification stack — the visual half of `useToast`. Mount this
 * once near your app root; every `toast.success()` / `.error()` / etc.
 * call anywhere in the app renders through this single instance.
 * Auto-dismiss pauses on hover/focus per WCAG 2.2.1 (Timing Adjustable).
 */
defineProps({
  position: {
    type: String,
    default: 'top-right',
    validator: v => [
      'top-right', 'top-left', 'top-center',
      'bottom-right', 'bottom-left', 'bottom-center',
    ].includes(v),
  },
})

const { toasts, dismiss, pause, resume } = useToast()

const ICONS = { info: 'info', success: 'check_circle', warning: 'warning', danger: 'error' }
</script>

<template>
  <Teleport to="body">
    <TransitionGroup
      tag="div"
      :name="`seneu-toast-${position}`"
      class="seneu-toast-container"
      :class="`seneu-toast-container--${position}`"
    >
      <div
        v-for="t in toasts"
        :key="t.id"
        class="seneu-toast"
        :class="`seneu-toast--${t.variant}`"
        role="alert"
        aria-live="polite"
        tabindex="0"
        @mouseenter="pause(t.id)"
        @mouseleave="resume(t.id)"
        @focusin="pause(t.id)"
        @focusout="resume(t.id)"
      >
        <SeneuIcon :name="ICONS[t.variant]" :size="18" class="seneu-toast__icon" />

        <div class="seneu-toast__body">
          <strong v-if="t.title" class="seneu-toast__title">{{ t.title }}</strong>
          <span class="seneu-toast__message">{{ t.message }}</span>
        </div>

        <button
          v-if="t.dismissible"
          class="seneu-toast__close"
          type="button"
          aria-label="Dismiss notification"
          @click="dismiss(t.id)"
        >
          <SeneuIcon name="close" :size="14" />
        </button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<style>
/* ── Container ─────────────────────────────────────────── */
.seneu-toast-container {
  position: fixed;
  z-index: var(--z-index-toast);
  display: flex;
  flex-direction: column;
  gap: var(--space-inline-tight);
  pointer-events: none;
  width: min(25rem, calc(100vw - 2rem));
}
.seneu-toast-container > * { pointer-events: auto; }

/* ── Positions ─────────────────────────────────────────── */
.seneu-toast-container--top-right    { top: 1.25rem; right: 1.25rem; }
.seneu-toast-container--top-left     { top: 1.25rem; left: 1.25rem; }
.seneu-toast-container--top-center   { top: 1.25rem; left: 50%; transform: translateX(-50%); }
.seneu-toast-container--bottom-right { bottom: 1.25rem; right: 1.25rem; flex-direction: column-reverse; }
.seneu-toast-container--bottom-left  { bottom: 1.25rem; left: 1.25rem; flex-direction: column-reverse; }
.seneu-toast-container--bottom-center{ bottom: 1.25rem; left: 50%; transform: translateX(-50%); flex-direction: column-reverse; }

/* ── Toast ─────────────────────────────────────────────── */
.seneu-toast {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--space-inline-tight);
  padding: var(--space-inline-tight) var(--space-inline-normal);
  border-radius: var(--radius-element);
  border: 1px solid var(--color-border-default);
  background-color: var(--color-surface-raised);
  box-shadow: var(--elevation-floating);
  max-width: 25rem;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  font-family: var(--font-sans);
}

/* ── Variant accent (left border) ──────────────────────── */
.seneu-toast::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background-color: var(--seneu-toast-accent);
}
.seneu-toast--info    { --seneu-toast-accent: var(--color-text-info); }
.seneu-toast--success { --seneu-toast-accent: var(--color-text-success); }
.seneu-toast--warning { --seneu-toast-accent: var(--color-text-warning); }
.seneu-toast--danger   { --seneu-toast-accent: var(--color-text-danger); }

/* ── Icon ──────────────────────────────────────────────── */
.seneu-toast__icon {
  color: var(--seneu-toast-accent);
  flex-shrink: 0;
  margin-top: 1px;
  margin-left: 2px;
}

/* ── Body ──────────────────────────────────────────────── */
.seneu-toast__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.seneu-toast__title {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-default);
  line-height: var(--line-height-normal);
}
.seneu-toast__message {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  line-height: var(--line-height-normal);
}

/* ── Close ─────────────────────────────────────────────── */
.seneu-toast__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.375rem;
  height: 1.375rem;
  flex-shrink: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-text-muted);
  border-radius: var(--radius-subtle);
  padding: 0;
  transition: color var(--duration-fast) var(--easing-standard),
              background-color var(--duration-fast) var(--easing-standard);
}
.seneu-toast__close:hover { color: var(--color-text-default); background-color: var(--color-surface-raised-hover); }
.seneu-toast__close:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 1px;
}

/* ── Transitions (direction depends on position) ──────── */
.seneu-toast-top-right-enter-active, .seneu-toast-top-right-leave-active,
.seneu-toast-top-left-enter-active, .seneu-toast-top-left-leave-active,
.seneu-toast-top-center-enter-active, .seneu-toast-top-center-leave-active,
.seneu-toast-bottom-right-enter-active, .seneu-toast-bottom-right-leave-active,
.seneu-toast-bottom-left-enter-active, .seneu-toast-bottom-left-leave-active,
.seneu-toast-bottom-center-enter-active, .seneu-toast-bottom-center-leave-active {
  transition: opacity var(--duration-normal) var(--easing-standard),
              transform var(--duration-normal) var(--easing-standard);
}
.seneu-toast-top-right-leave-active, .seneu-toast-top-left-leave-active,
.seneu-toast-top-center-leave-active, .seneu-toast-bottom-right-leave-active,
.seneu-toast-bottom-left-leave-active, .seneu-toast-bottom-center-leave-active {
  position: absolute;
  width: 100%;
}
.seneu-toast-top-right-move, .seneu-toast-top-left-move, .seneu-toast-top-center-move,
.seneu-toast-bottom-right-move, .seneu-toast-bottom-left-move, .seneu-toast-bottom-center-move {
  transition: transform var(--duration-normal) var(--easing-standard);
}

.seneu-toast-top-right-enter-from, .seneu-toast-top-right-leave-to,
.seneu-toast-bottom-right-enter-from, .seneu-toast-bottom-right-leave-to {
  opacity: 0;
  transform: translateX(1.25rem);
}
.seneu-toast-top-left-enter-from, .seneu-toast-top-left-leave-to,
.seneu-toast-bottom-left-enter-from, .seneu-toast-bottom-left-leave-to {
  opacity: 0;
  transform: translateX(-1.25rem);
}
.seneu-toast-top-center-enter-from, .seneu-toast-top-center-leave-to {
  opacity: 0;
  transform: translateY(-0.75rem);
}
.seneu-toast-bottom-center-enter-from, .seneu-toast-bottom-center-leave-to {
  opacity: 0;
  transform: translateY(0.75rem);
}
</style>
