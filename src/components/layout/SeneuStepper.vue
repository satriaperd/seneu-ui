<script setup>
import SeneuIcon from '../display/SeneuIcon.vue'

/**
 * Multi-step progress indicator. Renders numbered circles, dots, or
 * per-step icons, connected by a progress line. Steps before the active
 * one become clickable (native <button>) when `clickable` is true, letting
 * users navigate back to a completed step.
 */
const props = defineProps({
  /** Current active step (1-based). Use with v-model. */
  modelValue: {
    type: Number,
    default: 1,
  },
  /** Array of { title, description?, icon?, status?: 'error' } */
  steps: {
    type: Array,
    default: () => [],
  },
  orientation: {
    type: String,
    default: 'horizontal',
    validator: v => ['horizontal', 'vertical'].includes(v),
  },
  /** numbered: shows step numbers. dot: shows small dots. icon: shows step.icon. */
  variant: {
    type: String,
    default: 'numbered',
    validator: v => ['numbered', 'dot', 'icon'].includes(v),
  },
  /** Allow clicking completed steps to go back */
  clickable: {
    type: Boolean,
    default: false,
  },
  /** Shows shimmer placeholders instead of steps */
  loading: {
    type: Boolean,
    default: false,
  },
  ariaLabel: {
    type: String,
    default: 'Progress steps',
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

function isClickable(index) {
  return props.clickable && index + 1 < props.modelValue
}

function go(step) {
  if (step === props.modelValue) return
  emit('change', { from: props.modelValue, to: step })
  emit('update:modelValue', step)
}

function stepAriaLabel(step, i) {
  const state = i + 1 < props.modelValue
    ? 'completed'
    : i + 1 === props.modelValue
      ? 'current'
      : 'upcoming'
  return `Step ${i + 1}: ${step.title} — ${step.status === 'error' ? 'error' : state}`
}
</script>

<template>
  <div
    class="seneu-stepper"
    :class="[`seneu-stepper--${orientation}`, `seneu-stepper--${variant}`]"
    role="list"
    :aria-label="ariaLabel"
  >
    <template v-if="loading">
      <template v-for="n in 3" :key="n">
        <div v-if="n > 1" class="seneu-stepper__line" aria-hidden="true" />
        <div class="seneu-stepper__step">
          <span class="seneu-stepper__skeleton-circle" aria-hidden="true" />
          <span class="seneu-stepper__skeleton-title" aria-hidden="true" />
        </div>
      </template>
    </template>

    <template v-else>
      <template v-for="(step, i) in steps" :key="i">
        <div
          v-if="i > 0"
          class="seneu-stepper__line"
          :class="{
            'seneu-stepper__line--done': i < modelValue,
            'seneu-stepper__line--active': i === modelValue - 1,
          }"
          aria-hidden="true"
        />

        <component
          :is="isClickable(i) ? 'button' : 'div'"
          :type="isClickable(i) ? 'button' : undefined"
          class="seneu-stepper__step"
          :class="{
            'seneu-stepper__step--completed': i + 1 < modelValue,
            'seneu-stepper__step--active': i + 1 === modelValue,
            'seneu-stepper__step--upcoming': i + 1 > modelValue,
            'seneu-stepper__step--error': step.status === 'error',
            'seneu-stepper__step--clickable': isClickable(i),
          }"
          role="listitem"
          :aria-current="i + 1 === modelValue ? 'step' : undefined"
          :aria-label="stepAriaLabel(step, i)"
          @click="isClickable(i) && go(i + 1)"
        >
          <span class="seneu-stepper__circle">
            <SeneuIcon v-if="step.status === 'error'" name="error" :size="16" class="seneu-stepper__icon" />
            <SeneuIcon v-else-if="i + 1 < modelValue" name="check" :size="16" class="seneu-stepper__icon" />
            <SeneuIcon v-else-if="step.icon && variant === 'icon'" :name="step.icon" :size="16" class="seneu-stepper__icon" />
            <span v-else-if="variant !== 'dot'" class="seneu-stepper__num">{{ i + 1 }}</span>
          </span>

          <span class="seneu-stepper__body">
            <span class="seneu-stepper__title">{{ step.title }}</span>
            <span v-if="step.description" class="seneu-stepper__desc">{{ step.description }}</span>
          </span>
        </component>
      </template>
    </template>
  </div>
</template>

<style>
/* ── Horizontal layout ─────────────────────────────────── */
.seneu-stepper--horizontal {
  display: flex;
  align-items: flex-start;
}
.seneu-stepper--horizontal .seneu-stepper__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: none;
}
.seneu-stepper--horizontal .seneu-stepper__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 96px;
  gap: 2px;
}
.seneu-stepper--horizontal .seneu-stepper__line {
  flex: 1;
  min-width: 24px;
  height: 2px;
  margin-top: 15px;
}

/* ── Vertical layout ───────────────────────────────────── */
.seneu-stepper--vertical { display: flex; flex-direction: column; }
.seneu-stepper--vertical .seneu-stepper__step {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 14px;
}
.seneu-stepper--vertical .seneu-stepper__body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 4px;
  padding-bottom: 8px;
  text-align: left;
}
.seneu-stepper--vertical .seneu-stepper__line {
  width: 2px;
  min-height: 20px;
  align-self: stretch;
  margin-left: 15px;
}

/* ── Step wrapper reset (for the clickable <button> case) ─ */
.seneu-stepper__step {
  background: transparent;
  border: none;
  padding: 0;
  font: inherit;
  color: inherit;
}
.seneu-stepper__step:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
  border-radius: var(--radius-element);
}

/* ── Circle ────────────────────────────────────────────── */
.seneu-stepper__circle {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-circle);
  border: 2px solid var(--color-border-default);
  background-color: var(--color-surface-raised);
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background-color var(--duration-normal) var(--easing-standard),
              border-color var(--duration-normal) var(--easing-standard),
              color var(--duration-normal) var(--easing-standard);
}
.seneu-stepper__num { font-size: var(--font-size-small); font-weight: var(--font-weight-semibold); }

/* ── Step states ───────────────────────────────────────── */
.seneu-stepper__step--completed .seneu-stepper__circle {
  background-color: var(--color-surface-brand);
  border-color: var(--color-surface-brand);
  color: var(--color-text-on-brand);
}
.seneu-stepper__step--active .seneu-stepper__circle {
  border-color: var(--color-surface-brand);
  color: var(--color-text-brand);
  box-shadow: 0 0 0 4px var(--color-ring-brand);
}
.seneu-stepper__step--error .seneu-stepper__circle {
  background-color: var(--color-surface-danger-subtle);
  border-color: var(--color-border-danger);
  color: var(--color-text-danger);
}
.seneu-stepper__step--clickable { cursor: pointer; }
.seneu-stepper__step--clickable:hover .seneu-stepper__circle {
  border-color: var(--color-surface-brand);
  background-color: var(--color-surface-brand-subtle);
}

/* ── Labels ────────────────────────────────────────────── */
.seneu-stepper__title {
  font-family: var(--font-sans);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-muted);
  transition: color var(--duration-normal) var(--easing-standard);
}
.seneu-stepper__step--active .seneu-stepper__title { color: var(--color-text-default); font-weight: var(--font-weight-semibold); }
.seneu-stepper__step--completed .seneu-stepper__title { color: var(--color-text-default); }
.seneu-stepper__step--error .seneu-stepper__title { color: var(--color-text-danger); }
.seneu-stepper__desc {
  font-family: var(--font-sans);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  line-height: var(--line-height-relaxed);
}

/* ── Connector line ────────────────────────────────────── */
.seneu-stepper__line {
  background-color: var(--color-border-default);
  transition: background-color var(--duration-normal) var(--easing-standard);
}
.seneu-stepper__line--done { background-color: var(--color-surface-brand); }

/* ── Dot variant ───────────────────────────────────────── */
.seneu-stepper--dot .seneu-stepper__circle { width: 12px; height: 12px; border-width: 2px; }
.seneu-stepper--dot.seneu-stepper--horizontal .seneu-stepper__line { margin-top: 5px; }
.seneu-stepper--dot.seneu-stepper--vertical .seneu-stepper__line { margin-left: 5px; }
.seneu-stepper--dot .seneu-stepper__step--active .seneu-stepper__circle {
  background-color: var(--color-surface-brand);
  box-shadow: 0 0 0 3px var(--color-ring-brand);
}
.seneu-stepper--dot .seneu-stepper__step--completed .seneu-stepper__circle { background-color: var(--color-surface-brand); }

/* ── Skeleton (loading) ────────────────────────────────── */
.seneu-stepper__skeleton-circle,
.seneu-stepper__skeleton-title {
  display: block;
  border-radius: var(--radius-subtle);
  background: linear-gradient(
    90deg,
    var(--color-surface-raised-hover) 25%,
    var(--color-surface-raised-active) 50%,
    var(--color-surface-raised-hover) 75%
  );
  background-size: 200% 100%;
  animation: seneu-stepper-shimmer 1.5s ease-in-out infinite;
}
.seneu-stepper__skeleton-circle { width: 32px; height: 32px; border-radius: var(--radius-circle); }
.seneu-stepper__skeleton-title { width: 64px; height: 12px; }
@keyframes seneu-stepper-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Responsive: force vertical stacking on mobile for horizontal orientation ── */
@media (max-width: 767px) {
  .seneu-stepper--horizontal { flex-direction: column; }
  .seneu-stepper--horizontal .seneu-stepper__step { flex-direction: row; align-items: flex-start; gap: 14px; }
  .seneu-stepper--horizontal .seneu-stepper__body { align-items: flex-start; text-align: left; max-width: none; gap: 4px; padding-top: 4px; padding-bottom: 8px; }
  .seneu-stepper--horizontal .seneu-stepper__line { flex: none; width: 2px; min-height: 20px; height: auto; align-self: stretch; margin-top: 0; margin-left: 15px; }
  .seneu-stepper--dot.seneu-stepper--horizontal .seneu-stepper__line { margin-left: 5px; }
}
</style>
