<script setup>
import { ref } from 'vue'
import SeneuCarousel from '../components/layout/SeneuCarousel.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const slideIndex = ref(0)
const fadeIndex = ref(0)
const autoplayIndex = ref(0)
const counterIndex = ref(0)
const smIndex = ref(0)
const lgIndex = ref(0)

const slides = [
  { title: 'Welcome to Seneu UI', subtitle: 'A Vue 3 component library for CMS and admin panels', badge: 'New', color: 'brand' },
  { title: 'Design tokens built in', subtitle: 'Two-layer token system — primitive and semantic' },
  { title: 'Accessible by default', subtitle: 'WCAG 2.2 AA across every component' },
]

function onChange({ from, to }) {
  void from
  void to
}
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Slide Variant">
      <div class="showcase-frame">
        <SeneuCarousel v-model="slideIndex" :slides="slides" variant="slide" @change="onChange" />
      </div>
      <p class="showcase-caption">Navigasi: klik panah, klik dot, fokus + ←/→, atau swipe (di touch device).</p>
    </DevShowcaseSection>

    <DevShowcaseSection title="Fade Variant">
      <div class="showcase-frame">
        <SeneuCarousel v-model="fadeIndex" :slides="slides" variant="fade" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Autoplay (pauses on hover/focus, with play/pause toggle)">
      <div class="showcase-frame">
        <SeneuCarousel v-model="autoplayIndex" :slides="slides" :autoplay="true" :interval="2500" />
      </div>
      <p class="showcase-caption">Arahin mouse ke carousel-nya buat pause otomatis — atau klik tombol play/pause manual.</p>
    </DevShowcaseSection>

    <DevShowcaseSection title="With Counter">
      <div class="showcase-frame">
        <SeneuCarousel v-model="counterIndex" :slides="slides" :show-counter="true" :show-dots="false" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="No Loop">
      <div class="showcase-frame">
        <SeneuCarousel :model-value="0" :slides="slides" :loop="false" />
      </div>
      <p class="showcase-caption">Di slide pertama/terakhir, panah yang relevan otomatis disabled.</p>
    </DevShowcaseSection>

    <DevShowcaseSection title="Sizes">
      <div class="showcase-col">
        <div class="showcase-frame">
          <SeneuCarousel v-model="smIndex" :slides="slides" size="sm" />
        </div>
        <div class="showcase-frame">
          <SeneuCarousel v-model="lgIndex" :slides="slides" size="lg" />
        </div>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Custom Slide Content">
      <div class="showcase-frame">
        <SeneuCarousel :model-value="0" :slides="[{}, {}, {}]" :show-counter="true">
          <template v-for="index in 3" :key="index" #[`slide-${index-1}`]>
            <div class="showcase-custom-slide">
              <span class="showcase-custom-slide__number">{{ index }}</span>
              <p>Fully custom slide markup via the `slide-N` scoped slot.</p>
            </div>
          </template>
        </SeneuCarousel>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Loading">
      <div class="showcase-frame">
        <SeneuCarousel :slides="[]" :loading="true" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Empty State">
      <div class="showcase-frame">
        <SeneuCarousel :slides="[]" />
      </div>
    </DevShowcaseSection>

  </DevShowcase>
</template>

<style scoped>
.showcase-frame {
  max-width: 560px;
}

.showcase-col {
  display: flex;
  flex-direction: column;
  gap: var(--primitive-space-6);
}

.showcase-caption {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  margin-top: var(--primitive-space-2);
}

.showcase-custom-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--primitive-space-3);
  min-height: 200px;
  background: var(--color-surface-brand-subtle);
  color: var(--color-text-brand);
  text-align: center;
  padding: var(--primitive-space-6);
}

.showcase-custom-slide__number {
  font-size: var(--font-size-display);
  font-weight: var(--font-weight-bold);
  line-height: 1;
}
</style>
