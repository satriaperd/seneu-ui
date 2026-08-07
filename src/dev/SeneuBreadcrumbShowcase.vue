<script setup>
import SeneuBreadcrumb from '../components/layout/SeneuBreadcrumb.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const items = [
  { label: 'Dashboard', to: '/', icon: 'home' },
  { label: 'Components', to: '/components' },
  { label: 'Form & Input', to: '/components/form' },
  { label: 'Button' },
]

const longItems = [
  { label: 'Dashboard', to: '/', icon: 'home' },
  { label: 'Content', to: '/content' },
  { label: 'Blog Posts', to: '/content/posts' },
  { label: '2026 Archive', to: '/content/posts/2026' },
  { label: 'March', to: '/content/posts/2026/march' },
  { label: 'Understanding the New Component Library Architecture' },
]

const withDisabled = [
  { label: 'Dashboard', to: '/', icon: 'home' },
  { label: 'Billing (locked)', disabled: true },
  { label: 'Invoices' },
]

function onSelect(item) {
  // Demo only — real apps handle navigation here (e.g. router.push(item.to))
  void item
}
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Basic">
      <SeneuBreadcrumb :items="items" @select="onSelect" />
    </DevShowcaseSection>

    <DevShowcaseSection title="Separators">
      <div class="showcase-col">
        <SeneuBreadcrumb :items="items" separator="chevron" />
        <SeneuBreadcrumb :items="items" separator="slash" />
        <SeneuBreadcrumb :items="items" separator="arrow" />
        <SeneuBreadcrumb :items="items" separator="dot" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="With Icons">
      <SeneuBreadcrumb :items="[{ label: 'Home', to: '/', icon: 'home' }, { label: 'Settings', icon: 'settings' }]" />
    </DevShowcaseSection>

    <DevShowcaseSection title="Collapsed (maxItems)">
      <div class="showcase-col">
        <SeneuBreadcrumb :items="longItems" :max-items="4" />
        <p class="showcase-caption">6 item, maxItems=4 — klik &hellip; buat expand semuanya.</p>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Disabled Item">
      <SeneuBreadcrumb :items="withDisabled" />
    </DevShowcaseSection>

    <DevShowcaseSection title="Sizes">
      <div class="showcase-col">
        <SeneuBreadcrumb :items="items" size="sm" />
        <SeneuBreadcrumb :items="items" size="base" />
        <SeneuBreadcrumb :items="items" size="lg" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Loading">
      <SeneuBreadcrumb :items="[]" :loading="true" />
    </DevShowcaseSection>

    <DevShowcaseSection title="Single Item">
      <SeneuBreadcrumb :items="[{ label: 'Dashboard' }]" />
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
}
</style>
