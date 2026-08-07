<script setup>
import SeneuBadge from '../components/display/SeneuBadge.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const variants = ['default', 'brand', 'success', 'warning', 'danger', 'info']
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Types × Variants">
      <div class="showcase-col">
        <div v-for="type in ['subtle', 'solid', 'outline']" :key="type" class="showcase-row">
          <span class="showcase-row-label">{{ type }}</span>
          <SeneuBadge v-for="v in variants" :key="v" :variant="v" :type="type">{{ v }}</SeneuBadge>
        </div>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="With Dot">
      <div class="showcase-row">
        <SeneuBadge variant="success" dot>Online</SeneuBadge>
        <SeneuBadge variant="danger" dot>Offline</SeneuBadge>
        <SeneuBadge variant="brand" dot :pulse="true">Live</SeneuBadge>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="With Icon">
      <div class="showcase-row">
        <SeneuBadge variant="success" icon="check_circle">Verified</SeneuBadge>
        <SeneuBadge variant="warning" icon="warning">Pending review</SeneuBadge>
        <SeneuBadge variant="danger" icon="error">Failed</SeneuBadge>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Count Mode">
      <div class="showcase-row">
        <SeneuBadge variant="brand" type="solid" :count="3" />
        <SeneuBadge variant="danger" type="solid" :count="12" />
        <SeneuBadge variant="danger" type="solid" :count="150" />
        <SeneuBadge variant="default" type="solid" :count="0" />
        <SeneuBadge variant="default" type="solid" :count="0" :show-zero="true" />
      </div>
      <p class="showcase-caption">count=0 disembunyiin otomatis kecuali showZero=true. count di atas `max` (default 99) jadi "99+".</p>
    </DevShowcaseSection>

    <DevShowcaseSection title="Sizes">
      <div class="showcase-row">
        <SeneuBadge variant="brand" size="sm">Small</SeneuBadge>
        <SeneuBadge variant="brand" size="base">Base</SeneuBadge>
      </div>
    </DevShowcaseSection>

  </DevShowcase>
</template>

<style scoped>
.showcase-col {
  display: flex;
  flex-direction: column;
  gap: var(--primitive-space-4);
}

.showcase-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--primitive-space-3);
}

.showcase-row-label {
  width: 64px;
  flex-shrink: 0;
  font-size: var(--font-size-xs);
  font-family: var(--font-mono);
  color: var(--color-text-muted);
}

.showcase-caption {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  margin-top: var(--primitive-space-2);
}
</style>
