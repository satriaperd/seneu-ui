<script setup>
import { computed, ref, watch, onMounted, useId } from 'vue'
import SeneuIcon from '../display/SeneuIcon.vue'

defineOptions({ inheritAttrs: false })

/**
 * Checkbox with label/description, indeterminate state, and
 * group support — pass an Array modelValue + value to use as a
 * checkbox group (checked when modelValue includes value).
 */
const props = defineProps({
  /** Bound value — Boolean for a single checkbox, Array for a group */
  modelValue: {
    type: [Boolean, Array],
    default: false,
  },
  /** Value added to/removed from modelValue when used in a group */
  value: { type: null, default: undefined },
  /** Label shown next to the box */
  label: { type: String, default: '' },
  /** Secondary text shown below the label */
  description: { type: String, default: '' },
  /** Dash state — visually distinct from checked/unchecked, does not affect modelValue */
  indeterminate: { type: Boolean, default: false },
  /** Helper text shown below the field */
  hint: { type: String, default: '' },
  /** Error message — sets error state when non-empty */
  error: { type: String, default: '' },
  /** Disables the field entirely */
  disabled: { type: Boolean, default: false },
  /** Controls box and label size */
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
const checkboxId = computed(() => props.id || _uid)

const iconSize = computed(() => ({ sm: 12, base: 14, lg: 16 }[props.size]))

const isChecked = computed(() => {
  if (Array.isArray(props.modelValue)) return props.modelValue.includes(props.value)
  return !!props.modelValue
})

const inputRef = ref(null)

function onChange(e) {
  if (Array.isArray(props.modelValue)) {
    const next = [...props.modelValue]
    if (e.target.checked) {
      if (!next.includes(props.value)) next.push(props.value)
    } else {
      const idx = next.indexOf(props.value)
      if (idx !== -1) next.splice(idx, 1)
    }
    emit('update:modelValue', next)
  } else {
    emit('update:modelValue', e.target.checked)
  }
  emit('change', e)
}

onMounted(() => { if (inputRef.value) inputRef.value.indeterminate = props.indeterminate })
watch(() => props.indeterminate, v => { if (inputRef.value) inputRef.value.indeterminate = v })
</script>

<template>
  <div class="seneu-checkbox-field">
    <label
      :for="checkboxId"
      class="seneu-checkbox"
      :class="[
        `seneu-checkbox--${size}`,
        {
          'seneu-checkbox--error':       !!error,
          'seneu-checkbox--disabled':    disabled,
          'seneu-checkbox--with-description': !!description,
        },
      ]"
    >
      <span class="seneu-checkbox__wrap">
        <input
          :id="checkboxId"
          ref="inputRef"
          type="checkbox"
          class="seneu-checkbox__input"
          :checked="isChecked"
          :disabled="disabled"
          :aria-describedby="(hint || error) ? `${checkboxId}-desc` : undefined"
          :aria-invalid="error ? 'true' : undefined"
          v-bind="$attrs"
          @change="onChange"
        />
        <span class="seneu-checkbox__box">
          <SeneuIcon
            v-if="indeterminate"
            name="remove"
            :size="iconSize"
            aria-hidden="true"
          />
          <SeneuIcon
            v-else
            name="check"
            :size="iconSize"
            class="seneu-checkbox__check"
            aria-hidden="true"
          />
        </span>
      </span>

      <span v-if="description" class="seneu-checkbox__text">
        <span class="seneu-checkbox__label">
          <slot>{{ label }}</slot>
        </span>
        <span class="seneu-checkbox__description">{{ description }}</span>
      </span>
      <span v-else-if="label || $slots.default" class="seneu-checkbox__label">
        <slot>{{ label }}</slot>
      </span>
    </label>

    <p
      v-if="error || hint"
      :id="`${checkboxId}-desc`"
      class="seneu-checkbox-field__message"
      :class="error ? 'seneu-checkbox-field__message--error' : 'seneu-checkbox-field__message--hint'"
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
.seneu-checkbox-field {
  display:        flex;
  flex-direction: column;
  gap:            var(--space-component-gap);
}

.seneu-checkbox {
  display:     inline-flex;
  align-items: center;
  gap:         var(--space-inline-tight);
  cursor:      pointer;
  user-select: none;
}

/* Multi-line label+description: align the box to the top of the
   first line instead of centering against the whole text block */
.seneu-checkbox--with-description { align-items: flex-start; }

.seneu-checkbox--disabled {
  opacity: var(--opacity-disabled);
  cursor:  not-allowed;
}

/* ── Box ───────────────────────────────────────────────────── */
.seneu-checkbox__wrap {
  position:     relative;
  display:      inline-flex;
  align-items:  center;
  justify-content: center;
  flex-shrink:  0;
}

.seneu-checkbox--sm   .seneu-checkbox__wrap { width: 16px; height: 16px; }
.seneu-checkbox--base .seneu-checkbox__wrap { width: 20px; height: 20px; }
.seneu-checkbox--lg   .seneu-checkbox__wrap { width: 24px; height: 24px; }


.seneu-checkbox__input {
  position: absolute;
  inset:    0;
  opacity:  0;
  margin:   0;
  cursor:   inherit;
}

.seneu-checkbox__box {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           100%;
  height:          100%;
  color:           transparent;
  background:      var(--color-surface-raised);
  border:          2px solid var(--color-border-default);
  border-radius:   var(--radius-subtle);
  transition:
    border-color     var(--duration-fast) var(--easing-standard),
    background-color var(--duration-fast) var(--easing-standard),
    box-shadow       var(--duration-fast) var(--easing-standard);
  pointer-events: none;
}

.seneu-checkbox--error .seneu-checkbox__box {
  border-color: var(--color-border-danger);
}

.seneu-checkbox:not(.seneu-checkbox--disabled):hover .seneu-checkbox__box {
  border-color: var(--color-border-focus);
}

.seneu-checkbox__input:checked ~ .seneu-checkbox__box {
  color:        var(--color-text-on-brand);
  background:   var(--color-surface-brand);
  border-color: var(--color-surface-brand);
}

.seneu-checkbox__input:indeterminate ~ .seneu-checkbox__box {
  color:        var(--color-text-on-brand);
  background:   var(--color-surface-brand);
  border-color: var(--color-surface-brand);
}

.seneu-checkbox__input:focus-visible ~ .seneu-checkbox__box {
  border-color: var(--color-border-focus);
  box-shadow:   0 0 0 3px var(--color-ring-brand);
}

.seneu-checkbox--error .seneu-checkbox__input:focus-visible ~ .seneu-checkbox__box {
  border-color: var(--color-border-danger);
  box-shadow:   0 0 0 3px var(--color-ring-danger);
}

/* ── Label / description ──────────────────────────────────── */
.seneu-checkbox__text {
  display:        flex;
  flex-direction: column;
  gap:            2px;
  padding-top:    1px;
}

.seneu-checkbox--sm   .seneu-checkbox__label { font-size: var(--font-size-small); }
.seneu-checkbox--base .seneu-checkbox__label { font-size: var(--font-size-body);  }
.seneu-checkbox--lg   .seneu-checkbox__label { font-size: var(--font-size-lead);  }

.seneu-checkbox__label {
  color:       var(--color-text-default);
  line-height: var(--line-height-normal);
  font-weight: var(--font-weight-medium);
}

.seneu-checkbox__description {
  font-size:   var(--font-size-small);
  color:       var(--color-text-muted);
  line-height: var(--line-height-normal);
  font-weight: var(--font-weight-regular);
}

/* ── Message line ──────────────────────────────────────────── */
.seneu-checkbox-field__message {
  display:     flex;
  align-items: center;
  gap:         4px;
  font-size:   var(--font-size-small);
  line-height: var(--line-height-normal);
}

.seneu-checkbox-field__message--hint  { color: var(--color-text-muted);  }
.seneu-checkbox-field__message--error { color: var(--color-text-danger); }
</style>
