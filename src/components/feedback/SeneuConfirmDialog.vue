<script setup>
import SeneuModal from './SeneuModal.vue'
import SeneuButton from '../form/SeneuButton.vue'
import SeneuIcon from '../display/SeneuIcon.vue'
import { useConfirmDialog } from '../../composables/useConfirmDialog.js'

/**
 * Promise-based confirmation dialog — the visual half of `useConfirmDialog`.
 * Mount this once near your app root; every `confirm()` call anywhere in
 * the app renders through this single instance.
 */
const { visible, options, isLoading, handleConfirm, handleCancel } = useConfirmDialog()

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
</script>

<template>
  <SeneuModal
    :model-value="visible"
    :title="options.title"
    size="sm"
    :close-on-backdrop="!isLoading"
    :close-on-esc="!isLoading"
    :show-close="!isLoading"
    @update:model-value="handleCancel"
    @close="handleCancel"
  >
    <div class="seneu-confirm-dialog__body">
      <div
        class="seneu-confirm-dialog__icon-wrap"
        :class="`seneu-confirm-dialog__icon-wrap--${options.variant || 'default'}`"
      >
        <SeneuIcon :name="options.icon || VARIANT_ICONS[options.variant || 'default']" :size="26" />
      </div>
      <p v-if="options.message" class="seneu-confirm-dialog__message">{{ options.message }}</p>
    </div>

    <template #footer>
      <SeneuButton variant="default" :disabled="isLoading" @click="handleCancel">
        {{ options.cancelLabel }}
      </SeneuButton>
      <SeneuButton
        :variant="CONFIRM_BUTTON_VARIANT[options.variant || 'default']"
        :loading="isLoading"
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
  align-items: center;
  gap: var(--space-stack-normal);
  text-align: center;
  padding: var(--space-inline-tight) 0;
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

/* ── Message ───────────────────────────────────────────── */
.seneu-confirm-dialog__message {
  margin: 0;
  font-size: var(--font-size-body);
  color: var(--color-text-muted);
  line-height: var(--line-height-relaxed);
}
</style>
