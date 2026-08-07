<script setup>
import { ref } from 'vue'
import SeneuPagination from '../components/layout/SeneuPagination.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const page1 = ref(1)
const page2 = ref(6)
const pageSimple = ref(3)
const pageEdges = ref(6)
const pageFewer = ref(2)
const smPage = ref(1)
const lgPage = ref(1)

function onChange({ from, to }) {
  void from
  void to
}
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Basic">
      <SeneuPagination v-model="page1" :total="42" :per-page="10" @change="onChange" />
      <p class="showcase-caption">42 item, 10/halaman — {{ page1 }} halaman aktif.</p>
    </DevShowcaseSection>

    <DevShowcaseSection title="Many Pages (ellipsis collapsing)">
      <SeneuPagination v-model="page2" :total="500" :per-page="10" />
      <p class="showcase-caption">500 item = 50 halaman, otomatis di-collapse pakai &middot;&middot;&middot;</p>
    </DevShowcaseSection>

    <DevShowcaseSection title="Simple Variant">
      <SeneuPagination v-model="pageSimple" :total="120" :per-page="10" variant="simple" />
    </DevShowcaseSection>

    <DevShowcaseSection title="With Edge Buttons (first/last)">
      <SeneuPagination v-model="pageEdges" :total="500" :per-page="10" :show-edge-buttons="true" />
    </DevShowcaseSection>

    <DevShowcaseSection title="Without Previous/Next Labels">
      <SeneuPagination v-model="pageFewer" :total="80" :per-page="10" :show-labels="false" />
    </DevShowcaseSection>

    <DevShowcaseSection title="Fewer Total Pages">
      <div class="showcase-col">
        <SeneuPagination :model-value="1" :total="8" :per-page="10" />
        <p class="showcase-caption">Cuma 1 halaman — prev/next otomatis disabled.</p>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Sizes">
      <div class="showcase-col">
        <SeneuPagination v-model="smPage" :total="42" :per-page="10" size="sm" />
        <SeneuPagination v-model="page1" :total="42" :per-page="10" size="base" />
        <SeneuPagination v-model="lgPage" :total="42" :per-page="10" size="lg" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Loading">
      <SeneuPagination :total="0" :loading="true" />
    </DevShowcaseSection>

  </DevShowcase>
</template>

<style scoped>
.showcase-col {
  display: flex;
  flex-direction: column;
  gap: var(--primitive-space-4);
  align-items: flex-start;
}

.showcase-caption {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  margin-top: var(--primitive-space-2);
}
</style>
