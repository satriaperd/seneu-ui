<script setup>
import { ref, useId, useSlots, cloneVNode, nextTick, onBeforeUnmount } from 'vue'

/**
 * Wraps a single interactive element and shows a text bubble on
 * hover/focus. Auto-flips to the opposite side if the requested
 * placement would clip outside the viewport.
 */
const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  placement: {
    type: String,
    default: 'top',
    validator: v => ['top', 'bottom', 'left', 'right'].includes(v),
  },
  variant: {
    type: String,
    default: 'dark',
    validator: v => ['dark', 'light'].includes(v),
  },
  /** Delay before showing, in ms */
  delay: {
    type: Number,
    default: 300,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const slots = useSlots()
const tooltipId = useId()
const isVisible = ref(false)
const effectivePlacement = ref(props.placement)
const bubbleRef = ref(null)
let showTimer = null
let hideTimer = null

function measureAndFlip() {
  const el = bubbleRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  let next = props.placement
  if (props.placement === 'top' && rect.top < 0) next = 'bottom'
  else if (props.placement === 'bottom' && rect.bottom > window.innerHeight) next = 'top'
  else if (props.placement === 'left' && rect.left < 0) next = 'right'
  else if (props.placement === 'right' && rect.right > window.innerWidth) next = 'left'
  effectivePlacement.value = next
}

function scheduleShow() {
  if (props.disabled) return
  clearTimeout(hideTimer)
  showTimer = setTimeout(async () => {
    isVisible.value = true
    await nextTick()
    measureAndFlip()
  }, props.delay)
}

function scheduleHide() {
  clearTimeout(showTimer)
  hideTimer = setTimeout(() => { isVisible.value = false }, 100)
}

function hideImmediately() {
  clearTimeout(showTimer)
  clearTimeout(hideTimer)
  isVisible.value = false
}

onBeforeUnmount(() => {
  clearTimeout(showTimer)
  clearTimeout(hideTimer)
})

function renderTrigger() {
  const nodes = slots.default?.()
  if (!nodes || nodes.length !== 1) return nodes
  return cloneVNode(nodes[0], {
    'aria-describedby': isVisible.value && !props.disabled ? tooltipId : undefined,
  })
}
</script>

<template>
  <span
    class="seneu-tooltip-wrap"
    @mouseenter="scheduleShow"
    @mouseleave="scheduleHide"
    @focusin="scheduleShow"
    @focusout="scheduleHide"
    @keydown.esc="hideImmediately"
  >
    <component :is="renderTrigger" />
    <Transition :name="`seneu-tt-${effectivePlacement}`">
      <div
        v-if="isVisible && !disabled"
        :id="tooltipId"
        ref="bubbleRef"
        role="tooltip"
        class="seneu-tooltip__bubble"
        :class="[`seneu-tooltip__bubble--${effectivePlacement}`, `seneu-tooltip__bubble--${variant}`]"
      >
        <slot name="content">{{ content }}</slot>
      </div>
    </Transition>
  </span>
</template>

<style>
/* ── Wrapper ───────────────────────────────────────────── */
.seneu-tooltip-wrap {
  position: relative;
  display: inline-flex;
}

/* ── Bubble ────────────────────────────────────────────── */
.seneu-tooltip__bubble {
  position: absolute;
  z-index: var(--z-index-tooltip);
  padding: 6px 10px;
  border-radius: var(--radius-element);
  font-family: var(--font-sans);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
  white-space: normal;
  word-break: break-word;
  pointer-events: none;
  width: max-content;
  max-width: 20rem;
}

/* ── Variants ──────────────────────────────────────────── */
.seneu-tooltip__bubble--dark {
  background-color: var(--color-text-default);
  color: var(--color-surface-default);
  border: 1px solid transparent;
}
.seneu-tooltip__bubble--light {
  background-color: var(--color-surface-raised);
  color: var(--color-text-default);
  border: 1px solid var(--color-border-default);
  box-shadow: var(--elevation-raised);
}

/* ── Placements ────────────────────────────────────────── */
.seneu-tooltip__bubble--top {
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}
.seneu-tooltip__bubble--bottom {
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}
.seneu-tooltip__bubble--left {
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
}
.seneu-tooltip__bubble--right {
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
}

/* ── Arrows ────────────────────────────────────────────── */
.seneu-tooltip__bubble::after {
  content: '';
  position: absolute;
  border: 5px solid transparent;
}
.seneu-tooltip__bubble--dark.seneu-tooltip__bubble--top::after {
  top: 100%; left: 50%; transform: translateX(-50%);
  border-top-color: var(--color-text-default);
}
.seneu-tooltip__bubble--dark.seneu-tooltip__bubble--bottom::after {
  bottom: 100%; left: 50%; transform: translateX(-50%);
  border-bottom-color: var(--color-text-default);
}
.seneu-tooltip__bubble--dark.seneu-tooltip__bubble--left::after {
  left: 100%; top: 50%; transform: translateY(-50%);
  border-left-color: var(--color-text-default);
}
.seneu-tooltip__bubble--dark.seneu-tooltip__bubble--right::after {
  right: 100%; top: 50%; transform: translateY(-50%);
  border-right-color: var(--color-text-default);
}

.seneu-tooltip__bubble--light.seneu-tooltip__bubble--top::after {
  top: 100%; left: 50%; transform: translateX(-50%);
  border-top-color: var(--color-border-default);
}
.seneu-tooltip__bubble--light.seneu-tooltip__bubble--bottom::after {
  bottom: 100%; left: 50%; transform: translateX(-50%);
  border-bottom-color: var(--color-border-default);
}
.seneu-tooltip__bubble--light.seneu-tooltip__bubble--left::after {
  left: 100%; top: 50%; transform: translateY(-50%);
  border-left-color: var(--color-border-default);
}
.seneu-tooltip__bubble--light.seneu-tooltip__bubble--right::after {
  right: 100%; top: 50%; transform: translateY(-50%);
  border-right-color: var(--color-border-default);
}
.seneu-tooltip__bubble--light::before {
  content: '';
  position: absolute;
  border: 4px solid transparent;
  z-index: 1;
}
.seneu-tooltip__bubble--light.seneu-tooltip__bubble--top::before {
  top: 100%; left: 50%; transform: translateX(-50%);
  border-top-color: var(--color-surface-raised);
}
.seneu-tooltip__bubble--light.seneu-tooltip__bubble--bottom::before {
  bottom: 100%; left: 50%; transform: translateX(-50%);
  border-bottom-color: var(--color-surface-raised);
}
.seneu-tooltip__bubble--light.seneu-tooltip__bubble--left::before {
  left: 100%; top: 50%; transform: translateY(-50%);
  border-left-color: var(--color-surface-raised);
}
.seneu-tooltip__bubble--light.seneu-tooltip__bubble--right::before {
  right: 100%; top: 50%; transform: translateY(-50%);
  border-right-color: var(--color-surface-raised);
}

/* ── Transitions ───────────────────────────────────────── */
.seneu-tt-top-enter-active, .seneu-tt-top-leave-active,
.seneu-tt-bottom-enter-active, .seneu-tt-bottom-leave-active,
.seneu-tt-left-enter-active, .seneu-tt-left-leave-active,
.seneu-tt-right-enter-active, .seneu-tt-right-leave-active {
  transition: opacity var(--duration-fast) var(--easing-standard),
              transform var(--duration-fast) var(--easing-standard);
}

.seneu-tt-top-enter-from, .seneu-tt-top-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
}
.seneu-tt-bottom-enter-from, .seneu-tt-bottom-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-4px);
}
.seneu-tt-left-enter-from, .seneu-tt-left-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(4px);
}
.seneu-tt-right-enter-from, .seneu-tt-right-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(-4px);
}
</style>
