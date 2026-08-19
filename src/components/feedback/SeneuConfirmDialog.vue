<script setup>
import { computed } from 'vue'
import SeneuModal from './SeneuModal.vue'
import SeneuButton from '../form/SeneuButton.vue'
import SeneuIcon from '../display/SeneuIcon.vue'
import { useConfirmDialog } from '../../composables/useConfirmDialog.js'

/**
 * Multi-action confirmation dialog — the visual half of `useConfirmDialog`.
 * Mount this once near your app root; every `confirm()` call anywhere in
 * the app renders through this single instance.
 *
 * Three sizes cap how much content/how many buttons make sense:
 * - small:  Confirm + Cancel only. Icon and description are optional.
 * - medium: adds an optional Discard (secondary CTA). Icon is optional,
 *           description is expected.
 * - large:  adds an optional Additional action, visually separated from
 *           the Confirm/Discard/Cancel group. Icon, title, and
 *           description are all expected.
 */
const { visible, options, isLoading, loadingAction, handleConfirm, handleDiscard, handleAdditional, handleCancel } = useConfirmDialog()

const VARIANT_ICONS = {
  default: 'help',
  brand: 'auto_awesome',
  success: 'check_circle',
  warning: 'warning',
  danger: 'delete_forever',
  info: 'info',
}

const CONFIRM_BUTTON_VARIANT = {
  default: 'brand',
  brand: 'brand',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
}

const MODAL_SIZE = { small: 'sm', medium: 'base', large: 'lg' }

const size = computed(() => options.value.size || 'medium')
const modalSize = computed(() => MODAL_SIZE[size.value] || 'base')

// Icon: always shown on 'large' (falls back to the variant's default icon).
// On 'medium'/'small' it's optional — only shown if the caller explicitly
// passed one.
const showIcon = computed(() => size.value === 'large' || !!options.value.icon)
const resolvedIcon = computed(() => options.value.icon || VARIANT_ICONS[options.value.variant || 'default'])

// Buttons are capped per size regardless of what the caller passed in —
// small never shows Discard/Additional, medium never shows Additional.
const showDiscard = computed(() => size.value !== 'small' && !!options.value.discardLabel)
const showAdditional = computed(() => size.value === 'large' && !!options.value.additionalLabel)
</script>

<template>
  <SeneuModal
    :model-value="visible"
    :size="modalSize"
    :close-on-backdrop="!isLoading"
    :close-on-esc="!isLoading"
    :show-close="!isLoading"
    @update:model-value="handleCancel"
    @close="handleCancel"
  >
    <div class="seneu-confirm-dialog__body">
      <div
        v-if="showIcon"
        class="seneu-confirm-dialog__icon-wrap"
        :class="`seneu-confirm-dialog__icon-wrap--${options.variant || 'default'}`"
      >
        <SeneuIcon :name="resolvedIcon" :size="26" />
      </div>
      <div class="seneu-confirm-dialog__text">
        <h2 class="seneu-confirm-dialog__title">{{ options.title }}</h2>
        <p v-if="options.message" class="seneu-confirm-dialog__message">{{ options.message }}</p>
      </div>
    </div>

    <template #footer>
      <SeneuButton
        v-if="showAdditional"
        variant="default"
        class="seneu-confirm-dialog__additional"
        :disabled="isLoading && loadingAction !== 'additional'"
        :loading="loadingAction === 'additional'"
        @click="handleAdditional"
      >
        {{ options.additionalLabel }}
      </SeneuButton>

      <SeneuButton variant="default" :disabled="isLoading" @click="handleCancel">
        {{ options.cancelLabel }}
      </SeneuButton>
      <SeneuButton
        v-if="showDiscard"
        variant="default"
        :disabled="isLoading && loadingAction !== 'discard'"
        :loading="loadingAction === 'discard'"
        @click="handleDiscard"
      >
        {{ options.discardLabel }}
      </SeneuButton>
      <SeneuButton
        :variant="CONFIRM_BUTTON_VARIANT[options.variant || 'default']"
        :disabled="isLoading && loadingAction !== 'confirm'"
        :loading="loadingAction === 'confirm'"
        @click="handleConfirm"
      >
        {{ options.confirmLabel }}
      </SeneuButton>
    </template>
  </SeneuModal>
</template>

<style>
.seneu-confirm-dialog__body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-stack-normal);
  text-align: left;
  padding: var(--space-inline-tight) 0;
}

.seneu-confirm-dialog__text {
  display: flex;
  flex-direction: column;
  gap: var(--space-stack-tight);
}

/* ── Icon ──────────────────────────────────────────────── */
.seneu-confirm-dialog__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: var(--radius-circle);
  flex-shrink: 0;
  background-color: var(--seneu-confirm-icon-bg);
  color: var(--seneu-confirm-icon-color);
}
.seneu-confirm-dialog__icon-wrap--default {
  --seneu-confirm-icon-bg: var(--color-surface-raised-hover);
  --seneu-confirm-icon-color: var(--color-text-muted);
}
.seneu-confirm-dialog__icon-wrap--brand {
  --seneu-confirm-icon-bg: var(--color-surface-brand-subtle);
  --seneu-confirm-icon-color: var(--color-text-brand);
}
.seneu-confirm-dialog__icon-wrap--success {
  --seneu-confirm-icon-bg: var(--color-surface-success-subtle);
  --seneu-confirm-icon-color: var(--color-text-success);
}
.seneu-confirm-dialog__icon-wrap--warning {
  --seneu-confirm-icon-bg: var(--color-surface-warning-subtle);
  --seneu-confirm-icon-color: var(--color-text-warning);
}
.seneu-confirm-dialog__icon-wrap--danger {
  --seneu-confirm-icon-bg: var(--color-surface-danger-subtle);
  --seneu-confirm-icon-color: var(--color-text-danger);
}
.seneu-confirm-dialog__icon-wrap--info {
  --seneu-confirm-icon-bg: var(--color-surface-info-subtle);
  --seneu-confirm-icon-color: var(--color-text-info);
}

/* ── Title / Message ───────────────────────────────────── */
.seneu-confirm-dialog__title {
  margin: 0;
  font-size: var(--font-size-lead);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-default);
  line-height: var(--line-height-tight);
}

.seneu-confirm-dialog__message {
  margin: 0;
  font-size: var(--font-size-body);
  color: var(--color-text-muted);
  line-height: var(--line-height-relaxed);
}

/* ── Footer: additional action sits apart from the main group ─ */
.seneu-confirm-dialog__additional {
  margin-right: auto;
}
</style>
