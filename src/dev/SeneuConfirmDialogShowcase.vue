<script setup>
import { ref } from 'vue'
import SeneuConfirmDialog from '../components/feedback/SeneuConfirmDialog.vue'
import SeneuButton from '../components/form/SeneuButton.vue'
import { useConfirmDialog } from '../composables/useConfirmDialog.js'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const { confirm } = useConfirmDialog()
const lastResult = ref('')

async function askBasic() {
  const ok = await confirm({ title: 'Discard changes?', message: 'Your unsaved edits will be lost.' })
  lastResult.value = ok ? 'Confirmed: discard changes' : 'Cancelled'
}

async function askDanger() {
  const ok = await confirm({
    title: 'Delete this post?',
    message: 'This action cannot be undone.',
    variant: 'danger',
    confirmLabel: 'Delete',
  })
  lastResult.value = ok ? 'Confirmed: post deleted' : 'Cancelled'
}

async function askWarning() {
  const ok = await confirm({
    title: 'Leave without saving?',
    message: 'You have unsaved changes in this form.',
    variant: 'warning',
    confirmLabel: 'Leave',
  })
  lastResult.value = ok ? 'Confirmed: left the page' : 'Cancelled'
}

async function askAsync() {
  const ok = await confirm({
    title: 'Publish this article?',
    message: 'It will be visible to everyone immediately.',
    variant: 'success',
    confirmLabel: 'Publish',
    onConfirm: () => new Promise(resolve => setTimeout(resolve, 1500)),
  })
  lastResult.value = ok ? 'Confirmed: published (after a simulated 1.5s request)' : 'Cancelled'
}
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Basic">
      <SeneuButton variant="default" @click="askBasic">Discard changes</SeneuButton>
    </DevShowcaseSection>

    <DevShowcaseSection title="Variants">
      <div class="showcase-row">
        <SeneuButton variant="danger" @click="askDanger">Delete post</SeneuButton>
        <SeneuButton variant="warning" @click="askWarning">Leave page</SeneuButton>
      </div>
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
