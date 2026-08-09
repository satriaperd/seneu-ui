<script setup>
import { ref } from 'vue'
import SeneuToast from '../components/feedback/SeneuToast.vue'
import SeneuButton from '../components/form/SeneuButton.vue'
import { useToast } from '../composables/useToast.js'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const toast = useToast()
const position = ref('top-right')
const positions = ['top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center']
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Variants">
      <div class="showcase-row">
        <SeneuButton variant="success" size="sm" @click="toast.success('Post published successfully.')">Success</SeneuButton>
        <SeneuButton variant="danger" size="sm" @click="toast.error('Failed to upload file.')">Error</SeneuButton>
        <SeneuButton variant="warning" size="sm" @click="toast.warning('Your session expires in 5 minutes.')">Warning</SeneuButton>
        <SeneuButton variant="info" size="sm" @click="toast.info('A new version is available.')">Info</SeneuButton>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="With Title">
      <SeneuButton
        variant="default"
        size="sm"
        @click="toast.error('The file exceeds the 10MB limit.', { title: 'Upload failed' })"
      >
        Show titled toast
      </SeneuButton>
    </DevShowcaseSection>

    <DevShowcaseSection title="Persistent (No Auto-dismiss)">
      <SeneuButton
        variant="default"
        size="sm"
        @click="toast.warning('This stays until you dismiss it.', { duration: 0 })"
      >
        Show persistent toast
      </SeneuButton>
    </DevShowcaseSection>

    <DevShowcaseSection title="Pause on Hover">
      <SeneuButton
        variant="default"
        size="sm"
        @click="toast.info('Hover over me — my 6s timer pauses while you do.', { duration: 6000 })"
      >
        Show hoverable toast
      </SeneuButton>
      <p class="showcase-caption">Arahin mouse ke toast-nya pas muncul — timer auto-dismiss bakal berhenti sampai mouse dipindah.</p>
    </DevShowcaseSection>

    <DevShowcaseSection title="Stacking">
      <SeneuButton
        variant="brand"
        size="sm"
        @click="() => { toast.success('First'); toast.info('Second'); toast.warning('Third') }"
      >
        Fire 3 toasts at once
      </SeneuButton>
    </DevShowcaseSection>

    <DevShowcaseSection title="Position">
      <div class="showcase-row">
        <SeneuButton
          v-for="p in positions"
          :key="p"
          variant="default"
          size="sm"
          :class="{ 'showcase-active': position === p }"
          @click="position = p"
        >
          {{ p }}
        </SeneuButton>
      </div>
      <SeneuButton variant="brand" size="sm" style="margin-top: var(--primitive-space-3)" @click="toast.info(`Positioned at ${position}`)">
        Show toast at "{{ position }}"
      </SeneuButton>
    </DevShowcaseSection>

    <!-- Mount once — every toast.*() call anywhere renders through this single instance -->
    <SeneuToast :position="position" />

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

.showcase-active {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
</style>
