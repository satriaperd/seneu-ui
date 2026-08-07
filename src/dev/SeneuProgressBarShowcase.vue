<script setup>
import { ref, onBeforeUnmount } from 'vue'
import SeneuProgressBar from '../components/feedback/SeneuProgressBar.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const variants = ['default', 'brand', 'success', 'warning', 'danger', 'info']
const sizes = ['xs', 'sm', 'base', 'lg']

const liveValue = ref(42)
const timer = setInterval(() => {
  liveValue.value = (liveValue.value + 7) % 101
}, 800)
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Variants">
      <div class="showcase-col">
        <div v-for="v in variants" :key="v" class="showcase-row">
          <span class="showcase-row-label">{{ v }}</span>
          <SeneuProgressBar :variant="v" :value="65" show-value />
        </div>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Sizes">
      <div class="showcase-col">
        <div v-for="s in sizes" :key="s" class="showcase-row">
          <span class="showcase-row-label">{{ s }}</span>
          <SeneuProgressBar :size="s" :value="50" />
        </div>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Striped / Animated">
      <div class="showcase-col">
        <SeneuProgressBar variant="brand" :value="70" striped />
        <SeneuProgressBar variant="success" :value="55" striped animated />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Indeterminate">
      <SeneuProgressBar variant="brand" indeterminate label="Processing upload" />
    </DevShowcaseSection>

    <DevShowcaseSection title="Live Updating">
      <SeneuProgressBar variant="info" :value="liveValue" show-value />
      <p class="showcase-caption">Value naik tiap 800ms buat demo transisi width.</p>
    </DevShowcaseSection>

    <DevShowcaseSection title="Edge Values">
      <div class="showcase-col">
        <SeneuProgressBar variant="brand" :value="0" show-value />
        <SeneuProgressBar variant="brand" :value="150" show-value />
        <SeneuProgressBar variant="brand" :value="-20" show-value />
      </div>
      <p class="showcase-caption">Value di luar 0–100 otomatis di-clamp.</p>
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
