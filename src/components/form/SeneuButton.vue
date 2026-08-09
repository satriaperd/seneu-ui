<script setup>
import { computed } from 'vue'
import SeneuIcon from '../display/SeneuIcon.vue'

/**
 * Primary action element. Supports 6 semantic variants, 3 sizes,
 * optional icons (left/right/icon-only), loading and disabled states.
 */
const props = defineProps({
  /** Visual style — maps to semantic color tokens */
  variant: {
    type: String,
    default: 'default',
    validator: v => ['default', 'brand', 'danger', 'success', 'warning', 'info'].includes(v),
  },
  /** Size — controls padding, font-size, and icon size */
  size: {
    type: String,
    default: 'base',
    validator: v => ['sm', 'base', 'lg'].includes(v),
  },
  /** Material Symbols icon name shown before the label */
  icon: {
    type: String,
    default: '',
  },
  /** Material Symbols icon name shown after the label */
  iconRight: {
    type: String,
    default: '',
  },
  /** Renders as a square icon-only button — provide icon prop, no slot text */
  iconOnly: {
    type: Boolean,
    default: false,
  },
  /** Shows a loading spinner and disables interaction */
  loading: {
    type: Boolean,
    default: false,
  },
  /** Disables the button */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** HTML button type */
  type: {
    type: String,
    default: 'button',
  },
})

const emit = defineEmits(['click'])

const iconSize = computed(() => ({ sm: 16, base: 20, lg: 24 }[props.size]))
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    :aria-label="iconOnly && loading ? 'Loading' : undefined"
    class="seneu-btn"
    :class="[`seneu-btn--${variant}`, `seneu-btn--${size}`, { 'seneu-btn--loading': loading, 'seneu-btn--icon-only': iconOnly }]"
    @click="e => emit('click', e)"
  >
    <SeneuIcon
      v-if="loading"
      name="progress_activity"
      :size="iconSize"
      class="seneu-btn__spinner"
    />
    <SeneuIcon
      v-else-if="icon"
      :name="icon"
      :size="iconSize"
    />

    <span v-if="!iconOnly" class="seneu-btn__label">
      <slot />
    </span>

    <SeneuIcon
      v-if="!loading && iconRight && !iconOnly"
      :name="iconRight"
      :size="iconSize"
    />
  </button>
</template>

<style>
/* ── Base ──────────────────────────────────────────── */
.seneu-btn {
  display:         inline-flex;
  align-items:     center;
  justify-content: center;
  gap:             var(--space-inline-tight);
  font-family:     var(--font-sans);
  font-weight:     var(--font-weight-medium);
  line-height:     1;
  white-space:     nowrap;
  user-select:     none;
  text-decoration: none;
  border:          1px solid transparent;
  border-radius:   var(--radius-element);
  cursor:          pointer;
  position:        relative;
  transition:
    background-color var(--duration-fast) var(--easing-standard),
    border-color     var(--duration-fast) var(--easing-standard),
    color            var(--duration-fast) var(--easing-standard),
    box-shadow       var(--duration-fast) var(--easing-standard),
    opacity          var(--duration-fast) var(--easing-standard);
}

.seneu-btn:focus-visible {
  outline:        2px solid var(--color-border-focus);
  outline-offset: 2px;
}

/* ── Sizes ─────────────────────────────────────────── */
.seneu-btn--sm   { padding: 6px 12px;  font-size: var(--font-size-small); }
.seneu-btn--base { padding: 10px 16px; font-size: var(--font-size-body);  }
.seneu-btn--lg   { padding: 14px 24px; font-size: var(--font-size-lead);  }

/* Icon-only: equal padding all sides */
.seneu-btn--icon-only.seneu-btn--sm   { padding: 6px;  }
.seneu-btn--icon-only.seneu-btn--base { padding: 10px; }
.seneu-btn--icon-only.seneu-btn--lg   { padding: 14px; }

/* ── Variants ──────────────────────────────────────── */

/* default — outlined neutral */
.seneu-btn--default {
  background:    var(--color-surface-raised);
  color:         var(--color-text-default);
  border-color:  var(--color-border-default);
}
.seneu-btn--default:hover:not(:disabled) {
  background:   var(--color-surface-raised-hover);
  border-color: var(--color-border-interactive);
}
.seneu-btn--default:active:not(:disabled) {
  background:   var(--color-surface-raised-active);
}

/* brand — solid orange */
.seneu-btn--brand {
  background:   var(--color-surface-brand);
  color:        var(--color-text-on-brand);
  border-color: var(--color-surface-brand);
}
.seneu-btn--brand:hover:not(:disabled) {
  background:   var(--color-surface-brand-hover);
  border-color: var(--color-surface-brand-hover);
}
.seneu-btn--brand:active:not(:disabled) {
  background:   var(--color-surface-brand-active);
  border-color: var(--color-surface-brand-active);
}

/* danger — solid red */
.seneu-btn--danger {
  background:   var(--color-surface-danger);
  color:        var(--color-text-on-danger);
  border-color: var(--color-surface-danger);
}
.seneu-btn--danger:hover:not(:disabled) {
  background:   var(--color-surface-danger-hover);
  border-color: var(--color-surface-danger-hover);
}
.seneu-btn--danger:active:not(:disabled) {
  background:   var(--color-surface-danger-active);
  border-color: var(--color-surface-danger-active);
}

/* success — solid green */
.seneu-btn--success {
  background:   var(--color-surface-success);
  color:        var(--color-text-on-success);
  border-color: var(--color-surface-success);
}
.seneu-btn--success:hover:not(:disabled) {
  background:   var(--color-surface-success-hover);
  border-color: var(--color-surface-success-hover);
}
.seneu-btn--success:active:not(:disabled) {
  background:   var(--color-surface-success-active);
  border-color: var(--color-surface-success-active);
}

/* warning — tonal amber (solid amber fails WCAG AA for white text) */
.seneu-btn--warning {
  background:   var(--color-surface-warning-subtle);
  color:        var(--color-text-warning);
  border-color: var(--color-border-warning);
}
.seneu-btn--warning:hover:not(:disabled) {
  background:   var(--color-surface-warning-hover);
  border-color: var(--color-border-warning);
}
.seneu-btn--warning:active:not(:disabled) {
  background:   var(--color-surface-warning-active);
}

/* info — tonal blue (blue-500 + white text is ~3.7:1, below AA for small text) */
.seneu-btn--info {
  background:   var(--color-surface-info-subtle);
  color:        var(--color-text-info);
  border-color: var(--color-border-info);
}
.seneu-btn--info:hover:not(:disabled) {
  background:   var(--color-surface-info-hover);
  border-color: var(--color-border-info);
}
.seneu-btn--info:active:not(:disabled) {
  background:   var(--color-surface-info-active);
}

/* ── States ────────────────────────────────────────── */
.seneu-btn:disabled {
  opacity:        var(--opacity-disabled);
  cursor:         not-allowed;
  pointer-events: none;
}

.seneu-btn--loading {
  cursor:         wait;
  pointer-events: none;
}

/* Loading text — slightly transparent so spinner is the focal point */
.seneu-btn--loading .seneu-btn__label {
  opacity: 0.7;
}

/* ── Spinner ───────────────────────────────────────── */
@keyframes seneu-spin {
  to { transform: rotate(360deg); }
}

.seneu-btn__spinner {
  animation: seneu-spin 0.8s linear infinite;
  flex-shrink: 0;
}
</style>
