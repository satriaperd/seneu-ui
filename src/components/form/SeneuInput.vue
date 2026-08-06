<script setup>
import { computed, ref } from 'vue'
import SeneuIcon from '../display/SeneuIcon.vue'

/**
 * Text input with label, hint/error messaging, icon slots,
 * built-in password toggle, and clearable support.
 */
const props = defineProps({
  /** Bound value — use with v-model */
  modelValue: {
    type: [String, Number],
    default: '',
  },
  /** Label shown above the field */
  label: { type: String, default: '' },
  /** HTML input type */
  type: {
    type: String,
    default: 'text',
    validator: v => ['text', 'email', 'password', 'number', 'search', 'tel', 'url'].includes(v),
  },
  /** Placeholder text shown when the field is empty */
  placeholder: { type: String, default: '' },
  /** Helper text shown below the field */
  hint:  { type: String, default: '' },
  /** Error message — sets error state when non-empty */
  error: { type: String, default: '' },
  /** Disables the field entirely */
  disabled: { type: Boolean, default: false },
  /** Makes the field non-editable but still focusable/selectable */
  readonly: { type: Boolean, default: false },
  /** Shows a spinner on the right — for async validation (e.g. checking availability) */
  loading: { type: Boolean, default: false },
  /** Controls padding and font-size */
  size: {
    type: String,
    default: 'base',
    validator: v => ['sm', 'base', 'lg'].includes(v),
  },
  /** Material Symbols icon name shown on the left */
  icon: { type: String, default: '' },
  /** Material Symbols icon name shown on the right (static — overridden by loading / clearable / password toggle) */
  iconRight: { type: String, default: '' },
  /** Show × button to clear value when field is non-empty */
  clearable: { type: Boolean, default: false },
  /** Explicit id — auto-generated when omitted */
  id: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'clear'])

let _counter = 0
const inputId = computed(() => props.id || `seneu-input-${++_counter}`)

const showPassword = ref(false)
const isPassword   = computed(() => props.type === 'password')
const effectiveType = computed(() => isPassword.value && showPassword.value ? 'text' : props.type)

const iconSize = computed(() => ({ sm: 16, base: 18, lg: 20 }[props.size]))

const hasValue   = computed(() => String(props.modelValue ?? '').length > 0)
const showClear  = computed(() => props.clearable && hasValue.value && !props.disabled && !props.readonly && !props.loading)
const showPwdBtn = computed(() => isPassword.value && !props.disabled && !props.loading)
const hasRight   = computed(() => props.loading || props.iconRight || showClear.value || showPwdBtn.value)

function onInput(e) {
  emit('update:modelValue', e.target.value)
}

function onClear() {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<template>
  <div
    class="seneu-input"
    :class="[
      `seneu-input--${size}`,
      {
        'seneu-input--error':    !!error,
        'seneu-input--disabled': disabled,
        'seneu-input--readonly': readonly,
        'seneu-input--loading':  loading,
      },
    ]"
  >
    <label v-if="label" :for="inputId" class="seneu-input__label">
      {{ label }}
    </label>

    <div class="seneu-input__wrapper">
      <SeneuIcon
        v-if="icon"
        :name="icon"
        :size="iconSize"
        class="seneu-input__icon seneu-input__icon--left"
        aria-hidden="true"
      />

      <input
        :id="inputId"
        class="seneu-input__field"
        :class="{
          'seneu-input__field--has-left':  !!icon,
          'seneu-input__field--has-right': hasRight,
        }"
        :type="effectiveType"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        :readonly="readonly"
        :aria-describedby="(hint || error) ? `${inputId}-desc` : undefined"
        :aria-invalid="error ? 'true' : undefined"
        :aria-busy="loading || undefined"
        @input="onInput"
      />

      <div v-if="hasRight" class="seneu-input__icon seneu-input__icon--right">
        <SeneuIcon
          v-if="loading"
          name="progress_activity"
          :size="iconSize"
          class="seneu-input__spinner"
          aria-hidden="true"
        />

        <button
          v-else-if="showClear"
          type="button"
          class="seneu-input__action-btn"
          aria-label="Clear input"
          @click="onClear"
        >
          <SeneuIcon name="close" :size="iconSize" />
        </button>

        <button
          v-else-if="showPwdBtn"
          type="button"
          class="seneu-input__action-btn"
          :aria-label="showPassword ? 'Hide password' : 'Show password'"
          @click="showPassword = !showPassword"
        >
          <SeneuIcon :name="showPassword ? 'visibility_off' : 'visibility'" :size="iconSize" />
        </button>

        <SeneuIcon
          v-else-if="iconRight"
          :name="iconRight"
          :size="iconSize"
          aria-hidden="true"
        />
      </div>
    </div>

    <p
      v-if="error || hint"
      :id="`${inputId}-desc`"
      class="seneu-input__message"
      :class="error ? 'seneu-input__message--error' : 'seneu-input__message--hint'"
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
.seneu-input {
  display:        flex;
  flex-direction: column;
  gap:            var(--space-component-gap);
}

/* ── Label ─────────────────────────────────────────────────── */
.seneu-input__label {
  font-size:   var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color:       var(--color-text-default);
  line-height: var(--line-height-normal);
  cursor:      default;
}

.seneu-input--disabled .seneu-input__label {
  color:  var(--color-text-disabled);
  cursor: not-allowed;
}

/* ── Wrapper ───────────────────────────────────────────────── */
.seneu-input__wrapper {
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

.seneu-input__wrapper:hover {
  border-color: var(--color-border-interactive);
}

.seneu-input--error .seneu-input__wrapper:hover {
  border-color: var(--color-border-danger);
}

.seneu-input--disabled .seneu-input__wrapper:hover,
.seneu-input--disabled .seneu-input__wrapper {
  border-color: var(--color-border-default);
}

.seneu-input__wrapper:focus-within {
  border-color: var(--color-border-focus);
  box-shadow:   0 0 0 3px var(--color-ring-brand);
}

.seneu-input--error .seneu-input__wrapper:focus-within {
  border-color: var(--color-border-danger);
  box-shadow:   0 0 0 3px var(--color-ring-danger);
}

.seneu-input--disabled .seneu-input__wrapper {
  opacity:    var(--opacity-disabled);
  cursor:     not-allowed;
  background: var(--color-surface-default);
}

.seneu-input--readonly .seneu-input__wrapper {
  background:    var(--color-surface-default);
  border-style:  dashed;
}

/* ── Field ─────────────────────────────────────────────────── */
.seneu-input__field {
  flex:        1;
  min-width:   0;
  border:      none;
  outline:     none;
  background:  transparent;
  font-family: var(--font-sans);
  color:       var(--color-text-default);
  line-height: var(--line-height-normal);
  width:       100%;
}

.seneu-input__field::placeholder { color: var(--color-text-muted); }

.seneu-input__field:disabled {
  cursor: not-allowed;
  color:  var(--color-text-disabled);
}

.seneu-input__field:read-only {
  cursor: default;
  color:  var(--color-text-muted);
}

/* Sizes */
.seneu-input--sm   .seneu-input__field { font-size: var(--font-size-small); padding: 6px 10px;  }
.seneu-input--base .seneu-input__field { font-size: var(--font-size-body);  padding: 9px 12px;  }
.seneu-input--lg   .seneu-input__field { font-size: var(--font-size-lead);  padding: 12px 16px; }

/* Indent when icons present */
.seneu-input--sm   .seneu-input__field--has-left  { padding-left:  38px; }
.seneu-input--sm   .seneu-input__field--has-right { padding-right: 38px; }
.seneu-input--base .seneu-input__field--has-left  { padding-left:  42px; }
.seneu-input--base .seneu-input__field--has-right { padding-right: 42px; }
.seneu-input--lg   .seneu-input__field--has-left  { padding-left:  48px; }
.seneu-input--lg   .seneu-input__field--has-right { padding-right: 48px; }

/* ── Icon containers ───────────────────────────────────────── */
.seneu-input__icon {
  position:       absolute;
  display:        flex;
  align-items:    center;
  color:          var(--color-text-muted);
  pointer-events: none;
}

.seneu-input__icon--right { pointer-events: auto; }

.seneu-input--sm   .seneu-input__icon--left  { left:  10px; }
.seneu-input--sm   .seneu-input__icon--right { right: 10px; }
.seneu-input--base .seneu-input__icon--left  { left:  12px; }
.seneu-input--base .seneu-input__icon--right { right: 12px; }
.seneu-input--lg   .seneu-input__icon--left  { left:  16px; }
.seneu-input--lg   .seneu-input__icon--right { right: 16px; }

/* ── Action buttons (clear / password toggle) ──────────────── */
.seneu-input__action-btn {
  display:         flex;
  align-items:     center;
  justify-content: center;
  background:      none;
  border:          none;
  padding:         2px;
  cursor:          pointer;
  color:           var(--color-text-muted);
  border-radius:   var(--radius-subtle);
  transition:      color var(--duration-fast) var(--easing-standard);
}

.seneu-input__action-btn:hover {
  color: var(--color-text-default);
}

.seneu-input__action-btn:focus-visible {
  outline:        2px solid var(--color-border-focus);
  outline-offset: 1px;
}

/* ── Loading spinner ───────────────────────────────────────── */
@keyframes seneu-spin {
  to { transform: rotate(360deg); }
}

.seneu-input__spinner {
  animation:   seneu-spin 0.8s linear infinite;
  flex-shrink: 0;
}

/* ── Message line ──────────────────────────────────────────── */
.seneu-input__message {
  display:     flex;
  align-items: center;
  gap:         4px;
  font-size:   var(--font-size-small);
  line-height: var(--line-height-normal);
}

.seneu-input__message--hint  { color: var(--color-text-muted);  }
.seneu-input__message--error { color: var(--color-text-danger); }
</style>
