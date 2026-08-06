<script setup>
import { ref } from 'vue'
import SeneuRadio from '../components/form/SeneuRadio.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const plan     = ref('pro')
const shipping = ref('standard')
const region   = ref('')
const syncing  = ref('cloud')
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Basic">
      <div class="showcase-col">
        <SeneuRadio v-model="plan" value="free" name="plan" label="Free" />
        <SeneuRadio v-model="plan" value="pro"  name="plan" label="Pro" />
        <SeneuRadio v-model="plan" value="team" name="plan" label="Team" />
        <SeneuRadio value="enterprise" name="plan" label="Enterprise (disabled)" :disabled="true" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="With Description">
      <div class="showcase-col">
        <SeneuRadio
          v-model="shipping"
          value="standard"
          name="shipping"
          label="Standard"
          description="3-5 hari kerja, gratis ongkir."
        />
        <SeneuRadio
          v-model="shipping"
          value="express"
          name="shipping"
          label="Express"
          description="1-2 hari kerja, tambahan Rp 15.000."
        />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Hint & Error">
      <div class="showcase-col">
        <SeneuRadio v-model="region" value="jkt" name="region" label="Jakarta" hint="Estimasi pengiriman tercepat." />
        <SeneuRadio v-model="region" value="sby" name="region" label="Surabaya" error="Region ini lagi nggak available." />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Loading">
      <div class="showcase-col">
        <SeneuRadio v-model="syncing" value="cloud" name="sync" label="Cloud sync" :loading="true" />
        <SeneuRadio v-model="syncing" value="local" name="sync" label="Local only" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Sizes">
      <div class="showcase-col">
        <SeneuRadio v-model="plan" value="pro" name="plan-sm" label="Small" size="sm" />
        <SeneuRadio v-model="plan" value="pro" name="plan-base" label="Base" size="base" />
        <SeneuRadio v-model="plan" value="pro" name="plan-lg" label="Large" size="lg" />
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
