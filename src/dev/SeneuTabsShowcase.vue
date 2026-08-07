<script setup>
import { ref } from 'vue'
import SeneuTabs from '../components/layout/SeneuTabs.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const line1 = ref('overview')
const pill1 = ref('overview')
const boxed1 = ref('overview')
const withIcons = ref('posts')
const withCounts = ref('inbox')
const disabledDemo = ref('overview')
const fullWidthDemo = ref('overview')
const smSize = ref('overview')
const lgSize = ref('overview')

const basicTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'settings', label: 'Settings' },
]

const iconTabs = [
  { id: 'posts', label: 'Posts', icon: 'article' },
  { id: 'media', label: 'Media', icon: 'perm_media' },
  { id: 'comments', label: 'Comments', icon: 'chat_bubble' },
]

const countTabs = [
  { id: 'inbox', label: 'Inbox', count: 12 },
  { id: 'sent', label: 'Sent', count: 3 },
  { id: 'spam', label: 'Spam', count: 128 },
  { id: 'trash', label: 'Trash' },
]

const disabledTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'billing', label: 'Billing', disabled: true },
  { id: 'settings', label: 'Settings' },
]

const manyTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'audience', label: 'Audience' },
  { id: 'acquisition', label: 'Acquisition' },
  { id: 'behavior', label: 'Behavior' },
  { id: 'conversions', label: 'Conversions' },
  { id: 'settings', label: 'Settings' },
]
const manyTabsActive = ref('overview')

function onChange({ from, to }) {
  void from
  void to
}
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Variants">
      <div class="showcase-col">
        <SeneuTabs v-model="line1" :tabs="basicTabs" variant="line" @change="onChange" />
        <SeneuTabs v-model="pill1" :tabs="basicTabs" variant="pill" @change="onChange" />
        <SeneuTabs v-model="boxed1" :tabs="basicTabs" variant="boxed" @change="onChange" />
      </div>
      <p class="showcase-caption">Navigasi keyboard: fokus salah satu tab, pakai ←/→ buat pindah + otomatis kepilih, Home/End buat lompat ke ujung.</p>
    </DevShowcaseSection>

    <DevShowcaseSection title="With Icons">
      <SeneuTabs v-model="withIcons" :tabs="iconTabs" variant="pill" />
    </DevShowcaseSection>

    <DevShowcaseSection title="With Count Badge">
      <SeneuTabs v-model="withCounts" :tabs="countTabs" variant="line" />
    </DevShowcaseSection>

    <DevShowcaseSection title="Disabled Tab">
      <SeneuTabs v-model="disabledDemo" :tabs="disabledTabs" variant="boxed" />
    </DevShowcaseSection>

    <DevShowcaseSection title="Full Width">
      <SeneuTabs v-model="fullWidthDemo" :tabs="basicTabs" variant="boxed" :full-width="true" />
    </DevShowcaseSection>

    <DevShowcaseSection title="Overflow (horizontal scroll)">
      <div class="showcase-narrow">
        <SeneuTabs v-model="manyTabsActive" :tabs="manyTabs" variant="line" />
      </div>
      <p class="showcase-caption">Kalau tab-nya kebanyakan buat lebar container, scroll horizontal otomatis (scrollbar disembunyiin biar bersih).</p>
    </DevShowcaseSection>

    <DevShowcaseSection title="Sizes">
      <div class="showcase-col">
        <SeneuTabs v-model="smSize" :tabs="basicTabs" variant="line" size="sm" />
        <SeneuTabs v-model="line1" :tabs="basicTabs" variant="line" size="base" />
        <SeneuTabs v-model="lgSize" :tabs="basicTabs" variant="line" size="lg" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Loading">
      <SeneuTabs :tabs="[]" :loading="true" />
    </DevShowcaseSection>

  </DevShowcase>
</template>

<style scoped>
.showcase-col {
  display: flex;
  flex-direction: column;
  gap: var(--primitive-space-6);
  align-items: flex-start;
}

.showcase-narrow {
  max-width: 360px;
  border: 1px dashed var(--color-border-default);
  padding: var(--primitive-space-2);
}

.showcase-caption {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  margin-top: var(--primitive-space-2);
}
</style>
