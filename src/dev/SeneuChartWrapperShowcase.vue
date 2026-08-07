<script setup>
import { ref } from 'vue'
import SeneuChartWrapper from '../components/display/SeneuChartWrapper.vue'
import SeneuButton from '../components/form/SeneuButton.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const lineOption = {
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  yAxis: { type: 'value' },
  series: [{ type: 'line', data: [820, 932, 901, 934, 1290, 1330, 1320], smooth: true }],
  grid: { left: 40, right: 16, top: 16, bottom: 24 },
}

const barOption = {
  xAxis: { type: 'category', data: ['Admin', 'Editor', 'Viewer'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [12, 34, 58] }],
  grid: { left: 40, right: 16, top: 16, bottom: 24 },
}

const pieOption = {
  series: [{
    type: 'pie',
    radius: '70%',
    data: [
      { value: 42, name: 'Active' },
      { value: 13, name: 'Invited' },
      { value: 5, name: 'Suspended' },
    ],
  }],
}

const dynamicData = ref([820, 932, 901, 934])
const dynamicOption = ref({
  xAxis: { type: 'category', data: ['W1', 'W2', 'W3', 'W4'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: dynamicData.value }],
  grid: { left: 40, right: 16, top: 16, bottom: 24 },
})
function shuffleData() {
  const next = dynamicData.value.map(() => Math.floor(Math.random() * 1000))
  dynamicOption.value = { ...dynamicOption.value, series: [{ type: 'bar', data: next }] }
}

const isLoading = ref(false)
const isEmpty = ref(false)
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Line Chart">
      <SeneuChartWrapper title="Weekly Visitors" subtitle="Last 7 days" :option="lineOption" />
    </DevShowcaseSection>

    <DevShowcaseSection title="Bar + Pie">
      <div class="showcase-grid">
        <SeneuChartWrapper title="Members by Role" :option="barOption" />
        <SeneuChartWrapper title="Status Breakdown" :option="pieOption" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="With Actions Slot">
      <SeneuChartWrapper title="Signups" subtitle="Randomized on refresh" :option="dynamicOption">
        <template #actions>
          <SeneuButton variant="default" size="sm" @click="shuffleData">Refresh</SeneuButton>
        </template>
      </SeneuChartWrapper>
    </DevShowcaseSection>

    <DevShowcaseSection title="Loading / Empty States">
      <div class="showcase-row">
        <label class="showcase-toggle-label">
          <input v-model="isLoading" type="checkbox" @change="isLoading && (isEmpty = false)" />
          Loading
        </label>
        <label class="showcase-toggle-label">
          <input v-model="isEmpty" type="checkbox" @change="isEmpty && (isLoading = false)" />
          No data
        </label>
      </div>
      <SeneuChartWrapper
        title="Revenue"
        :loading="isLoading"
        :option="isEmpty ? null : lineOption"
        empty-title="No revenue data"
        empty-description="Connect a data source to see revenue trends here."
      />
    </DevShowcaseSection>

    <DevShowcaseSection title="No Title/Subtitle/Actions">
      <SeneuChartWrapper :option="barOption" height="220px" />
      <p class="showcase-caption">Header + divider otomatis disembunyiin kalau gak ada title/subtitle/actions.</p>
    </DevShowcaseSection>

  </DevShowcase>
</template>

<style scoped>
.showcase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--primitive-space-4);
}

.showcase-row {
  display: flex;
  gap: var(--primitive-space-4);
  margin-bottom: var(--primitive-space-3);
}

.showcase-toggle-label {
  display: inline-flex;
  align-items: center;
  gap: var(--primitive-space-2);
  font-size: var(--font-size-small);
  color: var(--color-text-default);
  cursor: pointer;
}

.showcase-caption {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  margin-top: var(--primitive-space-2);
}
</style>
