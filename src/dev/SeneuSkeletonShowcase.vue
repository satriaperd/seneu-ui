<script setup>
import { ref } from 'vue'
import SeneuSkeleton from '../components/display/SeneuSkeleton.vue'
import SeneuCard from '../components/display/SeneuCard.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const animated = ref(true)
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Variants">
      <div class="showcase-col">
        <div class="showcase-row">
          <span class="showcase-row-label">text</span>
          <SeneuSkeleton variant="text" width="12rem" />
        </div>
        <div class="showcase-row">
          <span class="showcase-row-label">title</span>
          <SeneuSkeleton variant="title" width="16rem" />
        </div>
        <div class="showcase-row">
          <span class="showcase-row-label">circle</span>
          <SeneuSkeleton variant="circle" />
        </div>
        <div class="showcase-row">
          <span class="showcase-row-label">rect</span>
          <SeneuSkeleton variant="rect" width="16rem" />
        </div>
        <div class="showcase-row">
          <span class="showcase-row-label">button</span>
          <SeneuSkeleton variant="button" />
        </div>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Multi-line Text">
      <SeneuSkeleton variant="text" :lines="4" style="max-width: 24rem" />
    </DevShowcaseSection>

    <DevShowcaseSection title="Animated Toggle">
      <label class="showcase-toggle-label">
        <input v-model="animated" type="checkbox" />
        Shimmer sweep {{ animated ? 'on' : 'off' }}
      </label>
      <div class="showcase-row" style="margin-top: var(--primitive-space-3)">
        <SeneuSkeleton variant="circle" :animated="animated" />
        <SeneuSkeleton variant="text" width="10rem" :animated="animated" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Composed — Profile Card Loading">
      <SeneuCard style="max-width: 20rem">
        <div class="showcase-profile">
          <SeneuSkeleton variant="circle" width="3.5rem" height="3.5rem" />
          <div class="showcase-profile__lines">
            <SeneuSkeleton variant="text" width="60%" height="1rem" />
            <SeneuSkeleton variant="text" width="40%" />
          </div>
        </div>
        <SeneuSkeleton variant="text" :lines="3" style="margin-top: var(--primitive-space-4)" />
      </SeneuCard>
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

.showcase-toggle-label {
  display: inline-flex;
  align-items: center;
  gap: var(--primitive-space-2);
  font-size: var(--font-size-small);
  color: var(--color-text-default);
  cursor: pointer;
}

.showcase-profile {
  display: flex;
  align-items: center;
  gap: var(--primitive-space-3);
}

.showcase-profile__lines {
  display: flex;
  flex-direction: column;
  gap: var(--primitive-space-2);
  flex: 1;
}
</style>
