<script setup>
import SeneuFooter from '../components/layout/SeneuFooter.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const simpleLinks = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Contact', href: '#' },
]

const columns = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '#' },
      { label: 'Pricing', href: '#' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'Components', href: '#' },
      { label: 'GitHub', href: '#' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
    ],
  },
]

const socialLinks = [
  { icon: 'link', href: '#', label: 'Website' },
  { icon: 'mail', href: '#', label: 'Email' },
]
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Simple Variant">
      <div class="showcase-frame">
        <SeneuFooter
          variant="simple"
          brand="Seneu CMS"
          copyright="© 2026 Cimang Club. All rights reserved."
          :links="simpleLinks"
        />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Simple Variant — With Social Links">
      <div class="showcase-frame">
        <SeneuFooter
          variant="simple"
          brand="Seneu CMS"
          copyright="© 2026 Cimang Club."
          :links="simpleLinks"
          :social-links="socialLinks"
        />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Columns Variant">
      <div class="showcase-frame">
        <SeneuFooter
          variant="columns"
          brand="Seneu CMS"
          tagline="Vue 3 component library buat bikin CMS atau admin panel, cepet."
          copyright="© 2026 Cimang Club. All rights reserved."
          :columns="columns"
          :social-links="socialLinks"
        />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Columns Variant — Loading">
      <div class="showcase-frame">
        <SeneuFooter
          variant="columns"
          brand="Seneu CMS"
          tagline="Vue 3 component library buat bikin CMS atau admin panel, cepet."
          :loading="true"
        />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="With Custom Logo Slot">
      <div class="showcase-frame">
        <SeneuFooter variant="simple" copyright="© 2026 Cimang Club.">
          <template #logo>
            <span class="showcase-custom-logo">
              <span class="showcase-custom-logo__dot" />
              Seneu
            </span>
          </template>
        </SeneuFooter>
      </div>
    </DevShowcaseSection>

  </DevShowcase>
</template>

<style scoped>
.showcase-frame {
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-container);
  overflow: hidden;
}

.showcase-custom-logo {
  display: flex;
  align-items: center;
  gap: var(--primitive-space-2);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-brand);
}

.showcase-custom-logo__dot {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-circle);
  background: var(--color-surface-brand);
}
</style>
