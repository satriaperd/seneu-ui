<script setup>
import { computed } from 'vue'
import SeneuIcon from '../display/SeneuIcon.vue'

defineOptions({ inheritAttrs: false })

/**
 * On/off switch. Prefer this over SeneuCheckbox when the change
 * takes effect immediately (settings, feature flags) rather than
 * being part of a form submitted later.
 */
const props = defineProps({
  /** Bound value — use with v-model */
  modelValue: { type: Boolean, default: false },
  /** Label shown next to the track */
  label: { type: String, default: '' },
  /** Secondary text shown below the label */
  description: { type: String, default: '' },
  /** Helper text shown below the field */
  hint: { type: String, default: '' },
  /** Error message — sets error state when non-empty */
  error: { type: String, default: '' },
  /** Disables the field entirely */
  disabled: { type: Boolean, default: false },
  /** Shows a spinner on the knob and disables interaction — for async saves */
  loading: { type: Boolean, default: false },
  /** Controls track/knob size */
  size: {
    type: String,
    default: 'base',
    validator: v => ['sm', 'base', 'lg'].includes(v),
  },
  /** Puts the track before the label instead of after */
  reverse: { type: Boolean, default: false },
  /** Explicit id — auto-generated when omitted */
  id: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'change'])

let _counter = 0
const toggleId = computed(() => props.id || `seneu-toggle-${++_counter}`)

const iconSize = computed(() => ({ sm: 9, base: 11, lg: 13 }[props.size]))

function onChange(e) {
  emit('update:modelValue', e.target.checked)
  emit('change', e)
}
</script>

<template>
  <div class="seneu-toggle-field">
    <label
      :for="toggleId"
      class="seneu-toggle"
      :class="[
        `seneu-toggle--${size}`,
        {
          'seneu-toggle--error':    !!error,
          'seneu-toggle--disabled': disabled,
          'seneu-toggle--loading':  loading,
          'seneu-toggle--reverse':  reverse,
          'seneu-toggle--stacked':  !!description,
        },
      ]"
    >
      <span class="seneu-toggle__wrap">
        <input
          :id="toggleId"
          type="checkbox"
          role="switch"
          class="seneu-toggle__input"
          :checked="modelValue"
          :disabled="disabled || loading"
          :aria-describedby="(hint || error) ? `${toggleId}-desc` : undefined"
          :aria-invalid="error ? 'true' : undefined"
          :aria-busy="loading || undefined"
          v-bind="$attrs"
          @change="onChange"
        />
        <span class="seneu-toggle__track">
          <span class="seneu-toggle__knob">
            <SeneuIcon
              v-if="loading"
              name="progress_activity"
              :size="iconSize"
              class="seneu-toggle__spinner"
              aria-hidden="true"
            />
          </span>
        </span>
      </span>

      <span v-if="description" class="seneu-toggle__text">
        <span class="seneu-toggle__label">
          <slot>{{ label }}</slot>
        </span>
        <span class="seneu-toggle__description">{{ description }}</span>
      </span>
      <span v-else-if="label || $slots.default" class="seneu-toggle__label">
        <slot>{{ label }}</slot>
      </span>
    </label>

    <p
      v-if="error || hint"
      :id="`${toggleId}-desc`"
      class="seneu-toggle-field__message"
      :class="error ? 'seneu-toggle-field__message--error' : 'seneu-toggle-field__message--hint'"
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
.seneu-toggle-field {
  display:        flex;
  flex-direction: column;
  gap:            var(--space-component-gap);
}

.seneu-toggle {
  display:     inline-flex;
  align-items: center;
  gap:         var(--space-inline-tight);
  cursor:      pointer;
  user-select: none;
}

.seneu-toggle--reverse { flex-direction: row-reverse; }
.seneu-toggle--stacked { align-items: flex-start; }

.seneu-toggle--disabled {
  opacity: var(--opacity-disabled);
  cursor:  not-allowed;
}

.seneu-toggle--loading {
  cursor: wait;
}

/* ── Track / knob ──────────────────────────────────────────── */
.seneu-toggle__wrap {
  position:    relative;
  display:     inline-flex;
  flex-shrink: 0;
}

.seneu-toggle__input {
  position: absolute;
  inset:    0;
  opacity:  0;
  margin:   0;
  cursor:   inherit;
}

.seneu-toggle__track {
  display:       block;
  border-radius: var(--radius-pill);
  background:    var(--color-border-interactive);
  position:      relative;
  transition:    background-color var(--duration-normal) var(--easing-standard);
}

.seneu-toggle--error .seneu-toggle__track {
  background: var(--color-border-danger);
}

.seneu-toggle__knob {
  position:        absolute;
  display:         flex;
  align-items:     center;
  justify-content: center;
  color:           var(--color-text-muted);
  border-radius:   var(--radius-circle);
  background:      var(--color-text-on-brand);
  box-shadow:      var(--elevation-raised);
  transition:      transform var(--duration-normal) var(--easing-standard);
}

.seneu-toggle__input:checked ~ .seneu-toggle__track { background: var(--color-surface-brand); }
.seneu-toggle--error .seneu-toggle__input:checked ~ .seneu-toggle__track { background: var(--color-border-danger); }

.seneu-toggle:not(.seneu-toggle--disabled):not(.seneu-toggle--loading):hover .seneu-toggle__track {
  opacity: var(--opacity-high);
}

.seneu-toggle__input:focus-visible ~ .seneu-toggle__track {
  box-shadow: 0 0 0 3px var(--color-ring-brand);
}

.seneu-toggle--error .seneu-toggle__input:focus-visible ~ .seneu-toggle__track {
  box-shadow: 0 0 0 3px var(--color-ring-danger);
}

.seneu-toggle--loading .seneu-toggle__track { background: var(--color-border-default); }

@keyframes seneu-spin {
  to { transform: rotate(360deg); }
}

.seneu-toggle__spinner {
  animation: seneu-spin 0.8s linear infinite;
}

/* Sizes */
.seneu-toggle--sm   .seneu-toggle__track { width: 32px; height: 18px; }
.seneu-toggle--base .seneu-toggle__track { width: 40px; height: 22px; }
.seneu-toggle--lg   .seneu-toggle__track { width: 48px; height: 26px; }

.seneu-toggle--sm   .seneu-toggle__knob { top: 2px; left: 2px; width: 14px; height: 14px; }
.seneu-toggle--base .seneu-toggle__knob { top: 2px; left: 2px; width: 18px; height: 18px; }
.seneu-toggle--lg   .seneu-toggle__knob { top: 2px; left: 2px; width: 22px; height: 22px; }

.seneu-toggle--sm   .seneu-toggle__input:checked ~ .seneu-toggle__track .seneu-toggle__knob { transform: translateX(14px); }
.seneu-toggle--base .seneu-toggle__input:checked ~ .seneu-toggle__track .seneu-toggle__knob { transform: translateX(18px); }
.seneu-toggle--lg   .seneu-toggle__input:checked ~ .seneu-toggle__track .seneu-toggle__knob { transform: translateX(22px); }

/* ── Label / description ──────────────────────────────────── */
.seneu-toggle__text {
  display:        flex;
  flex-direction: column;
  gap:            2px;
}

.seneu-toggle--sm   .seneu-toggle__label { font-size: var(--font-size-small); }
.seneu-toggle--base .seneu-toggle__label { font-size: var(--font-size-body);  }
.seneu-toggle--lg   .seneu-toggle__label { font-size: var(--font-size-lead);  }

.seneu-toggle__label {
  color:       var(--color-text-default);
  line-height: var(--line-height-normal);
  font-weight: var(--font-weight-medium);
}

.seneu-toggle__description {
  font-size:   var(--font-size-small);
  color:       var(--color-text-muted);
  line-height: var(--line-height-normal);
  font-weight: var(--font-weight-regular);
}

/* ── Message line ──────────────────────────────────────────── */
.seneu-toggle-field__message {
  display:     flex;
  align-items: center;
  gap:         4px;
  font-size:   var(--font-size-small);
  line-height: var(--line-height-normal);
}

.seneu-toggle-field__message--hint  { color: var(--color-text-muted);  }
.seneu-toggle-field__message--error { color: var(--color-text-danger); }

/* ── Reduced motion ────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .seneu-toggle__spinner { animation-duration: 0.01ms; }
}
</style>
