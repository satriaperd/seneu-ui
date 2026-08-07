<script setup>
import { ref } from 'vue'
import SeneuAvatar from '../components/display/SeneuAvatar.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl']
const brokenSrc = 'https://this-domain-does-not-exist.invalid/avatar.jpg'
const showBroken = ref(true)
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Sizes">
      <div class="showcase-row showcase-row--align-end">
        <SeneuAvatar v-for="s in sizes" :key="s" :size="s" name="Cimang Club" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Shapes">
      <div class="showcase-row">
        <SeneuAvatar shape="circle" name="Satria Perdana" size="lg" />
        <SeneuAvatar shape="square" name="Satria Perdana" size="lg" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Initials — Deterministic Color per Name">
      <div class="showcase-row">
        <SeneuAvatar v-for="n in ['Ayu Lestari', 'Budi Santoso', 'Citra Dewi', 'Doni Prakoso', 'Eka Wulandari', 'Farhan']" :key="n" :name="n" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Image — with Fallback on Error">
      <div class="showcase-row">
        <SeneuAvatar src="https://i.pravatar.cc/150?img=12" name="Real Photo" size="lg" />
        <SeneuAvatar v-if="showBroken" :src="brokenSrc" name="Broken Link" size="lg" />
      </div>
      <p class="showcase-caption">Avatar kedua sengaja pakai URL yang gagal load — otomatis fallback ke initials.</p>
    </DevShowcaseSection>

    <DevShowcaseSection title="No Name — Icon Fallback">
      <div class="showcase-row">
        <SeneuAvatar size="lg" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Status Indicator">
      <div class="showcase-row">
        <SeneuAvatar name="Ayu Lestari" status="online" size="lg" />
        <SeneuAvatar name="Budi Santoso" status="away" size="lg" />
        <SeneuAvatar name="Citra Dewi" status="busy" size="lg" />
        <SeneuAvatar name="Doni Prakoso" status="offline" size="lg" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Loading">
      <div class="showcase-row">
        <SeneuAvatar loading size="sm" />
        <SeneuAvatar loading size="base" />
        <SeneuAvatar loading size="lg" shape="square" />
      </div>
    </DevShowcaseSection>

  </DevShowcase>
</template>

<style scoped>
.showcase-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--primitive-space-4);
}
.showcase-row--align-end { align-items: flex-end; }

.showcase-caption {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  margin-top: var(--primitive-space-2);
}
</style>
