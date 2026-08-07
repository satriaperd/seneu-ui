<script setup>
import { ref } from 'vue'
import SeneuFileUpload from '../components/form/SeneuFileUpload.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const basic    = ref([])
const compact  = ref([])
const images   = ref([])
const restricted = ref([])
const errored  = ref([])
const loadingFiles = ref([])

// Simulated real-world usage: consumer owns upload progress/status.
const withStatus = ref([])

function onAdd(entries) {
  entries.forEach(entry => {
    entry.status = 'uploading'
    let p = 0
    const iv = setInterval(() => {
      p += Math.random() * 25 + 10
      if (p >= 100) {
        entry.progress = 100
        entry.status = Math.random() > 0.15 ? 'done' : 'error'
        if (entry.status === 'error') entry.error = 'Koneksi terputus, coba upload ulang.'
        clearInterval(iv)
      } else {
        entry.progress = p
      }
    }, 260)
  })
}
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Basic — Dropzone">
      <div class="showcase-col">
        <SeneuFileUpload v-model="basic" label="Dokumen pendukung" hint="Bisa lebih dari satu file." />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Compact Variant">
      <div class="showcase-col">
        <SeneuFileUpload v-model="compact" variant="compact" label="Lampiran" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Image Preview">
      <div class="showcase-col">
        <SeneuFileUpload
          v-model="images"
          label="Foto produk"
          accept="image/*"
          hint="Format JPG, PNG, atau WebP."
        />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Restrictions (size, count, type)">
      <div class="showcase-col">
        <SeneuFileUpload
          v-model="restricted"
          label="Upload maksimal 2 file, masing-masing 500 KB"
          accept=".pdf,.doc,.docx"
          :max-files="2"
          :max-size="500 * 1024"
          hint="PDF atau Word, maksimal 500 KB per file."
        />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Upload Progress (consumer-driven)">
      <div class="showcase-col">
        <SeneuFileUpload
          v-model="withStatus"
          label="Upload ke server"
          hint="Progress & status disimulasikan di sisi consumer, bukan di komponennya."
          @add="onAdd"
        />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Disabled & Loading">
      <div class="showcase-col">
        <SeneuFileUpload label="Disabled" :disabled="true" />
        <SeneuFileUpload v-model="loadingFiles" label="Lagi memuat file yang udah ada" :loading="true" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Error">
      <div class="showcase-col">
        <SeneuFileUpload v-model="errored" label="Wajib upload KTP" error="File KTP wajib diupload." />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Sizes">
      <div class="showcase-col">
        <SeneuFileUpload label="Small" size="sm" />
        <SeneuFileUpload label="Base"  size="base" />
        <SeneuFileUpload label="Large" size="lg" />
      </div>
    </DevShowcaseSection>

  </DevShowcase>
</template>

<style scoped>
.showcase-col {
  display:        flex;
  flex-direction: column;
  gap:            var(--primitive-space-6);
  max-width:      480px;
}
</style>
