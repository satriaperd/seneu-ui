<script setup>
import { ref } from 'vue'
import SeneuTag from '../components/display/SeneuTag.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const variants = ['default', 'brand', 'success', 'warning', 'danger', 'info']

const removableTags = ref(['Vue', 'React', 'Svelte'])
function removeTag(tag) {
  removableTags.value = removableTags.value.filter(t => t !== tag)
}

const filters = ref(['Published'])
function toggleFilter(name) {
  filters.value = filters.value.includes(name)
    ? filters.value.filter(f => f !== name)
    : [...filters.value, name]
}
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Types × Variants">
      <div class="showcase-col">
        <div v-for="type in ['subtle', 'solid', 'outline']" :key="type" class="showcase-row">
          <span class="showcase-row-label">{{ type }}</span>
          <SeneuTag v-for="v in variants" :key="v" :variant="v" :type="type">{{ v }}</SeneuTag>
        </div>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="With Icon">
      <div class="showcase-row">
        <SeneuTag variant="brand" icon="label">Feature</SeneuTag>
        <SeneuTag variant="danger" icon="bug_report">Bug</SeneuTag>
        <SeneuTag variant="success" icon="check_circle">Done</SeneuTag>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Removable">
      <div class="showcase-row">
        <SeneuTag v-for="tag in removableTags" :key="tag" :removable="true" @remove="removeTag(tag)">
          {{ tag }}
        </SeneuTag>
        <span v-if="!removableTags.length" class="showcase-caption">Semua tag udah dihapus.</span>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Clickable / Selectable Filters">
      <div class="showcase-row">
        <SeneuTag
          v-for="name in ['Published', 'Draft', 'Archived']"
          :key="name"
          :clickable="true"
          :active="filters.includes(name)"
          @click="toggleFilter(name)"
        >{{ name }}</SeneuTag>
      </div>
      <p class="showcase-caption">Filter aktif: {{ filters.join(', ') || '(none)' }}</p>
    </DevShowcaseSection>

    <DevShowcaseSection title="Disabled">
      <div class="showcase-row">
        <SeneuTag :disabled="true">Disabled</SeneuTag>
        <SeneuTag :clickable="true" :disabled="true">Disabled clickable</SeneuTag>
        <SeneuTag :removable="true" :disabled="true">Disabled removable</SeneuTag>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Sizes">
      <div class="showcase-row">
        <SeneuTag variant="brand" size="sm">Small</SeneuTag>
        <SeneuTag variant="brand" size="base">Base</SeneuTag>
        <SeneuTag variant="brand" size="lg">Large</SeneuTag>
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
