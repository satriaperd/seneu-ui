<script setup>
import { ref } from 'vue'
import SeneuToggle from '../components/form/SeneuToggle.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const notif   = ref(true)
const darkish = ref(false)
const twoFa   = ref(false)
const saving  = ref(true)
const badFlag = ref(false)
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Basic">
      <div class="showcase-col">
        <SeneuToggle v-model="notif"   label="Notifications" />
        <SeneuToggle v-model="darkish" label="Dark mode" />
        <SeneuToggle label="Disabled, off" :disabled="true" />
        <SeneuToggle :model-value="true" label="Disabled, on" :disabled="true" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="With Description">
      <div class="showcase-col">
        <SeneuToggle
          v-model="twoFa"
          label="Two-factor authentication"
          description="Nambahin lapisan keamanan ekstra tiap kali login."
        />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Reverse (label first)">
      <div class="showcase-col">
        <SeneuToggle v-model="notif" label="Push notifications" :reverse="true" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Hint & Error">
      <div class="showcase-col">
        <SeneuToggle v-model="notif" label="Weekly digest" hint="Dikirim tiap Senin pagi." />
        <SeneuToggle v-model="badFlag" label="Beta features" error="Fitur ini lagi maintenance, coba lagi nanti." />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Loading">
      <div class="showcase-col">
        <SeneuToggle v-model="saving" label="Auto-sync" :loading="true" hint="Lagi nyimpen perubahan…" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Sizes">
      <div class="showcase-col">
        <SeneuToggle v-model="notif" label="Small" size="sm" />
        <SeneuToggle v-model="notif" label="Base"  size="base" />
        <SeneuToggle v-model="notif" label="Large" size="lg" />
      </div>
    </DevShowcaseSection>

  </DevShowcase>
</template>

<style scoped>
.showcase-col {
  display:        flex;
  flex-direction: column;
  gap:            var(--primitive-space-4);
  max-width:      480px;
}
</style>
