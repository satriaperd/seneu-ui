<script setup>
import { computed } from 'vue'
import SeneuIcon from '../display/SeneuIcon.vue'

/**
 * Multi-line text input with label, hint/error messaging,
 * optional character counter, and configurable resize behavior.
 */
const props = defineProps({
  /** Bound value — use with v-model */
  modelValue: {
    type: String,
    default: '',
  },
  /** Label shown above the field */
  label: { type: String, default: '' },
  /** Placeholder text shown when the field is empty */
  placeholder: { type: String, default: '' },
  /** Helper text shown below the field */
  hint: { type: String, default: '' },
  /** Error message — sets error state when non-empty */
  error: { type: String, default: '' },
  /** Disables the field entirely */
  disabled: { type: Boolean, default: false },
  /** Makes the field non-editable but still focusable/selectable */
  readonly: { type: Boolean, default: false },
  /** Shows a spinner in the corner — for async validation */
  loading: { type: Boolean, default: false },
  /** Controls padding and font-size */
  size: {
    type: String,
    default: 'base',
    validator: v => ['sm', 'base', 'lg'].includes(v),
  },
  /** Visible row count */
  rows: { type: Number, default: 4 },
  /** Max character count — 0 means unlimited */
  maxlength: { type: Number, default: 0 },
  /** Shows a live character counter — only rendered when maxlength is set */
  showCounter: { type: Boolean, default: false },
  /** CSS resize behavior */
  resize: {
    type: String,
    default: 'vertical',
    validator: v => ['none', 'vertical', 'horizontal', 'both'].includes(v),
  },
  /** Explicit id — auto-generated when omitted */
  id: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

let _counter = 0
const textareaId = computed(() => props.id || `seneu-textarea-${++_counter}`)

const iconSize = computed(() => ({ sm: 14, base: 16, lg: 18 }[props.size]))

const charCount   = computed(() => props.modelValue.length)
const isNearLimit = computed(() => props.maxlength > 0 && charCount.value >= props.maxlength * 0.9)
const showCounterRow = computed(() => props.showCounter && props.maxlength > 0)

function onInput(e) {
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <div
    class="seneu-textarea"
    :class="[
      `seneu-textarea--${size}`,
      {
        'seneu-textarea--error':    !!error,
        'seneu-textarea--disabled': disabled,
        'seneu-textarea--readonly': readonly,
        'seneu-textarea--loading':  loading,
      },
    ]"
  >
    <label v-if="label" :for="textareaId" class="seneu-textarea__label">
      {{ label }}
    </label>

    <div class="seneu-textarea__wrapper">
      <textarea
        :id="textareaId"
        class="seneu-textarea__field"
        :style="{ resize }"
        :rows="rows"
        :maxlength="maxlength || undefined"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        :readonly="readonly"
        :aria-describedby="(hint || error) ? `${textareaId}-desc` : undefined"
        :aria-invalid="error ? 'true' : undefined"
        :aria-busy="loading || undefined"
        @input="onInput"
      />

      <SeneuIcon
        v-if="loading"
        name="progress_activity"
        :size="iconSize"
        class="seneu-textarea__spinner"
        aria-hidden="true"
      />
    </div>

    <div class="seneu-textarea__footer">
      <p
        v-if="error || hint"
        :id="`${textareaId}-desc`"
        class="seneu-textarea__message"
        :class="error ? 'seneu-textarea__message--error' : 'seneu-textarea__message--hint'"
      >
        <SeneuIcon
          v-if="error"
          name="error"
          :size="14"
          aria-hidden="true"
        />
        {{ error || hint }}
      </p>
      <span v-else />

      <span
        v-if="showCounterRow"
        class="seneu-textarea__counter"
        :class="{ 'seneu-textarea__counter--warn': isNearLimit }"
        aria-live="polite"
      >{{ charCount }}/{{ maxlength }}</span>
    </div>
  </div>
</template>

<style>
/* ── Root ──────────────────────────────────────────────────── */
.seneu-textarea {
  display:        flex;
  flex-direction: column;
  gap:            var(--space-component-gap);
}

/* ── Label ─────────────────────────────────────────────────── */
.seneu-textarea__label {
  font-size:   var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color:       var(--color-text-default);
  line-height: var(--line-height-normal);
  cursor:      default;
}

.seneu-textarea--disabled .seneu-textarea__label {
  color:  var(--color-text-disabled);
  cursor: not-allowed;
}

/* ── Wrapper ───────────────────────────────────────────────── */
.seneu-textarea__wrapper {
  position:      relative;
  display:       flex;
  background:    var(--color-surface-raised);
  border:        1px solid var(--color-border-default);
  border-radius: var(--radius-element);
  transition:
    border-color var(--duration-fast) var(--easing-standard),
    box-shadow   var(--duration-fast) var(--easing-standard);
}

.seneu-textarea__wrapper:hover {
  border-color: var(--color-border-interactive);
}

.seneu-textarea--error .seneu-textarea__wrapper:hover {
  border-color: var(--color-border-danger);
}

.seneu-textarea--disabled .seneu-textarea__wrapper:hover,
.seneu-textarea--disabled .seneu-textarea__wrapper {
  border-color: var(--color-border-default);
}

.seneu-textarea__wrapper:focus-within {
  border-color: var(--color-border-focus);
  box-shadow:   0 0 0 3px var(--color-ring-brand);
}

.seneu-textarea--error .seneu-textarea__wrapper:focus-within {
  border-color: var(--color-border-danger);
  box-shadow:   0 0 0 3px var(--color-ring-danger);
}

.seneu-textarea--disabled .seneu-textarea__wrapper {
  opacity:    var(--opacity-disabled);
  cursor:     not-allowed;
  background: var(--color-surface-default);
}

.seneu-textarea--readonly .seneu-textarea__wrapper {
  background:   var(--color-surface-default);
  border-style: dashed;
}

/* ── Field ─────────────────────────────────────────────────── */
.seneu-textarea__field {
  flex:            1;
  min-width:       0;
  border:          none;
  outline:         none;
  background:      transparent;
  font-family:     var(--font-sans);
  color:           var(--color-text-default);
  line-height:     var(--line-height-normal);
  width:           100%;
}

.seneu-textarea__field::placeholder { color: var(--color-text-muted); }

.seneu-textarea__field:disabled {
  cursor:  not-allowed;
  color:   var(--color-text-disabled);
  resize:  none;
}

.seneu-textarea__field:read-only {
  cursor: default;
  color:  var(--color-text-muted);
}

/* Sizes */
.seneu-textarea--sm   .seneu-textarea__field { font-size: var(--font-size-small); padding: 7px 10px;  }
.seneu-textarea--base .seneu-textarea__field { font-size: var(--font-size-body);  padding: 9px 12px;  }
.seneu-textarea--lg   .seneu-textarea__field { font-size: var(--font-size-lead);  padding: 12px 16px; }

/* ── Loading spinner ───────────────────────────────────────── */
@keyframes seneu-spin {
  to { transform: rotate(360deg); }
}

.seneu-textarea__spinner {
  position:    absolute;
  top:         9px;
  right:       10px;
  color:       var(--color-text-muted);
  animation:   seneu-spin 0.8s linear infinite;
  flex-shrink: 0;
}

/* ── Footer (message + counter) ───────────────────────────── */
.seneu-textarea__footer {
  display:         flex;
  align-items:     flex-start;
  justify-content: space-between;
  gap:             var(--space-inline-normal);
}

/* ── Message line ──────────────────────────────────────────── */
.seneu-textarea__message {
  display:     flex;
  align-items: center;
  gap:         4px;
  font-size:   var(--font-size-small);
  line-height: var(--line-height-normal);
}

.seneu-textarea__message--hint  { color: var(--color-text-muted);  }
.seneu-textarea__message--error { color: var(--color-text-danger); }

/* ── Character counter ────────────────────────────────────── */
.seneu-textarea__counter {
  font-size:            var(--font-size-xs);
  font-variant-numeric: tabular-nums;
  color:                var(--color-text-muted);
  flex-shrink:          0;
  white-space:          nowrap;
}

.seneu-textarea__counter--warn {
  color:       var(--color-text-danger);
  font-weight: var(--font-weight-semibold);
}

/* ── Reduced motion ────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .seneu-textarea__spinner { animation-duration: 0.01ms; }
}
</style>
