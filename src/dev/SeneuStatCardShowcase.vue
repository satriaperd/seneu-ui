<script setup>
import SeneuStatCard from '../components/display/SeneuStatCard.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const variants = ['default', 'brand', 'success', 'warning', 'danger', 'info']
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Trend Directions">
      <div class="showcase-grid">
        <SeneuStatCard label="Total Revenue" value="$48,290" icon="payments" variant="brand" :change="12.4" change-period="vs last month" />
        <SeneuStatCard label="Refunds" value="$1,204" icon="undo" variant="danger" :change="-4.1" change-period="vs last month" />
        <SeneuStatCard label="Active Users" value="8,921" icon="group" variant="info" :change="0" change-period="vs last month" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Icon Variants">
      <div class="showcase-grid">
        <SeneuStatCard v-for="v in variants" :key="v" :label="v" value="1,024" :icon="'insights'" :variant="v" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="No Icon / No Trend">
      <div class="showcase-grid">
        <SeneuStatCard label="Draft Posts" value="17" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Hoverable">
      <div class="showcase-grid">
        <SeneuStatCard label="Storage Used" value="72.4 GB" icon="cloud" variant="brand" :change="3.2" hoverable />
      </div>
      <p class="showcase-caption">Hover kartu di atas — ada lift + shadow.</p>
    </DevShowcaseSection>

    <DevShowcaseSection title="With Extra Slot">
      <div class="showcase-grid">
        <SeneuStatCard label="Weekly Signups" value="342" icon="person_add" variant="success" :change="8.7">
          <div class="showcase-sparkline-placeholder">▁▂▄▃▅▇▆</div>
        </SeneuStatCard>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Loading">
      <div class="showcase-grid">
        <SeneuStatCard loading icon="payments" variant="brand" />
        <SeneuStatCard loading icon="group" variant="info" />
      </div>
    </DevShowcaseSection>

  </DevShowcase>
</template>

<style scoped>
.showcase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--primitive-space-4);
}

.showcase-caption {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  margin-top: var(--primitive-space-2);
}

.showcase-sparkline-placeholder {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  letter-spacing: 0.1em;
  color: var(--color-text-brand);
}
</style>
