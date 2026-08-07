<script setup>
import { computed } from 'vue'

/**
 * Content container. Renders as a <div> by default, a <button> when
 * `clickable` is set, or an <a> when `clickable` + `href` are both set —
 * so keyboard/AT users get a real interactive element instead of a div
 * with a click handler bolted on.
 */
defineOptions({ inheritAttrs: false })

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: v => ['default', 'elevated', 'outlined', 'flat'].includes(v),
  },
  padding: {
    type: String,
    default: 'base',
    validator: v => ['none', 'sm', 'base', 'lg'].includes(v),
  },
  /** Lifts on hover with a shadow */
  hoverable: {
    type: Boolean,
    default: false,
  },
  /** Renders as a <button> (or <a> when href is set) and adds press feedback */
  clickable: {
    type: Boolean,
    default: false,
  },
  /** Navigates instead of emitting click, when clickable is also true */
  href: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  /** Highlights the card with a brand border/ring — for grid selection UIs */
  selected: {
    type: Boolean,
    default: false,
  },
  /** Adds a border between header/body and body/footer */
  divided: {
    type: Boolean,
    default: false,
  },
  /** Shows shimmer placeholders instead of slotted content */
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

const tag = computed(() => {
  if (!props.clickable) return 'div'
  return props.href ? 'a' : 'button'
})

function handleClick(e) {
  if (props.disabled) return
  emit('click', e)
}
</script>

<template>
  <component
    :is="tag"
    class="seneu-card"
    :class="[
      `seneu-card--${variant}`,
      `seneu-card--pad-${padding}`,
      {
        'seneu-card--hoverable': hoverable,
        'seneu-card--clickable': clickable,
        'seneu-card--disabled': disabled,
        'seneu-card--selected': selected,
        'seneu-card--divided': divided,
      },
    ]"
    v-bind="$attrs"
    :href="tag === 'a' ? href : undefined"
    :type="tag === 'button' ? 'button' : undefined"
    :disabled="tag === 'button' ? disabled : undefined"
    :aria-disabled="disabled && tag !== 'button' ? 'true' : undefined"
    @click="handleClick"
  >
    <div v-if="loading" class="seneu-card__skeleton" aria-hidden="true">
      <span class="seneu-card__skeleton-line" style="width: 50%; height: 16px;" />
      <span class="seneu-card__skeleton-line" style="width: 90%;" />
      <span class="seneu-card__skeleton-line" style="width: 75%;" />
    </div>

    <template v-else>
      <div v-if="$slots.media" class="seneu-card__media">
        <slot name="media" />
      </div>
      <div v-if="$slots.header" class="seneu-card__header">
        <slot name="header" />
      </div>
      <div class="seneu-card__body">
        <slot />
      </div>
      <div v-if="$slots.footer" class="seneu-card__footer">
        <slot name="footer" />
      </div>
    </template>
  </component>
</template>

<style>
/* ── Base ──────────────────────────────────────────────── */
.seneu-card {
  display: block;
  width: 100%;
  background-color: var(--color-surface-raised);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-container);
  overflow: hidden;
  text-align: left;
  font-family: var(--font-sans);
  color: var(--color-text-default);
  transition: box-shadow var(--duration-fast) var(--easing-standard),
              border-color var(--duration-fast) var(--easing-standard),
              transform var(--duration-fast) var(--easing-standard);
}

/* ── Variants ──────────────────────────────────────────── */
.seneu-card--elevated { border-color: transparent; box-shadow: var(--elevation-raised); }
.seneu-card--outlined { background-color: transparent; }
.seneu-card--flat { background-color: transparent; border-color: transparent; }

/* ── Interactive ───────────────────────────────────────── */
.seneu-card--hoverable:hover {
  box-shadow: var(--elevation-raised);
  transform: translateY(-2px);
}
.seneu-card--clickable {
  cursor: pointer;
  appearance: none;
  margin: 0;
}
.seneu-card--clickable:active:not(.seneu-card--disabled) {
  transform: translateY(0);
  box-shadow: var(--elevation-surface);
}
.seneu-card--clickable:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

/* ── Selected ──────────────────────────────────────────── */
.seneu-card--selected {
  border-color: var(--color-border-brand);
  box-shadow: 0 0 0 3px var(--color-ring-brand);
}

/* ── Disabled ──────────────────────────────────────────── */
.seneu-card--disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
  pointer-events: none;
}

/* ── Divided ───────────────────────────────────────────── */
.seneu-card--divided .seneu-card__header { border-bottom: 1px solid var(--color-border-default); }
.seneu-card--divided .seneu-card__footer { border-top: 1px solid var(--color-border-default); }

/* ── Media ─────────────────────────────────────────────── */
.seneu-card__media { line-height: 0; }
.seneu-card__media img { width: 100%; height: auto; display: block; }

/* ── Slots ─────────────────────────────────────────────── */
.seneu-card__header,
.seneu-card__body,
.seneu-card__footer {
  padding: var(--space-inline-normal);
}

/* ── Padding sizes ─────────────────────────────────────── */
.seneu-card--pad-sm .seneu-card__header,
.seneu-card--pad-sm .seneu-card__body,
.seneu-card--pad-sm .seneu-card__footer { padding: var(--space-inline-tight); }

.seneu-card--pad-lg .seneu-card__header,
.seneu-card--pad-lg .seneu-card__body,
.seneu-card--pad-lg .seneu-card__footer { padding: var(--space-inline-loose); }

.seneu-card--pad-none .seneu-card__header,
.seneu-card--pad-none .seneu-card__body,
.seneu-card--pad-none .seneu-card__footer { padding: 0; }

/* ── Skeleton (loading) ────────────────────────────────── */
.seneu-card__skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--space-stack-normal);
  padding: var(--space-inline-normal);
}
.seneu-card__skeleton-line {
  display: block;
  height: 12px;
  border-radius: var(--radius-subtle);
  background: linear-gradient(
    90deg,
    var(--color-surface-raised-hover) 25%,
    var(--color-surface-raised-active) 50%,
    var(--color-surface-raised-hover) 75%
  );
  background-size: 200% 100%;
  animation: seneu-card-shimmer 1.5s ease-in-out infinite;
}
@keyframes seneu-card-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
