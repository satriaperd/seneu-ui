<script setup>
import { ref, watch, useId, nextTick, onBeforeUnmount } from 'vue'
import SeneuIcon from '../display/SeneuIcon.vue'

/**
 * Blocking dialog overlay. Traps focus inside the dialog while open —
 * Tab/Shift+Tab cycle among its focusable elements — and restores
 * focus to whatever triggered it on close, per the WAI-ARIA dialog
 * (modal) pattern.
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
  size: {
    type: String,
    default: 'base',
    validator: v => ['sm', 'base', 'lg', 'xl', 'fullscreen'].includes(v),
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
const dialogRef = ref(null)
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
  if (e.key !== 'Tab' || !dialogRef.value) return

  const focusable = Array.from(dialogRef.value.querySelectorAll(FOCUSABLE_SELECTOR))
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
    const focusable = dialogRef.value?.querySelector(FOCUSABLE_SELECTOR)
    ;(focusable || dialogRef.value)?.focus()
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
    <Transition name="seneu-modal">
      <div
        v-if="modelValue"
        class="seneu-modal-overlay"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title ? titleId : undefined"
        @click.self="onBackdropClick"
        @keydown="handleKeydown"
      >
        <div ref="dialogRef" class="seneu-modal-dialog" :class="`seneu-modal-dialog--${size}`" tabindex="-1" @click.stop>
          <div class="seneu-modal__header">
            <slot name="header">
              <span :id="titleId" class="seneu-modal__title">{{ title }}</span>
              <button
                v-if="showClose"
                class="seneu-modal__close"
                type="button"
                aria-label="Close"
                @click="close"
              >
                <SeneuIcon name="close" :size="18" />
              </button>
            </slot>
          </div>

          <div class="seneu-modal__body">
            <slot />
          </div>

          <div v-if="$slots.footer" class="seneu-modal__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
/* ── Overlay (backdrop) ────────────────────────────────── */
.seneu-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-index-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-layout-content) var(--space-inline-normal);
  background-color: rgba(0, 0, 0, 0.5);
  overflow-y: auto;
}

/* ── Dialog ────────────────────────────────────────────── */
.seneu-modal-dialog {
  position: relative;
  width: 100%;
  max-width: 35rem;
  max-height: min(calc(100vh - 3rem), 84vh);
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-container);
  background-color: var(--color-surface-overlay);
  box-shadow: var(--elevation-overlay);
  overflow: hidden;
}
.seneu-modal-dialog:focus-visible { outline: none; }

/* ── Sizes ─────────────────────────────────────────────── */
.seneu-modal-dialog--sm { max-width: 25rem; }
.seneu-modal-dialog--base { max-width: 35rem; }
.seneu-modal-dialog--lg { max-width: 45rem; }
.seneu-modal-dialog--xl { max-width: 60rem; }
.seneu-modal-dialog--fullscreen {
  max-width: 100vw;
  width: 100vw;
  max-height: 100vh;
  height: 100vh;
  border-radius: 0;
  margin: 0;
}

/* ── Header ────────────────────────────────────────────── */
.seneu-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-inline-normal);
  padding: var(--space-inline-normal) var(--space-inline-loose);
  border-bottom: 1px solid var(--color-border-default);
  flex-shrink: 0;
}
.seneu-modal__title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-default);
  line-height: var(--line-height-tight);
}
.seneu-modal__close {
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
.seneu-modal__close:hover { color: var(--color-text-default); background-color: var(--color-surface-raised-hover); }
.seneu-modal__close:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

/* ── Body ──────────────────────────────────────────────── */
.seneu-modal__body {
  padding: var(--space-inline-loose);
  overflow-y: auto;
  flex: 1;
  color: var(--color-text-muted);
  font-size: var(--font-size-body);
  line-height: var(--line-height-relaxed);
}

/* ── Footer ────────────────────────────────────────────── */
.seneu-modal__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-inline-tight);
  padding: var(--space-inline-normal) var(--space-inline-loose);
  border-top: 1px solid var(--color-border-default);
  flex-shrink: 0;
}

/* ── Transition ────────────────────────────────────────── */
.seneu-modal-enter-active { transition: background-color var(--duration-normal) var(--easing-standard); }
.seneu-modal-leave-active { transition: background-color var(--duration-fast) var(--easing-standard); }
.seneu-modal-enter-active .seneu-modal-dialog {
  transition: opacity var(--duration-normal) var(--easing-standard),
              transform var(--duration-normal) var(--easing-spring);
}
.seneu-modal-leave-active .seneu-modal-dialog {
  transition: opacity var(--duration-fast) var(--easing-standard),
              transform var(--duration-fast) var(--easing-standard);
}
.seneu-modal-enter-from,
.seneu-modal-leave-to {
  background-color: transparent;
}
.seneu-modal-enter-from .seneu-modal-dialog,
.seneu-modal-leave-to .seneu-modal-dialog {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}
</style>
