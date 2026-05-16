<script setup>
import { ref } from 'vue'
import SeneuButton from '../components/form/SeneuButton.vue'

const loadingVariant = ref(null)

function simulateLoad(variant) {
  loadingVariant.value = variant
  setTimeout(() => { loadingVariant.value = null }, 2000)
}
</script>

<template>
  <div class="showcase">

    <section class="showcase-section">
      <h2 class="showcase-title">Variants</h2>
      <div class="showcase-row">
        <SeneuButton variant="default">Default</SeneuButton>
        <SeneuButton variant="brand">Brand</SeneuButton>
        <SeneuButton variant="danger">Danger</SeneuButton>
        <SeneuButton variant="success">Success</SeneuButton>
        <SeneuButton variant="warning">Warning</SeneuButton>
        <SeneuButton variant="info">Info</SeneuButton>
      </div>
    </section>

    <section class="showcase-section">
      <h2 class="showcase-title">Sizes</h2>
      <div class="showcase-row showcase-row--align-center">
        <SeneuButton variant="brand" size="sm">Small</SeneuButton>
        <SeneuButton variant="brand" size="base">Base</SeneuButton>
        <SeneuButton variant="brand" size="lg">Large</SeneuButton>
      </div>
    </section>

    <section class="showcase-section">
      <h2 class="showcase-title">With Icons</h2>
      <div class="showcase-row">
        <SeneuButton variant="brand" icon="add">New Item</SeneuButton>
        <SeneuButton variant="default" icon="download">Export</SeneuButton>
        <SeneuButton variant="danger" icon-right="delete">Delete</SeneuButton>
        <SeneuButton variant="success" icon="check" icon-right="chevron_right">Confirm</SeneuButton>
      </div>
    </section>

    <section class="showcase-section">
      <h2 class="showcase-title">Icon Only</h2>
      <div class="showcase-row showcase-row--align-center">
        <SeneuButton variant="default" icon="settings" icon-only size="sm" />
        <SeneuButton variant="brand" icon="add" icon-only size="base" />
        <SeneuButton variant="danger" icon="delete" icon-only size="lg" />
        <SeneuButton variant="success" icon="check" icon-only />
        <SeneuButton variant="warning" icon="warning" icon-only />
        <SeneuButton variant="info" icon="info" icon-only />
      </div>
    </section>

    <section class="showcase-section">
      <h2 class="showcase-title">States</h2>
      <div class="showcase-row">
        <SeneuButton variant="brand" :disabled="true">Disabled</SeneuButton>
        <SeneuButton variant="brand" :loading="true">Loading</SeneuButton>
        <SeneuButton variant="default" :disabled="true" icon="download">Disabled + Icon</SeneuButton>
      </div>
    </section>

    <section class="showcase-section">
      <h2 class="showcase-title">Loading Simulation — click to trigger</h2>
      <div class="showcase-row">
        <SeneuButton
          v-for="v in ['default','brand','danger','success','warning','info']"
          :key="v"
          :variant="v"
          :loading="loadingVariant === v"
          @click="simulateLoad(v)"
        >
          {{ v }}
        </SeneuButton>
      </div>
    </section>

    <section class="showcase-section">
      <h2 class="showcase-title">All Sizes × All Variants</h2>
      <div class="showcase-grid">
        <template v-for="size in ['sm', 'base', 'lg']" :key="size">
          <div class="showcase-row">
            <span class="showcase-size-label">{{ size }}</span>
            <SeneuButton
              v-for="v in ['default','brand','danger','success','warning','info']"
              :key="v"
              :variant="v"
              :size="size"
            >
              {{ v }}
            </SeneuButton>
          </div>
        </template>
      </div>
    </section>

  </div>
</template>

<style scoped>
.showcase {
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
}

.showcase-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.showcase-title {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-border-default);
}

.showcase-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.showcase-row--align-center {
  align-items: center;
}

.showcase-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.showcase-size-label {
  font-size: var(--font-size-xs);
  font-family: var(--font-mono);
  color: var(--color-text-muted);
  width: 36px;
  flex-shrink: 0;
  align-self: center;
}
</style>
