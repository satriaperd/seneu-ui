<script setup>
import { ref } from 'vue'
import SeneuTextarea from '../components/form/SeneuTextarea.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const bio      = ref('')
const notes    = ref('Catatan penting soal proyek ini.')
const bad      = ref('kontennya kurang oke nih')
const tweet    = ref('Lagi belajar Vue 3 composition API, seru banget ternyata!')
const checking = ref('Draft yang lagi dicek otomatis…')
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Basic">
      <div class="showcase-col">
        <SeneuTextarea v-model="bio"   label="Bio"        placeholder="Ceritain diri lo dikit…" />
        <SeneuTextarea v-model="notes" label="Notes"      :rows="3" />
        <SeneuTextarea                 label="Read-only"  :model-value="'Konten ini nggak bisa diubah.'" :readonly="true" />
        <SeneuTextarea                 label="Disabled"   placeholder="Nggak bisa diisi" :disabled="true" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Hint & Error">
      <div class="showcase-col">
        <SeneuTextarea
          v-model="notes"
          label="Deskripsi produk"
          hint="Maksimal 500 karakter, jelasin fitur utamanya ya."
        />
        <SeneuTextarea
          v-model="bad"
          label="Review"
          error="Tolong hindari kata kasar di review lo."
        />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Character Counter">
      <div class="showcase-col">
        <SeneuTextarea
          v-model="tweet"
          label="Caption"
          placeholder="Apa yang lo pikirin?"
          :rows="3"
          :maxlength="140"
          :show-counter="true"
          hint="Singkat, padat, jelas."
        />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Loading">
      <div class="showcase-col">
        <SeneuTextarea
          v-model="checking"
          label="Draft"
          :loading="true"
          hint="Lagi ngecek grammar & typo…"
        />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Resize">
      <div class="showcase-col">
        <SeneuTextarea v-model="notes" label="Resize: none"       resize="none" />
        <SeneuTextarea v-model="notes" label="Resize: vertical"   resize="vertical" />
        <SeneuTextarea v-model="notes" label="Resize: horizontal" resize="horizontal" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Sizes">
      <div class="showcase-col">
        <SeneuTextarea v-model="notes" label="Small" size="sm"   :rows="2" />
        <SeneuTextarea v-model="notes" label="Base"  size="base" :rows="2" />
        <SeneuTextarea v-model="notes" label="Large" size="lg"   :rows="2" />
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
