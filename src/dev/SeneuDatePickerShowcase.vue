<script setup>
import { ref } from 'vue'
import SeneuDatePicker from '../components/form/SeneuDatePicker.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const basic     = ref(null)
const withValue = ref(new Date())
const nativeVal = ref(null)
const constrained = ref(null)
const weekendOff = ref(null)
const custom     = ref(null)
const hinted     = ref(null)
const errored    = ref(null)
const loadingVal = ref(null)
const range1     = ref({ start: null, end: null })
const range2     = ref({ start: null, end: null })

const today = new Date()
const minDate = new Date(today.getFullYear(), today.getMonth(), 1)
const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, 0)

function isWeekend(date) {
  const day = date.getDay()
  return day === 0 || day === 6
}
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Basic">
      <div class="showcase-col">
        <SeneuDatePicker v-model="basic" label="Tanggal lahir" />
        <SeneuDatePicker v-model="withValue" label="Dengan nilai awal" />
        <SeneuDatePicker label="Disabled" placeholder="DD/MM/YYYY" :disabled="true" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Native Fallback">
      <div class="showcase-col">
        <SeneuDatePicker v-model="nativeVal" label="Native input[type=date]" :native="true" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Format">
      <div class="showcase-col">
        <SeneuDatePicker v-model="withValue" label="Format YYYY-MM-DD" format="YYYY-MM-DD" />
        <SeneuDatePicker v-model="withValue" label="Format DD MMMM YYYY" format="DD MMMM YYYY" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Min / Max Date">
      <div class="showcase-col">
        <SeneuDatePicker
          v-model="constrained"
          label="Booking bulan ini & bulan depan"
          :min-date="minDate"
          :max-date="maxDate"
          hint="Cuma bisa pilih tanggal dalam 2 bulan ke depan."
        />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Disabled Dates">
      <div class="showcase-col">
        <SeneuDatePicker
          v-model="weekendOff"
          label="Hari kerja saja"
          :disabled-dates="isWeekend"
          hint="Sabtu & Minggu nggak bisa dipilih."
        />
        <SeneuDatePicker
          v-model="custom"
          label="Skip tanggal 13"
          :disabled-dates="d => d.getDate() === 13"
        />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Week Start">
      <div class="showcase-col">
        <SeneuDatePicker v-model="basic" label="Mulai Minggu (default)" :week-start="0" />
        <SeneuDatePicker v-model="basic" label="Mulai Senin" :week-start="1" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Hint & Error">
      <div class="showcase-col">
        <SeneuDatePicker v-model="hinted" label="Tanggal event" hint="Boleh diubah sampai H-3 acara." />
        <SeneuDatePicker v-model="errored" label="Tanggal kadaluarsa" error="Tanggal wajib diisi." />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Loading">
      <div class="showcase-col">
        <SeneuDatePicker v-model="loadingVal" label="Lagi ambil jadwal tersedia" :loading="true" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Sizes">
      <div class="showcase-col">
        <SeneuDatePicker v-model="basic" label="Small" size="sm" />
        <SeneuDatePicker v-model="basic" label="Base"  size="base" />
        <SeneuDatePicker v-model="basic" label="Large" size="lg" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Range — Basic">
      <div class="showcase-col-wide">
        <SeneuDatePicker v-model="range1" :range="true" label="Rentang tanggal booking" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Range — With Presets">
      <div class="showcase-col-wide">
        <SeneuDatePicker
          v-model="range2"
          :range="true"
          label="Filter laporan"
          :show-presets="true"
          label-start="Dari"
          label-end="Sampai"
        />
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

.showcase-col-wide {
  display:        flex;
  flex-direction: column;
  gap:            var(--primitive-space-4);
  max-width:      640px;
}
</style>
