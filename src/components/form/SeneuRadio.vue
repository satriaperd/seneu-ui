<script setup>
import { computed, useId } from 'vue'
import SeneuIcon from '../display/SeneuIcon.vue'

defineOptions({ inheritAttrs: false })

/**
 * Single radio button. Group multiple instances by binding the
 * same v-model and giving each a distinct value (and, ideally,
 * a shared name for native keyboard arrow-key navigation).
 */
const props = defineProps({
  /** Bound group value — this radio is checked when modelValue === value */
  modelValue: { type: null, default: undefined },
  /** Value this radio represents within the group */
  value: { type: null, default: undefined },
  /** Native name attribute — shared across a group */
  name: { type: String, default: '' },
  /** Label shown next to the dot */
  label: { type: String, default: '' },
  /** Secondary text shown below the label */
  description: { type: String, default: '' },
  /** Helper text shown below the field */
  hint: { type: String, default: '' },
  /** Error message — sets error state when non-empty */
  error: { type: String, default: '' },
  /** Disables the field entirely */
  disabled: { type: Boolean, default: false },
  /** Controls dot and label size */
  size: {
    type: String,
    default: 'base',
    validator: v => ['sm', 'base', 'lg'].includes(v),
  },
  /** Explicit id — auto-generated when omitted */
  id: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'change'])

const _uid = useId()
const radioId = computed(() => props.id || _uid)

const isChecked = computed(() => props.modelValue === props.value)

function onChange(e) {
  emit('update:modelValue', props.value)
  emit('change', e)
}
</script>

<template>
  <div class="seneu-radio-field">
    <label
      :for="radioId"
      class="seneu-radio"
      :class="[
        `seneu-radio--${size}`,
        {
          'seneu-radio--error':    !!error,
          'seneu-radio--disabled': disabled,
        },
      ]"
    >
      <span class="seneu-radio__wrap">
        <input
          :id="radioId"
          type="radio"
          class="seneu-radio__input"
          :name="name"
          :checked="isChecked"
          :disabled="disabled"
          :aria-describedby="(hint || error) ? `${radioId}-desc` : undefined"
          :aria-invalid="error ? 'true' : undefined"
          v-bind="$attrs"
          @change="onChange"
        />
        <span class="seneu-radio__dot" />
      </span>

      <span v-if="description" class="seneu-radio__text">
        <span class="seneu-radio__label">
          <slot>{{ label }}</slot>
        </span>
        <span class="seneu-radio__description">{{ description }}</span>
      </span>
      <span v-else-if="label || $slots.default" class="seneu-radio__label">
        <slot>{{ label }}</slot>
      </span>
    </label>

    <p
      v-if="error || hint"
      :id="`${radioId}-desc`"
      class="seneu-radio-field__message"
      :class="error ? 'seneu-radio-field__message--error' : 'seneu-radio-field__message--hint'"
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
.seneu-radio-field {
  display:        flex;
  flex-direction: column;
  gap:            var(--space-component-gap);
}

.seneu-radio {
  display:     inline-flex;
  align-items: flex-start;
  gap:         var(--space-inline-tight);
  cursor:      pointer;
  user-select: none;
}

.seneu-radio--disabled {
  opacity: var(--opacity-disabled);
  cursor:  not-allowed;
}

/* ── Dot ───────────────────────────────────────────────────── */
.seneu-radio__wrap {
  position:        relative;
  display:         inline-flex;
  align-items:     center;
  justify-content: center;
  flex-shrink:     0;
}

.seneu-radio--sm   .seneu-radio__wrap { width: 16px; height: 16px; margin-top: 2px; }
.seneu-radio--base .seneu-radio__wrap { width: 20px; height: 20px; margin-top: 1px; }
.seneu-radio--lg   .seneu-radio__wrap { width: 24px; height: 24px; margin-top: 0;   }

.seneu-radio__input {
  position: absolute;
  inset:    0;
  opacity:  0;
  margin:   0;
  cursor:   inherit;
}

.seneu-radio__dot {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           100%;
  height:          100%;
  background:      var(--color-surface-raised);
  border:          2px solid var(--color-border-default);
  border-radius:   var(--radius-circle);
  transition:
    border-color     var(--duration-fast) var(--easing-standard),
    background-color var(--duration-fast) var(--easing-standard),
    box-shadow       var(--duration-fast) var(--easing-standard);
  pointer-events: none;
}

.seneu-radio--error .seneu-radio__dot {
  border-color: var(--color-border-danger);
}

.seneu-radio:not(.seneu-radio--disabled):hover .seneu-radio__dot {
  border-color: var(--color-border-focus);
}

.seneu-radio__input:checked ~ .seneu-radio__dot {
  border-color: var(--color-surface-brand);
}

.seneu-radio__input:checked ~ .seneu-radio__dot::after {
  content:       '';
  display:       block;
  border-radius: var(--radius-circle);
  background:    var(--color-surface-brand);
}

.seneu-radio--sm   .seneu-radio__input:checked ~ .seneu-radio__dot::after { width: 8px;  height: 8px;  }
.seneu-radio--base .seneu-radio__input:checked ~ .seneu-radio__dot::after { width: 10px; height: 10px; }
.seneu-radio--lg   .seneu-radio__input:checked ~ .seneu-radio__dot::after { width: 12px; height: 12px; }

.seneu-radio__input:focus-visible ~ .seneu-radio__dot {
  border-color: var(--color-border-focus);
  box-shadow:   0 0 0 3px var(--color-ring-brand);
}

.seneu-radio--error .seneu-radio__input:focus-visible ~ .seneu-radio__dot {
  border-color: var(--color-border-danger);
  box-shadow:   0 0 0 3px var(--color-ring-danger);
}

/* ── Label / description ──────────────────────────────────── */
.seneu-radio__text {
  display:        flex;
  flex-direction: column;
  gap:            2px;
  padding-top:    1px;
}

.seneu-radio--sm   .seneu-radio__label { font-size: var(--font-size-small); }
.seneu-radio--base .seneu-radio__label { font-size: var(--font-size-body);  }
.seneu-radio--lg   .seneu-radio__label { font-size: var(--font-size-lead);  }

.seneu-radio__label {
  color:       var(--color-text-default);
  line-height: var(--line-height-normal);
  font-weight: var(--font-weight-medium);
}

.seneu-radio__description {
  font-size:   var(--font-size-small);
  color:       var(--color-text-muted);
  line-height: var(--line-height-normal);
  font-weight: var(--font-weight-regular);
}

/* ── Message line ──────────────────────────────────────────── */
.seneu-radio-field__message {
  display:     flex;
  align-items: center;
  gap:         4px;
  font-size:   var(--font-size-small);
  line-height: var(--line-height-normal);
}

.seneu-radio-field__message--hint  { color: var(--color-text-muted);  }
.seneu-radio-field__message--error { color: var(--color-text-danger); }
</style>
