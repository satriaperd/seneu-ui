<script setup>
import { computed } from 'vue'
import SeneuIcon from '../display/SeneuIcon.vue'

/**
 * Inline status banner. For a transient auto-dismissing notification,
 * use SeneuToast instead — this one stays in the page flow.
 */
const props = defineProps({
  variant: {
    type: String,
    default: 'info',
    validator: v => ['default', 'brand', 'success', 'warning', 'danger', 'info'].includes(v),
  },
  type: {
    type: String,
    default: 'subtle',
    validator: v => ['subtle', 'solid', 'outline'].includes(v),
  },
  title: {
    type: String,
    default: '',
  },
  /** Material Symbols icon name — defaults to one that matches the variant */
  icon: {
    type: String,
    default: '',
  },
  dismissible: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['close'])

const DEFAULT_ICONS = {
  default: 'notifications',
  brand: 'auto_awesome',
  info: 'info',
  success: 'check_circle',
  warning: 'warning',
  danger: 'error',
}

const currentIcon = computed(() => props.icon || DEFAULT_ICONS[props.variant])
</script>

<template>
  <div class="seneu-alert" :class="[`seneu-alert--${variant}`, `seneu-alert--${type}`]" role="alert">
    <SeneuIcon :name="currentIcon" :size="20" class="seneu-alert__icon" />

    <div class="seneu-alert__body">
      <strong v-if="title" class="seneu-alert__title">{{ title }}</strong>
      <div class="seneu-alert__message"><slot /></div>
      <div v-if="$slots.actions" class="seneu-alert__actions">
        <slot name="actions" />
      </div>
    </div>

    <button
      v-if="dismissible"
      class="seneu-alert__close"
      type="button"
      aria-label="Dismiss notification"
      @click="$emit('close')"
    >
      <SeneuIcon name="close" :size="16" />
    </button>
  </div>
</template>

<style>
/* ── Base ──────────────────────────────────────────────── */
.seneu-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-inline-tight);
  padding: var(--space-inline-tight) var(--space-inline-normal);
  border-radius: var(--radius-element);
  border: 1px solid var(--seneu-alert-border);
  background-color: var(--seneu-alert-bg);
  color: var(--seneu-alert-text);
  width: 100%;
  box-sizing: border-box;
  font-family: var(--font-sans);
}

/* ── Default (neutral) ─────────────────────────────────── */
.seneu-alert--default.seneu-alert--subtle {
  --seneu-alert-bg: var(--color-surface-raised-hover);
  --seneu-alert-border: var(--color-border-default);
  --seneu-alert-text: var(--color-text-default);
}
.seneu-alert--default.seneu-alert--solid {
  --seneu-alert-bg: var(--color-text-default);
  --seneu-alert-border: transparent;
  --seneu-alert-text: var(--color-surface-raised);
}
.seneu-alert--default.seneu-alert--outline {
  --seneu-alert-bg: transparent;
  --seneu-alert-border: var(--color-border-interactive);
  --seneu-alert-text: var(--color-text-default);
}

/* ── Brand ─────────────────────────────────────────────── */
.seneu-alert--brand.seneu-alert--subtle {
  --seneu-alert-bg: var(--color-surface-brand-subtle);
  --seneu-alert-border: var(--color-border-brand);
  --seneu-alert-text: var(--color-text-brand);
}
.seneu-alert--brand.seneu-alert--solid {
  --seneu-alert-bg: var(--color-surface-brand);
  --seneu-alert-border: transparent;
  --seneu-alert-text: var(--color-text-on-brand);
}
.seneu-alert--brand.seneu-alert--outline {
  --seneu-alert-bg: transparent;
  --seneu-alert-border: var(--color-border-brand);
  --seneu-alert-text: var(--color-text-brand);
}

/* ── Info ──────────────────────────────────────────────── */
.seneu-alert--info.seneu-alert--subtle,
.seneu-alert--info.seneu-alert--solid {
  --seneu-alert-bg: var(--color-surface-info-subtle);
  --seneu-alert-border: var(--color-border-info);
  --seneu-alert-text: var(--color-text-info);
}
.seneu-alert--info.seneu-alert--solid { --seneu-alert-bg: var(--color-surface-info-hover); }
.seneu-alert--info.seneu-alert--outline {
  --seneu-alert-bg: transparent;
  --seneu-alert-border: var(--color-border-info);
  --seneu-alert-text: var(--color-text-info);
}

/* ── Success ───────────────────────────────────────────── */
.seneu-alert--success.seneu-alert--subtle {
  --seneu-alert-bg: var(--color-surface-success-subtle);
  --seneu-alert-border: var(--color-border-success);
  --seneu-alert-text: var(--color-text-success);
}
.seneu-alert--success.seneu-alert--solid {
  --seneu-alert-bg: var(--color-surface-success);
  --seneu-alert-border: transparent;
  --seneu-alert-text: var(--color-text-on-success);
}
.seneu-alert--success.seneu-alert--outline {
  --seneu-alert-bg: transparent;
  --seneu-alert-border: var(--color-border-success);
  --seneu-alert-text: var(--color-text-success);
}

/*
  Warning/info "solid" fall back to a stronger tonal treatment instead of
  true inverted text — matches SeneuButton/SeneuBadge's precedent, since
  warning-500 + white text fails WCAG AA at this scale.
*/
.seneu-alert--warning.seneu-alert--subtle,
.seneu-alert--warning.seneu-alert--solid {
  --seneu-alert-bg: var(--color-surface-warning-subtle);
  --seneu-alert-border: var(--color-border-warning);
  --seneu-alert-text: var(--color-text-warning);
}
.seneu-alert--warning.seneu-alert--solid { --seneu-alert-bg: var(--color-surface-warning-hover); }
.seneu-alert--warning.seneu-alert--outline {
  --seneu-alert-bg: transparent;
  --seneu-alert-border: var(--color-border-warning);
  --seneu-alert-text: var(--color-text-warning);
}

/* ── Danger ────────────────────────────────────────────── */
.seneu-alert--danger.seneu-alert--subtle {
  --seneu-alert-bg: var(--color-surface-danger-subtle);
  --seneu-alert-border: var(--color-border-danger);
  --seneu-alert-text: var(--color-text-danger);
}
.seneu-alert--danger.seneu-alert--solid {
  --seneu-alert-bg: var(--color-surface-danger);
  --seneu-alert-border: transparent;
  --seneu-alert-text: var(--color-text-on-danger);
}
.seneu-alert--danger.seneu-alert--outline {
  --seneu-alert-bg: transparent;
  --seneu-alert-border: var(--color-border-danger);
  --seneu-alert-text: var(--color-text-danger);
}

/* ── Icon ──────────────────────────────────────────────── */
.seneu-alert__icon {
  color: var(--seneu-alert-text);
  flex-shrink: 0;
  margin-top: 1px;
}

/* ── Body ──────────────────────────────────────────────── */
.seneu-alert__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-stack-tight);
}
.seneu-alert__title {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-normal);
}
.seneu-alert__message {
  font-size: var(--font-size-small);
  line-height: var(--line-height-relaxed);
  opacity: var(--opacity-high);
}

/* ── Actions ───────────────────────────────────────────── */
.seneu-alert__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-inline-tight);
  margin-top: 2px;
}

/* ── Close ─────────────────────────────────────────────── */
.seneu-alert__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: inherit;
  opacity: var(--opacity-medium);
  border-radius: var(--radius-subtle);
  padding: 0;
  transition: opacity var(--duration-fast) var(--easing-standard),
              background-color var(--duration-fast) var(--easing-standard);
}
.seneu-alert__close:hover {
  opacity: var(--opacity-full);
  background-color: color-mix(in srgb, currentColor 12%, transparent);
}
.seneu-alert__close:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 1px;
}
</style>
