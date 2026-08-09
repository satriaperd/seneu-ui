<script setup>
import { ref } from 'vue'
import SeneuDrawer from '../components/feedback/SeneuDrawer.vue'
import SeneuButton from '../components/form/SeneuButton.vue'
import SeneuInput from '../components/form/SeneuInput.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const placementOpen = ref(false)
const activePlacement = ref('right')
const sizeOpen = ref(false)
const activeSize = ref('base')
const formOpen = ref(false)
const noCloseOpen = ref(false)
const focusTrapOpen = ref(false)

function openPlacement(p) {
  activePlacement.value = p
  placementOpen.value = true
}
function openSize(s) {
  activeSize.value = s
  sizeOpen.value = true
}
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Placements">
      <div class="showcase-row">
        <SeneuButton variant="default" size="sm" @click="openPlacement('right')">Right</SeneuButton>
        <SeneuButton variant="default" size="sm" @click="openPlacement('left')">Left</SeneuButton>
        <SeneuButton variant="default" size="sm" @click="openPlacement('top')">Top</SeneuButton>
        <SeneuButton variant="default" size="sm" @click="openPlacement('bottom')">Bottom</SeneuButton>
      </div>
      <SeneuDrawer v-model="placementOpen" :placement="activePlacement" :title="`Drawer from ${activePlacement}`">
        This panel slides in from the {{ activePlacement }} edge of the screen.
      </SeneuDrawer>
    </DevShowcaseSection>

    <DevShowcaseSection title="Sizes">
      <div class="showcase-row">
        <SeneuButton variant="default" size="sm" @click="openSize('sm')">Small</SeneuButton>
        <SeneuButton variant="default" size="sm" @click="openSize('base')">Base</SeneuButton>
        <SeneuButton variant="default" size="sm" @click="openSize('lg')">Large</SeneuButton>
      </div>
      <SeneuDrawer v-model="sizeOpen" :size="activeSize" :title="`${activeSize} drawer`">
        This drawer is using the "{{ activeSize }}" size.
      </SeneuDrawer>
    </DevShowcaseSection>

    <DevShowcaseSection title="Form with Footer">
      <SeneuButton variant="brand" @click="formOpen = true">Edit Profile</SeneuButton>
      <SeneuDrawer v-model="formOpen" title="Edit profile">
        <SeneuInput label="Display name" placeholder="Ayu Lestari" />
        <template #footer>
          <SeneuButton variant="default" size="sm" @click="formOpen = false">Cancel</SeneuButton>
          <SeneuButton variant="brand" size="sm" @click="formOpen = false">Save changes</SeneuButton>
        </template>
      </SeneuDrawer>
    </DevShowcaseSection>

    <DevShowcaseSection title="No Close Button / Manual Dismiss">
      <SeneuButton variant="default" @click="noCloseOpen = true">Open (no close button)</SeneuButton>
      <SeneuDrawer v-model="noCloseOpen" title="Read this first" :show-close="false" :close-on-backdrop="false" :close-on-esc="false">
        You must scroll and accept before continuing.
        <template #footer>
          <SeneuButton variant="brand" size="sm" @click="noCloseOpen = false">I understand</SeneuButton>
        </template>
      </SeneuDrawer>
    </DevShowcaseSection>

    <DevShowcaseSection title="Focus Trap Demo">
      <SeneuButton variant="default" @click="focusTrapOpen = true">Open + Try Tab / Shift+Tab</SeneuButton>
      <SeneuDrawer v-model="focusTrapOpen" title="Keyboard focus stays inside">
        <p class="showcase-caption">Sama kayak Modal — Tab dari elemen terakhir muter balik ke yang pertama, dan fokus balik ke tombol trigger pas ditutup.</p>
        <SeneuInput label="First field" placeholder="Focus starts here" />
        <template #footer>
          <SeneuButton variant="default" size="sm" @click="focusTrapOpen = false">Cancel</SeneuButton>
          <SeneuButton variant="brand" size="sm" @click="focusTrapOpen = false">Save</SeneuButton>
        </template>
      </SeneuDrawer>
    </DevShowcaseSection>

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
  margin: 0 0 var(--primitive-space-3);
}
</style>
