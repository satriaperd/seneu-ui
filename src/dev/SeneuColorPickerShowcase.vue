<script setup>
import { ref } from 'vue'
import SeneuColorPicker from '../components/form/SeneuColorPicker.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const basic     = ref('')
const withValue = ref('#FC7A1E')

const hexVal = ref('#0D9488')
const rgbVal = ref('rgb(99, 102, 241)')
const hslVal = ref('hsl(347, 90%, 61%)')
const hsvVal = ref('hsv(84, 82%, 80%)')

const hinted   = ref('#CA8A04')
const errored  = ref('')
const loadingVal = ref('#0284C7')
const clearableVal = ref('#DB2777')

const smallVal = ref('#A855F7')
const baseVal  = ref('#A855F7')
const largeVal = ref('#A855F7')

const presetVal = ref('')
const brandPresets = [
  '#FC7A1E', '#0D9488', '#6366F1', '#F43F5E',
  '#84CC16', '#A855F7', '#CA8A04', '#0284C7',
]
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Basic">
      <div class="showcase-col">
        <SeneuColorPicker v-model="basic" label="Warna favorit" />
        <SeneuColorPicker v-model="withValue" label="Dengan nilai awal" />
        <SeneuColorPicker label="Disabled" :disabled="true" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Format — hex / rgb / hsl / hsv">
      <div class="showcase-col">
        <SeneuColorPicker v-model="hexVal" label="format=&quot;hex&quot; (default)" format="hex" />
        <SeneuColorPicker v-model="rgbVal" label="format=&quot;rgb&quot;" format="rgb" />
        <SeneuColorPicker v-model="hslVal" label="format=&quot;hsl&quot;" format="hsl" />
        <SeneuColorPicker v-model="hsvVal" label="format=&quot;hsv&quot;" format="hsv" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Clearable">
      <div class="showcase-col">
        <SeneuColorPicker v-model="clearableVal" label="Bisa dihapus" :clearable="true" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Presets">
      <div class="showcase-col">
        <SeneuColorPicker v-model="presetVal" label="Warna brand" :presets="brandPresets" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Hint & Error">
      <div class="showcase-col">
        <SeneuColorPicker v-model="hinted" label="Warna tag" hint="Dipakai buat badge kategori." />
        <SeneuColorPicker v-model="errored" label="Warna wajib" error="Pilih salah satu warna dulu." />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Loading">
      <div class="showcase-col">
        <SeneuColorPicker v-model="loadingVal" label="Lagi nyimpen preferensi" :loading="true" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Sizes">
      <div class="showcase-col">
        <SeneuColorPicker v-model="smallVal" label="Small" size="sm" />
        <SeneuColorPicker v-model="baseVal"  label="Base"  size="base" />
        <SeneuColorPicker v-model="largeVal" label="Large" size="lg" />
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
