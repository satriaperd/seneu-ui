<script setup>
import SeneuSpinner from '../components/feedback/SeneuSpinner.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const sizes = ['xs', 'sm', 'base', 'lg', 'xl']
const variants = ['default', 'brand', 'success', 'warning', 'danger', 'info']
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Sizes">
      <div class="showcase-row showcase-row--align-end">
        <SeneuSpinner v-for="s in sizes" :key="s" :size="s" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Variants">
      <div class="showcase-row">
        <div v-for="v in variants" :key="v" class="showcase-col">
          <SeneuSpinner :variant="v" size="lg" />
          <span class="showcase-caption">{{ v }}</span>
        </div>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="With Label">
      <div class="showcase-row">
        <SeneuSpinner variant="brand" label="Loading data..." />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Inverted — on Solid Background">
      <div class="showcase-inverted-bg">
        <SeneuSpinner variant="inverted" label="Uploading..." />
      </div>
    </DevShowcaseSection>

  </DevShowcase>
</template>

<style scoped>
.showcase-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--primitive-space-6);
}
.showcase-row--align-end { align-items: flex-end; }

.showcase-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--primitive-space-2);
}

.showcase-caption {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
}

.showcase-inverted-bg {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--primitive-space-8);
  background-color: var(--color-surface-brand);
  border-radius: var(--radius-container);
}
</style>
