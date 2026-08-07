<script setup>
import { ref } from 'vue'
import SeneuSearchBar from '../components/form/SeneuSearchBar.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const basic    = ref('')
const compact  = ref('')
const loadingQ = ref('cimang')
const errored  = ref('')
const withSuggestions = ref('')
const debounced = ref('')
const debouncedResult = ref('')
const recent = ref(['dashboard analytics', 'user permission', 'invoice #2291'])

const SUGGESTIONS = [
  { label: 'Dashboard Analytics', sub: 'Halaman', type: 'Halaman', icon: 'dashboard' },
  { label: 'User Permission Settings', sub: 'Pengaturan akses role', type: 'Halaman', icon: 'admin_panel_settings' },
  { label: 'Satria Perdana', sub: 'satria@cimangclub.id', type: 'User', icon: 'person' },
  { label: 'Invoice #2291', sub: 'Rp 1.250.000 · Lunas', type: 'Transaksi', icon: 'receipt_long' },
  { label: 'Invoice #2298', sub: 'Rp 850.000 · Pending', type: 'Transaksi', icon: 'receipt_long' },
]

</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Basic">
      <div class="showcase-col">
        <SeneuSearchBar v-model="basic" label="Cari sesuatu" placeholder="Cari produk, user, atau transaksi…" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="With Suggestions & Recent">
      <div class="showcase-col">
        <SeneuSearchBar
          v-model="withSuggestions"
          v-model:recent-searches="recent"
          label="Global search"
          placeholder="Cari apa aja…"
          :suggestions="SUGGESTIONS"
        />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Compact & Trigger Variant">
      <div class="showcase-row">
        <SeneuSearchBar v-model="compact" variant="compact" placeholder="Cari…" />
        <SeneuSearchBar placeholder="Cari apa aja…" shortcut="⌘K" variant="trigger" @trigger="() => alert('Buka command palette!')" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Min Chars & Debounce">
      <div class="showcase-col">
        <SeneuSearchBar
          v-model="debounced"
          placeholder="Ketik minimal 3 karakter…"
          :suggestions="SUGGESTIONS"
          :min-chars="3"
          :debounce="400"
          hint="Nunggu 400ms setelah lo berhenti ngetik sebelum nyari."
          @search="q => debouncedResult = q"
        />
        <p class="showcase-caption">
          @search terakhir: <code>{{ debouncedResult || '(belum ada)' }}</code>
        </p>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Loading">
      <div class="showcase-col">
        <SeneuSearchBar v-model="loadingQ" :loading="true" hint="Lagi nyari…" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Disabled & Error">
      <div class="showcase-col">
        <SeneuSearchBar placeholder="Disabled" :disabled="true" />
        <SeneuSearchBar v-model="errored" label="Cari produk" error="Nggak nemu produk yang cocok." />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Sizes">
      <div class="showcase-col">
        <SeneuSearchBar placeholder="Small"  size="sm" />
        <SeneuSearchBar placeholder="Base"   size="base" />
        <SeneuSearchBar placeholder="Large"  size="lg" />
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

.showcase-row {
  display:   flex;
  flex-wrap: wrap;
  gap:       var(--primitive-space-4);
  align-items: flex-start;
}

.showcase-caption {
  font-size: var(--font-size-small);
  color:     var(--color-text-muted);
}

.showcase-caption code {
  font-family: var(--font-mono);
  color:       var(--color-text-brand);
}
</style>
