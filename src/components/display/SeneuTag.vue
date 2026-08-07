<script setup>
import { computed } from 'vue'
import SeneuIcon from './SeneuIcon.vue'

/**
 * Interactive chip — removable and/or clickable/selectable. For a
 * passive, non-interactive status pill, use SeneuBadge instead.
 */
const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: v => ['default', 'brand', 'success', 'warning', 'danger', 'info'].includes(v),
  },
  type: {
    type: String,
    default: 'subtle',
    validator: v => ['subtle', 'solid', 'outline'].includes(v),
  },
  size: {
    type: String,
    default: 'base',
    validator: v => ['sm', 'base', 'lg'].includes(v),
  },
  icon: {
    type: String,
    default: '',
  },
  /** Shows a remove (×) button and emits `remove` when clicked */
  removable: {
    type: Boolean,
    default: false,
  },
  /** Renders as a <button> — for filter/selection chips. Toggle `active` externally on click. */
  clickable: {
    type: Boolean,
    default: false,
  },
  /** Pressed/selected visual state — only meaningful when clickable */
  active: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['remove', 'click'])

const iconSize = computed(() => ({ sm: 12, base: 13, lg: 15 }[props.size]))

function handleClick(e) {
  if (props.disabled) return
  emit('click', e)
}

function handleRemove(e) {
  e.stopPropagation()
  if (props.disabled) return
  emit('remove')
}
</script>

<template>
  <component
    :is="clickable ? 'button' : 'span'"
    class="seneu-tag"
    :class="[
      `seneu-tag--${variant}`,
      `seneu-tag--${type}`,
      `seneu-tag--${size}`,
      {
        'seneu-tag--clickable': clickable,
        'seneu-tag--active': clickable && active,
        'seneu-tag--disabled': disabled,
      },
    ]"
    :type="clickable ? 'button' : undefined"
    :disabled="clickable && disabled ? true : undefined"
    :aria-disabled="!clickable && disabled ? 'true' : undefined"
    :aria-pressed="clickable ? active : undefined"
    @click="clickable ? handleClick($event) : undefined"
  >
    <SeneuIcon v-if="icon" :name="icon" :size="iconSize" class="seneu-tag__icon" />
    <span class="seneu-tag__label"><slot /></span>
    <span
      v-if="removable"
      class="seneu-tag__remove"
      role="button"
      tabindex="0"
      aria-label="Remove"
      @click="handleRemove"
      @keydown.enter.prevent="handleRemove"
      @keydown.space.prevent="handleRemove"
    >
      <SeneuIcon name="close" :size="iconSize" />
    </span>
  </component>
</template>

<style>
/* ── Base ──────────────────────────────────────────────── */
.seneu-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  font-family: var(--font-sans);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  line-height: 1.4;
  white-space: nowrap;
  background-color: var(--seneu-tag-bg);
  color: var(--seneu-tag-text);
  border: 1px solid var(--seneu-tag-border);
  transition: background-color var(--duration-fast) var(--easing-standard),
              border-color var(--duration-fast) var(--easing-standard),
              color var(--duration-fast) var(--easing-standard);
}
.seneu-tag--sm { padding: 2px 8px; font-size: var(--font-size-xs); gap: 3px; }
.seneu-tag--lg { padding: 6px 14px; font-size: var(--font-size-body); gap: 6px; }

.seneu-tag--clickable {
  cursor: pointer;
  appearance: none;
}
.seneu-tag--clickable:hover:not(.seneu-tag--disabled) { filter: brightness(0.97); }
.seneu-tag--clickable:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
.seneu-tag--disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
  pointer-events: none;
}

/* ── Default (neutral) ─────────────────────────────────── */
.seneu-tag--default.seneu-tag--subtle {
  --seneu-tag-bg: var(--color-surface-raised-hover);
  --seneu-tag-text: var(--color-text-muted);
  --seneu-tag-border: var(--color-border-default);
}
.seneu-tag--default.seneu-tag--solid {
  --seneu-tag-bg: var(--color-text-default);
  --seneu-tag-text: var(--color-surface-raised);
  --seneu-tag-border: transparent;
}
.seneu-tag--default.seneu-tag--outline {
  --seneu-tag-bg: transparent;
  --seneu-tag-text: var(--color-text-muted);
  --seneu-tag-border: var(--color-border-interactive);
}
.seneu-tag--default.seneu-tag--active {
  --seneu-tag-bg: var(--color-surface-raised-active);
  --seneu-tag-text: var(--color-text-default);
  --seneu-tag-border: var(--color-border-interactive);
}

/* ── Brand ─────────────────────────────────────────────── */
.seneu-tag--brand.seneu-tag--subtle,
.seneu-tag--brand.seneu-tag--active {
  --seneu-tag-bg: var(--color-surface-brand-subtle);
  --seneu-tag-text: var(--color-text-brand);
  --seneu-tag-border: var(--color-border-brand);
}
.seneu-tag--brand.seneu-tag--solid {
  --seneu-tag-bg: var(--color-surface-brand);
  --seneu-tag-text: var(--color-text-on-brand);
  --seneu-tag-border: transparent;
}
.seneu-tag--brand.seneu-tag--outline {
  --seneu-tag-bg: transparent;
  --seneu-tag-text: var(--color-text-brand);
  --seneu-tag-border: var(--color-border-brand);
}

/* ── Success ───────────────────────────────────────────── */
.seneu-tag--success.seneu-tag--subtle {
  --seneu-tag-bg: var(--color-surface-success-subtle);
  --seneu-tag-text: var(--color-text-success);
  --seneu-tag-border: var(--color-border-success);
}
.seneu-tag--success.seneu-tag--solid {
  --seneu-tag-bg: var(--color-surface-success);
  --seneu-tag-text: var(--color-text-on-success);
  --seneu-tag-border: transparent;
}
.seneu-tag--success.seneu-tag--outline {
  --seneu-tag-bg: transparent;
  --seneu-tag-text: var(--color-text-success);
  --seneu-tag-border: var(--color-border-success);
}

/* ── Danger ────────────────────────────────────────────── */
.seneu-tag--danger.seneu-tag--subtle {
  --seneu-tag-bg: var(--color-surface-danger-subtle);
  --seneu-tag-text: var(--color-text-danger);
  --seneu-tag-border: var(--color-border-danger);
}
.seneu-tag--danger.seneu-tag--solid {
  --seneu-tag-bg: var(--color-surface-danger);
  --seneu-tag-text: var(--color-text-on-danger);
  --seneu-tag-border: transparent;
}
.seneu-tag--danger.seneu-tag--outline {
  --seneu-tag-bg: transparent;
  --seneu-tag-text: var(--color-text-danger);
  --seneu-tag-border: var(--color-border-danger);
}

/* Warning/info "solid" use a stronger tonal treatment — same AA-contrast
   rationale as SeneuButton/SeneuBadge. */
.seneu-tag--warning.seneu-tag--subtle,
.seneu-tag--warning.seneu-tag--solid {
  --seneu-tag-bg: var(--color-surface-warning-subtle);
  --seneu-tag-text: var(--color-text-warning);
  --seneu-tag-border: var(--color-border-warning);
}
.seneu-tag--warning.seneu-tag--solid { --seneu-tag-bg: var(--color-surface-warning-hover); }
.seneu-tag--warning.seneu-tag--outline {
  --seneu-tag-bg: transparent;
  --seneu-tag-text: var(--color-text-warning);
  --seneu-tag-border: var(--color-border-warning);
}

.seneu-tag--info.seneu-tag--subtle,
.seneu-tag--info.seneu-tag--solid {
  --seneu-tag-bg: var(--color-surface-info-subtle);
  --seneu-tag-text: var(--color-text-info);
  --seneu-tag-border: var(--color-border-info);
}
.seneu-tag--info.seneu-tag--solid { --seneu-tag-bg: var(--color-surface-info-hover); }
.seneu-tag--info.seneu-tag--outline {
  --seneu-tag-bg: transparent;
  --seneu-tag-text: var(--color-text-info);
  --seneu-tag-border: var(--color-border-info);
}

/* ── Icon & label ──────────────────────────────────────── */
.seneu-tag__icon { flex-shrink: 0; }
.seneu-tag__label { overflow: hidden; text-overflow: ellipsis; }

/* ── Remove button ─────────────────────────────────────── */
.seneu-tag__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-left: 2px;
  border-radius: var(--radius-circle);
  color: inherit;
  opacity: 0.7;
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity var(--duration-fast) var(--easing-standard),
              background-color var(--duration-fast) var(--easing-standard);
}
.seneu-tag__remove:hover { opacity: 1; background-color: color-mix(in srgb, currentColor 15%, transparent); }
.seneu-tag__remove:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 1px;
}
.seneu-tag--sm .seneu-tag__remove { width: 12px; height: 12px; }
.seneu-tag--lg .seneu-tag__remove { width: 16px; height: 16px; }
</style>
