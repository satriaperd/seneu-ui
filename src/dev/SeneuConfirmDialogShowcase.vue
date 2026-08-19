<script setup>
import { ref } from 'vue'
import SeneuConfirmDialog from '../components/feedback/SeneuConfirmDialog.vue'
import SeneuButton from '../components/form/SeneuButton.vue'
import { useConfirmDialog } from '../composables/useConfirmDialog.js'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const { confirm } = useConfirmDialog()
const lastResult = ref('')

async function askSmall() {
  const action = await confirm({
    size: 'small',
    title: 'Discard changes?',
  })
  lastResult.value = `small -> ${action}`
}

async function askMedium() {
  const action = await confirm({
    size: 'medium',
    title: 'Discard changes?',
    message: 'Your unsaved edits will be lost.',
  })
  lastResult.value = `medium -> ${action}`
}

async function askMediumWithIcon() {
  const action = await confirm({
    size: 'medium',
    title: 'Leave without saving?',
    message: 'You have unsaved changes in this form.',
    variant: 'warning',
    icon: 'warning',
    confirmLabel: 'Leave',
  })
  lastResult.value = `medium (icon) -> ${action}`
}

async function askMediumWithDiscard() {
  const action = await confirm({
    size: 'medium',
    title: 'Unsaved changes',
    message: 'Save your edits before leaving this page?',
    confirmLabel: 'Save',
    discardLabel: 'Discard',
  })
  lastResult.value = `medium (+discard) -> ${action}`
}

async function askLarge() {
  const action = await confirm({
    size: 'large',
    title: 'Delete this post?',
    message: 'This action cannot be undone.',
    variant: 'danger',
    confirmLabel: 'Delete',
  })
  lastResult.value = `large -> ${action}`
}

async function askLargeFull() {
  const action = await confirm({
    size: 'large',
    title: 'Unsaved changes',
    message: 'You have unsaved edits. Choose what to do before leaving this page.',
    confirmLabel: 'Save',
    discardLabel: 'Discard',
    cancelLabel: 'Cancel',
    additionalLabel: 'Preview changes',
    onAdditional: () => new Promise(resolve => setTimeout(resolve, 800)),
  })
  lastResult.value = `large (full 4-button) -> ${action}`
}

async function askAsync() {
  const action = await confirm({
    size: 'medium',
    title: 'Publish this article?',
    message: 'It will be visible to everyone immediately.',
    variant: 'success',
    confirmLabel: 'Publish',
    onConfirm: () => new Promise(resolve => setTimeout(resolve, 1500)),
  })
  lastResult.value = `async -> ${action}`
}
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Small — Confirm + Cancel only, icon & description optional">
      <SeneuButton variant="default" @click="askSmall">Discard changes (small)</SeneuButton>
    </DevShowcaseSection>

    <DevShowcaseSection title="Medium — icon optional, description expected">
      <div class="showcase-row">
        <SeneuButton variant="default" @click="askMedium">No icon</SeneuButton>
        <SeneuButton variant="warning" @click="askMediumWithIcon">With icon</SeneuButton>
        <SeneuButton variant="default" @click="askMediumWithDiscard">With Discard (secondary CTA)</SeneuButton>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Large — icon always shown, up to 4 buttons">
      <div class="showcase-row">
        <SeneuButton variant="danger" @click="askLarge">Delete (Confirm + Cancel)</SeneuButton>
        <SeneuButton variant="brand" @click="askLargeFull">Full set (Save / Discard / Cancel / Additional)</SeneuButton>
      </div>
      <p class="showcase-caption">
        Discard and Additional are opt-in per call — pass <code>discardLabel</code> / <code>additionalLabel</code>
        only when you need them, even at size "large". The Additional button sits apart from the
        Confirm/Discard/Cancel group on the left.
      </p>
    </DevShowcaseSection>

    <DevShowcaseSection title="Async onConfirm (Loading State)">
      <SeneuButton variant="success" @click="askAsync">Publish article</SeneuButton>
      <p class="showcase-caption">Confirm button nampilin loading spinner sambil nunggu onConfirm() (disimulasiin 1.5 detik).</p>
    </DevShowcaseSection>

    <DevShowcaseSection title="Result">
      <p class="showcase-result">{{ lastResult || 'Belum ada aksi yang dijalanin.' }}</p>
    </DevShowcaseSection>

    <!-- Mount once — every confirm() call anywhere renders through this single instance -->
    <SeneuConfirmDialog />

  </DevShowcase>
</template>

<style scoped>
.showcase-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--primitive-space-3);
}

.showcase-caption {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  margin-top: var(--primitive-space-2);
}

.showcase-result {
  font-size: var(--font-size-small);
  font-family: var(--font-mono);
  color: var(--color-text-default);
  background-color: var(--color-surface-raised-hover);
  padding: var(--primitive-space-3);
  border-radius: var(--radius-element);
}
</style>
