<script setup>
import { ref } from 'vue'
import SeneuCheckbox from '../components/form/SeneuCheckbox.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const single    = ref(false)
const withDesc  = ref(true)
const terms     = ref(false)
const selectAll = ref(false)
const fruits    = ref(['apple'])
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Basic">
      <div class="showcase-col">
        <SeneuCheckbox v-model="single"   label="Remember me" />
        <SeneuCheckbox                    label="Disabled, unchecked" :disabled="true" />
        <SeneuCheckbox :model-value="true" label="Disabled, checked"   :disabled="true" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="With Description">
      <div class="showcase-col">
        <SeneuCheckbox
          v-model="withDesc"
          label="Email notifications"
          description="Dapetin update penting soal akun lo langsung ke inbox."
        />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Indeterminate — Group">
      <div class="showcase-col">
        <SeneuCheckbox
          :model-value="fruits.length > 0"
          :indeterminate="fruits.length > 0 && fruits.length < 3"
          label="Select all"
          @change="fruits = fruits.length === 3 ? [] : ['apple', 'banana', 'mango']"
        />
        <div class="showcase-group">
          <SeneuCheckbox v-model="fruits" value="apple"  label="Apple" />
          <SeneuCheckbox v-model="fruits" value="banana" label="Banana" />
          <SeneuCheckbox v-model="fruits" value="mango"  label="Mango" />
        </div>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Hint & Error">
      <div class="showcase-col">
        <SeneuCheckbox
          v-model="selectAll"
          label="Backup otomatis"
          hint="Kita backup data lo tiap malam jam 2."
        />
        <SeneuCheckbox
          v-model="terms"
          label="Gua setuju sama Syarat & Ketentuan"
          error="Wajib dicentang buat lanjut."
        />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Sizes">
      <div class="showcase-col">
        <SeneuCheckbox v-model="single" label="Small" size="sm" />
        <SeneuCheckbox v-model="single" label="Base"  size="base" />
        <SeneuCheckbox v-model="single" label="Large" size="lg" />
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

.showcase-group {
  display:        flex;
  flex-direction: column;
  gap:            var(--primitive-space-3);
  padding-left:   var(--primitive-space-6);
}
</style>
