<script setup>
import { ref, watch, useId, nextTick, onBeforeUnmount } from 'vue'
import SeneuIcon from '../display/SeneuIcon.vue'

/**
 * Off-canvas panel that slides in from an edge of the screen. Shares
 * SeneuModal's focus-trap behavior — Tab/Shift+Tab cycle inside the
 * panel while open, and focus returns to the trigger on close.
 */
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  placement: {
    type: String,
    default: 'right',
    validator: v => ['left', 'right', 'top', 'bottom'].includes(v),
  },
  size: {
    type: String,
    default: 'base',
    validator: v => ['sm', 'base', 'lg'].includes(v),
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true,
  },
  closeOnEsc: {
    type: Boolean,
    default: true,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue', 'close', 'open'])

const titleId = useId()
const panelRef = ref(null)
let lastFocused = null

const FOCUSABLE_SELECTOR = [
  'a[href]', 'button:not([disabled])', 'textarea:not([disabled])',
  'input:not([disabled])', 'select:not([disabled])', '[tabindex]:not([tabindex="-1"])',
].join(', ')

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function onBackdropClick() {
  if (props.closeOnBackdrop) close()
}

function handleKeydown(e) {
  if (e.key === 'Escape') {
    if (props.closeOnEsc) close()
    return
  }
  if (e.key !== 'Tab' || !panelRef.value) return

  const focusable = Array.from(panelRef.value.querySelectorAll(FOCUSABLE_SELECTOR))
  if (focusable.length === 0) {
    e.preventDefault()
    return
  }
  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

watch(() => props.modelValue, async (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''

  if (isOpen) {
    lastFocused = document.activeElement
    await nextTick()
    const focusable = panelRef.value?.querySelector(FOCUSABLE_SELECTOR)
    ;(focusable || panelRef.value)?.focus()
    emit('open')
  } else {
    lastFocused?.focus?.()
  }
}, { immediate: true })

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition :name="`seneu-drawer-${placement}`">
      <div
        v-if="modelValue"
        class="seneu-drawer-overlay"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title ? titleId : undefined"
        @click.self="onBackdropClick"
        @keydown="handleKeydown"
      >
        <div
          ref="panelRef"
          class="seneu-drawer-panel"
          :class="[`seneu-drawer-panel--${placement}`, `seneu-drawer-panel--${size}`]"
          tabindex="-1"
          @click.stop
        >
          <div class="seneu-drawer__header">
            <slot name="header">
              <span :id="titleId" class="seneu-drawer__title">{{ title }}</span>
              <button
                v-if="showClose"
                class="seneu-drawer__close"
                type="button"
                aria-label="Close"
                @click="close"
              >
                <SeneuIcon name="close" :size="18" />
              </button>
            </slot>
          </div>

          <div class="seneu-drawer__body">
            <slot />
          </div>

          <div v-if="$slots.footer" class="seneu-drawer__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
/* ── Overlay ───────────────────────────────────────────── */
.seneu-drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-index-overlay);
  background-color: rgba(0, 0, 0, 0.5);
}

/* ── Panel ─────────────────────────────────────────────── */
.seneu-drawer-panel {
  position: absolute;
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface-overlay);
  box-shadow: var(--elevation-overlay);
  overflow: hidden;
}
.seneu-drawer-panel:focus-visible { outline: none; }

/* ── Placement ─────────────────────────────────────────── */
.seneu-drawer-panel--right  { top: 0; right: 0; bottom: 0; height: 100%; }
.seneu-drawer-panel--left   { top: 0; left: 0;  bottom: 0; height: 100%; }
.seneu-drawer-panel--top    { top: 0; left: 0;  right: 0;  width: 100%; }
.seneu-drawer-panel--bottom { bottom: 0; left: 0; right: 0; width: 100%; }

/* ── Sizes (horizontal: width; vertical: max-height) ──── */
.seneu-drawer-panel--right.seneu-drawer-panel--sm,
.seneu-drawer-panel--left.seneu-drawer-panel--sm    { width: 17.5rem; }
.seneu-drawer-panel--right.seneu-drawer-panel--base,
.seneu-drawer-panel--left.seneu-drawer-panel--base  { width: 25rem; }
.seneu-drawer-panel--right.seneu-drawer-panel--lg,
.seneu-drawer-panel--left.seneu-drawer-panel--lg    { width: 35rem; }

.seneu-drawer-panel--top.seneu-drawer-panel--sm,
.seneu-drawer-panel--bottom.seneu-drawer-panel--sm    { max-height: 17.5rem; }
.seneu-drawer-panel--top.seneu-drawer-panel--base,
.seneu-drawer-panel--bottom.seneu-drawer-panel--base  { max-height: 25rem; }
.seneu-drawer-panel--top.seneu-drawer-panel--lg,
.seneu-drawer-panel--bottom.seneu-drawer-panel--lg    { max-height: 35rem; }

/* ── Header ────────────────────────────────────────────── */
.seneu-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-inline-normal);
  padding: var(--space-inline-normal) var(--space-inline-loose);
  border-bottom: 1px solid var(--color-border-default);
  flex-shrink: 0;
}
.seneu-drawer__title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-default);
  line-height: var(--line-height-tight);
}
.seneu-drawer__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-text-muted);
  border-radius: var(--radius-element);
  padding: 0;
  transition: color var(--duration-fast) var(--easing-standard),
              background-color var(--duration-fast) var(--easing-standard);
}
.seneu-drawer__close:hover { color: var(--color-text-default); background-color: var(--color-surface-raised-hover); }
.seneu-drawer__close:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

/* ── Body ──────────────────────────────────────────────── */
.seneu-drawer__body {
  padding: var(--space-inline-loose);
  overflow-y: auto;
  flex: 1;
  color: var(--color-text-muted);
  font-size: var(--font-size-body);
  line-height: var(--line-height-relaxed);
}

/* ── Footer ────────────────────────────────────────────── */
.seneu-drawer__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-inline-tight);
  padding: var(--space-inline-normal) var(--space-inline-loose);
  border-top: 1px solid var(--color-border-default);
  flex-shrink: 0;
}

/* ── Transitions ───────────────────────────────────────── */
.seneu-drawer-right-enter-active, .seneu-drawer-right-leave-active,
.seneu-drawer-left-enter-active, .seneu-drawer-left-leave-active,
.seneu-drawer-top-enter-active, .seneu-drawer-top-leave-active,
.seneu-drawer-bottom-enter-active, .seneu-drawer-bottom-leave-active {
  transition: background-color var(--duration-normal) var(--easing-standard);
}
.seneu-drawer-right-enter-active .seneu-drawer-panel,
.seneu-drawer-left-enter-active .seneu-drawer-panel,
.seneu-drawer-top-enter-active .seneu-drawer-panel,
.seneu-drawer-bottom-enter-active .seneu-drawer-panel {
  transition: transform var(--duration-normal) var(--easing-spring);
}
.seneu-drawer-right-leave-active .seneu-drawer-panel,
.seneu-drawer-left-leave-active .seneu-drawer-panel,
.seneu-drawer-top-leave-active .seneu-drawer-panel,
.seneu-drawer-bottom-leave-active .seneu-drawer-panel {
  transition: transform var(--duration-fast) var(--easing-standard);
}

.seneu-drawer-right-enter-from, .seneu-drawer-right-leave-to,
.seneu-drawer-left-enter-from, .seneu-drawer-left-leave-to,
.seneu-drawer-top-enter-from, .seneu-drawer-top-leave-to,
.seneu-drawer-bottom-enter-from, .seneu-drawer-bottom-leave-to {
  background-color: transparent;
}

.seneu-drawer-right-enter-from .seneu-drawer-panel,
.seneu-drawer-right-leave-to .seneu-drawer-panel { transform: translateX(100%); }

.seneu-drawer-left-enter-from .seneu-drawer-panel,
.seneu-drawer-left-leave-to .seneu-drawer-panel { transform: translateX(-100%); }

.seneu-drawer-top-enter-from .seneu-drawer-panel,
.seneu-drawer-top-leave-to .seneu-drawer-panel { transform: translateY(-100%); }

.seneu-drawer-bottom-enter-from .seneu-drawer-panel,
.seneu-drawer-bottom-leave-to .seneu-drawer-panel { transform: translateY(100%); }
</style>
