<script setup>
import { computed } from 'vue'
import SeneuIcon from '../display/SeneuIcon.vue'

/**
 * Native <select> dropdown with label, hint/error messaging,
 * and a flat options list. Also accepts <option>/<optgroup>
 * markup via the default slot for grouped or custom cases.
 */
const props = defineProps({
  /** Bound value — use with v-model */
  modelValue: {
    type: [String, Number],
    default: '',
  },
  /** Flat options list — [{ label, value, disabled? }] */
  options: {
    type: Array,
    default: () => [],
  },
  /** Label shown above the field */
  label: { type: String, default: '' },
  /** Placeholder shown as a disabled first option when modelValue is empty */
  placeholder: { type: String, default: '' },
  /** Helper text shown below the field */
  hint: { type: String, default: '' },
  /** Error message — sets error state when non-empty */
  error: { type: String, default: '' },
  /** Disables the field entirely */
  disabled: { type: Boolean, default: false },
  /** Shows a spinner instead of the dropdown arrow — for async-loaded options */
  loading: { type: Boolean, default: false },
  /** Controls padding and font-size */
  size: {
    type: String,
    default: 'base',
    validator: v => ['sm', 'base', 'lg'].includes(v),
  },
  /** Explicit id — auto-generated when omitted */
  id: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

let _counter = 0
const selectId = computed(() => props.id || `seneu-select-${++_counter}`)

const iconSize = computed(() => ({ sm: 16, base: 18, lg: 20 }[props.size]))

function onChange(e) {
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <div
    class="seneu-select"
    :class="[
      `seneu-select--${size}`,
      {
        'seneu-select--error':    !!error,
        'seneu-select--disabled': disabled,
        'seneu-select--loading':  loading,
      },
    ]"
  >
    <label v-if="label" :for="selectId" class="seneu-select__label">
      {{ label }}
    </label>

    <div class="seneu-select__wrapper">
      <select
        :id="selectId"
        class="seneu-select__field"
        :disabled="disabled || loading"
        :value="modelValue"
        :aria-describedby="(hint || error) ? `${selectId}-desc` : undefined"
        :aria-invalid="error ? 'true' : undefined"
        :aria-busy="loading || undefined"
        @change="onChange"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="opt in options"
          :key="opt.value"
          :value="opt.value"
          :disabled="opt.disabled"
        >{{ opt.label }}</option>
        <slot />
      </select>

      <SeneuIcon
        v-if="loading"
        name="progress_activity"
        :size="iconSize"
        class="seneu-select__spinner"
        aria-hidden="true"
      />
      <SeneuIcon
        v-else
        name="expand_more"
        :size="iconSize"
        class="seneu-select__arrow"
        aria-hidden="true"
      />
    </div>

    <p
      v-if="error || hint"
      :id="`${selectId}-desc`"
      class="seneu-select__message"
      :class="error ? 'seneu-select__message--error' : 'seneu-select__message--hint'"
    >
      <SeneuIcon
        v-if="error"
        name="error"
        :size="14"
        aria-hidden="true"
      />
      {{ error || hint }}
    </p>
  </div>
</template>

<style>
/* ── Root ──────────────────────────────────────────────────── */
.seneu-select {
  display:        flex;
  flex-direction: column;
  gap:            var(--space-component-gap);
}

/* ── Label ─────────────────────────────────────────────────── */
.seneu-select__label {
  font-size:   var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color:       var(--color-text-default);
  line-height: var(--line-height-normal);
  cursor:      default;
}

.seneu-select--disabled .seneu-select__label {
  color:  var(--color-text-disabled);
  cursor: not-allowed;
}

/* ── Wrapper ───────────────────────────────────────────────── */
.seneu-select__wrapper {
  position:      relative;
  display:       flex;
  align-items:   center;
  background:    var(--color-surface-raised);
  border:        1px solid var(--color-border-default);
  border-radius: var(--radius-element);
  transition:
    border-color var(--duration-fast) var(--easing-standard),
    box-shadow   var(--duration-fast) var(--easing-standard);
}

.seneu-select__wrapper:hover {
  border-color: var(--color-border-interactive);
}

.seneu-select--error .seneu-select__wrapper:hover {
  border-color: var(--color-border-danger);
}

.seneu-select--disabled .seneu-select__wrapper:hover,
.seneu-select--disabled .seneu-select__wrapper {
  border-color: var(--color-border-default);
}

.seneu-select__wrapper:focus-within {
  border-color: var(--color-border-focus);
  box-shadow:   0 0 0 3px var(--color-ring-brand);
}

.seneu-select--error .seneu-select__wrapper:focus-within {
  border-color: var(--color-border-danger);
  box-shadow:   0 0 0 3px var(--color-ring-danger);
}

.seneu-select--disabled .seneu-select__wrapper {
  opacity:    var(--opacity-disabled);
  cursor:     not-allowed;
  background: var(--color-surface-default);
}

/* ── Field ─────────────────────────────────────────────────── */
.seneu-select__field {
  flex:            1;
  min-width:       0;
  width:           100%;
  border:          none;
  outline:         none;
  background:      transparent;
  font-family:     var(--font-sans);
  color:           var(--color-text-default);
  line-height:     var(--line-height-normal);
  cursor:          pointer;
  appearance:      none;
  -webkit-appearance: none;
}

.seneu-select__field:disabled {
  cursor: not-allowed;
  color:  var(--color-text-disabled);
}

/* Sizes */
.seneu-select--sm   .seneu-select__field { font-size: var(--font-size-small); padding: 6px 10px;  padding-right: 32px; }
.seneu-select--base .seneu-select__field { font-size: var(--font-size-body);  padding: 9px 12px;  padding-right: 38px; }
.seneu-select--lg   .seneu-select__field { font-size: var(--font-size-lead);  padding: 12px 16px; padding-right: 44px; }

/* ── Arrow / spinner ───────────────────────────────────────── */
.seneu-select__arrow,
.seneu-select__spinner {
  position:       absolute;
  color:          var(--color-text-muted);
  pointer-events: none;
  flex-shrink:    0;
}

.seneu-select--sm   .seneu-select__arrow,
.seneu-select--sm   .seneu-select__spinner { right: 10px; }
.seneu-select--base .seneu-select__arrow,
.seneu-select--base .seneu-select__spinner { right: 12px; }
.seneu-select--lg   .seneu-select__arrow,
.seneu-select--lg   .seneu-select__spinner { right: 16px; }

@keyframes seneu-spin {
  to { transform: rotate(360deg); }
}

.seneu-select__spinner {
  animation: seneu-spin 0.8s linear infinite;
}

/* ── Message line ──────────────────────────────────────────── */
.seneu-select__message {
  display:     flex;
  align-items: center;
  gap:         4px;
  font-size:   var(--font-size-small);
  line-height: var(--line-height-normal);
}

.seneu-select__message--hint  { color: var(--color-text-muted);  }
.seneu-select__message--error { color: var(--color-text-danger); }

/* ── Reduced motion ────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .seneu-select__spinner { animation-duration: 0.01ms; }
}
</style>
