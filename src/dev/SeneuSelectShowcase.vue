<script setup>
import { ref } from 'vue'
import SeneuSelect from '../components/form/SeneuSelect.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const role   = ref('')
const status = ref('published')
const bad    = ref('')
const region = ref('')

const ROLE_OPTIONS = [
  { label: 'Admin',  value: 'admin' },
  { label: 'Editor',  value: 'editor' },
  { label: 'Viewer',  value: 'viewer' },
]

const STATUS_OPTIONS = [
  { label: 'Draft',     value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived',  value: 'archived' },
]

const REGION_OPTIONS = [
  { label: 'Jakarta',   value: 'jkt' },
  { label: 'Bandung',   value: 'bdg' },
  { label: 'Surabaya',  value: 'sby', disabled: true },
]
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Basic">
      <div class="showcase-col">
        <SeneuSelect
          v-model="role"
          label="Role"
          placeholder="Pilih role…"
          :options="ROLE_OPTIONS"
        />
        <SeneuSelect
          v-model="status"
          label="Status"
          :options="STATUS_OPTIONS"
        />
        <SeneuSelect
          label="Disabled"
          placeholder="Nggak bisa dipilih"
          :options="ROLE_OPTIONS"
          :disabled="true"
        />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Disabled Option">
      <div class="showcase-col">
        <SeneuSelect
          v-model="region"
          label="Region"
          placeholder="Pilih region…"
          :options="REGION_OPTIONS"
          hint="Surabaya masih dalam proses onboarding."
        />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Hint & Error">
      <div class="showcase-col">
        <SeneuSelect
          v-model="status"
          label="Visibility"
          :options="STATUS_OPTIONS"
          hint="Konten yang di-publish langsung tampil ke publik."
        />
        <SeneuSelect
          v-model="bad"
          label="Kategori"
          placeholder="Pilih kategori…"
          :options="ROLE_OPTIONS"
          error="Kategori wajib dipilih."
        />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Loading">
      <div class="showcase-col">
        <SeneuSelect
          label="Kota"
          placeholder="Lagi ambil daftar kota…"
          :options="[]"
          :loading="true"
        />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Sizes">
      <div class="showcase-col">
        <SeneuSelect v-model="role" label="Small" size="sm"   :options="ROLE_OPTIONS" placeholder="Pilih role…" />
        <SeneuSelect v-model="role" label="Base"  size="base" :options="ROLE_OPTIONS" placeholder="Pilih role…" />
        <SeneuSelect v-model="role" label="Large" size="lg"   :options="ROLE_OPTIONS" placeholder="Pilih role…" />
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
