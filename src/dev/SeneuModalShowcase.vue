<script setup>
import { ref } from 'vue'
import SeneuModal from '../components/feedback/SeneuModal.vue'
import SeneuButton from '../components/form/SeneuButton.vue'
import SeneuInput from '../components/form/SeneuInput.vue'
import SeneuIcon from '../components/display/SeneuIcon.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const basicOpen = ref(false)
const sizeOpen = ref(false)
const activeSize = ref('base')
const footerOpen = ref(false)
const noCloseOpen = ref(false)
const customHeaderOpen = ref(false)
const fullscreenOpen = ref(false)
const focusTrapOpen = ref(false)

function openSize(size) {
  activeSize.value = size
  sizeOpen.value = true
}
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Basic">
      <SeneuButton variant="brand" @click="basicOpen = true">Open Modal</SeneuButton>
      <SeneuModal v-model="basicOpen" title="Confirm action">
        Are you sure you want to continue? This action cannot be undone.
        <template #footer>
          <SeneuButton variant="default" size="sm" @click="basicOpen = false">Cancel</SeneuButton>
          <SeneuButton variant="danger" size="sm" @click="basicOpen = false">Confirm</SeneuButton>
        </template>
      </SeneuModal>
    </DevShowcaseSection>

    <DevShowcaseSection title="Sizes">
      <div class="showcase-row">
        <SeneuButton variant="default" size="sm" @click="openSize('sm')">Small</SeneuButton>
        <SeneuButton variant="default" size="sm" @click="openSize('base')">Base</SeneuButton>
        <SeneuButton variant="default" size="sm" @click="openSize('lg')">Large</SeneuButton>
        <SeneuButton variant="default" size="sm" @click="openSize('xl')">Extra Large</SeneuButton>
      </div>
      <SeneuModal v-model="sizeOpen" :size="activeSize" :title="`${activeSize} modal`">
        This dialog is using the "{{ activeSize }}" size.
      </SeneuModal>
    </DevShowcaseSection>

    <DevShowcaseSection title="Form in Footer">
      <SeneuButton variant="brand" @click="footerOpen = true">Invite Member</SeneuButton>
      <SeneuModal v-model="footerOpen" title="Invite a member">
        <SeneuInput label="Email address" placeholder="teammate@company.com" />
        <template #footer>
          <SeneuButton variant="default" size="sm" @click="footerOpen = false">Cancel</SeneuButton>
          <SeneuButton variant="brand" size="sm" @click="footerOpen = false">Send invite</SeneuButton>
        </template>
      </SeneuModal>
    </DevShowcaseSection>

    <DevShowcaseSection title="No Close Button / Manual Dismiss">
      <SeneuButton variant="default" @click="noCloseOpen = true">Open (no close button)</SeneuButton>
      <SeneuModal v-model="noCloseOpen" title="Terms updated" :show-close="false" :close-on-backdrop="false" :close-on-esc="false">
        You must accept the new terms to continue using the app.
        <template #footer>
          <SeneuButton variant="brand" size="sm" @click="noCloseOpen = false">I accept</SeneuButton>
        </template>
      </SeneuModal>
    </DevShowcaseSection>

    <DevShowcaseSection title="Custom Header Slot">
      <SeneuButton variant="default" @click="customHeaderOpen = true">Open Custom Header</SeneuButton>
      <SeneuModal v-model="customHeaderOpen">
        <template #header>
          <div class="showcase-custom-header">
            <SeneuIcon name="celebration" :size="20" />
            <strong>You're on the waitlist!</strong>
          </div>
        </template>
        We'll email you as soon as a spot opens up.
      </SeneuModal>
    </DevShowcaseSection>

    <DevShowcaseSection title="Fullscreen">
      <SeneuButton variant="default" @click="fullscreenOpen = true">Open Fullscreen</SeneuButton>
      <SeneuModal v-model="fullscreenOpen" title="Fullscreen dialog" size="fullscreen">
        Useful for image editors, complex forms, or anything that needs the whole viewport.
      </SeneuModal>
    </DevShowcaseSection>

    <DevShowcaseSection title="Focus Trap Demo">
      <SeneuButton variant="default" @click="focusTrapOpen = true">Open + Try Tab / Shift+Tab</SeneuButton>
      <SeneuModal v-model="focusTrapOpen" title="Keyboard focus stays inside">
        <p class="showcase-caption">Tab dari tombol terakhir bakal muter balik ke input pertama, dan sebaliknya. Fokus juga balik ke tombol trigger pas ditutup.</p>
        <SeneuInput label="First field" placeholder="Focus starts here" />
        <template #footer>
          <SeneuButton variant="default" size="sm" @click="focusTrapOpen = false">Cancel</SeneuButton>
          <SeneuButton variant="brand" size="sm" @click="focusTrapOpen = false">Save</SeneuButton>
        </template>
      </SeneuModal>
    </DevShowcaseSection>

  </DevShowcase>
</template>

<style scoped>
.showcase-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--primitive-space-3);
}

.showcase-custom-header {
  display: flex;
  align-items: center;
  gap: var(--primitive-space-2);
  padding: var(--primitive-space-4) var(--primitive-space-5);
  width: 100%;
}

.showcase-caption {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  margin: 0 0 var(--primitive-space-3);
}
</style>
