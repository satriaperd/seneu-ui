<script setup>
import { ref } from 'vue'
import SeneuCard from '../components/display/SeneuCard.vue'
import SeneuButton from '../components/form/SeneuButton.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const selectedPlan = ref('pro')

function onClick(id) {
  void id
}
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Variants">
      <div class="showcase-grid">
        <SeneuCard variant="default"><p class="showcase-text">Default</p></SeneuCard>
        <SeneuCard variant="elevated"><p class="showcase-text">Elevated</p></SeneuCard>
        <SeneuCard variant="outlined"><p class="showcase-text">Outlined</p></SeneuCard>
        <SeneuCard variant="flat"><p class="showcase-text">Flat</p></SeneuCard>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Header, Body, Footer (divided)">
      <div class="showcase-grid">
        <SeneuCard :divided="true">
          <template #header>
            <h3 class="showcase-title">Project Alpha</h3>
          </template>
          <p class="showcase-text">Ringkasan singkat soal project ini ada di sini, buat kasih konteks ke user.</p>
          <template #footer>
            <div class="showcase-footer-row">
              <SeneuButton size="sm" variant="brand">Open</SeneuButton>
              <SeneuButton size="sm">Archive</SeneuButton>
            </div>
          </template>
        </SeneuCard>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="With Media Slot">
      <div class="showcase-grid">
        <SeneuCard :divided="true">
          <template #media>
            <div class="showcase-media" />
          </template>
          <template #header>
            <h3 class="showcase-title">Cover Image</h3>
          </template>
          <p class="showcase-text">Media slot render full-width di atas, nol padding, cocok buat cover image kartu blog/produk.</p>
        </SeneuCard>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Hoverable & Clickable">
      <div class="showcase-grid">
        <SeneuCard :hoverable="true">
          <p class="showcase-text">Hoverable — angkat + shadow pas di-hover</p>
        </SeneuCard>
        <SeneuCard :clickable="true" @click="onClick('card')">
          <p class="showcase-text">Clickable — render sebagai &lt;button&gt;, bisa di-Tab &amp; Enter</p>
        </SeneuCard>
        <SeneuCard :clickable="true" href="#">
          <p class="showcase-text">Clickable + href — render sebagai &lt;a&gt;</p>
        </SeneuCard>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Selectable Grid (selected state)">
      <div class="showcase-grid">
        <SeneuCard
          v-for="plan in ['basic', 'pro', 'enterprise']"
          :key="plan"
          :clickable="true"
          :selected="selectedPlan === plan"
          @click="selectedPlan = plan"
        >
          <p class="showcase-title">{{ plan[0].toUpperCase() + plan.slice(1) }}</p>
          <p class="showcase-text">Klik buat pilih paket ini.</p>
        </SeneuCard>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Disabled">
      <div class="showcase-grid">
        <SeneuCard :clickable="true" :disabled="true">
          <p class="showcase-text">Card ini disabled — gak bisa di-klik/fokus.</p>
        </SeneuCard>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Padding Sizes">
      <div class="showcase-grid">
        <SeneuCard padding="none"><p class="showcase-text">none</p></SeneuCard>
        <SeneuCard padding="sm"><p class="showcase-text">sm</p></SeneuCard>
        <SeneuCard padding="base"><p class="showcase-text">base</p></SeneuCard>
        <SeneuCard padding="lg"><p class="showcase-text">lg</p></SeneuCard>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Loading">
      <div class="showcase-grid">
        <SeneuCard :loading="true" />
        <SeneuCard :loading="true" :divided="true" />
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

.showcase-title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-default);
}

.showcase-text {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  line-height: var(--line-height-relaxed);
}

.showcase-footer-row {
  display: flex;
  gap: var(--primitive-space-2);
}

.showcase-media {
  height: 120px;
  background: linear-gradient(135deg, var(--color-surface-brand), var(--color-chart-2));
}
</style>
