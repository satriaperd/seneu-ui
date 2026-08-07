<script setup>
import { ref } from 'vue'
import SeneuStepper from '../components/layout/SeneuStepper.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const basicStep = ref(2)
const dotStep = ref(2)
const iconStep = ref(2)
const clickableStep = ref(3)
const verticalStep = ref(2)
const withDescStep = ref(1)

const basicSteps = [
  { title: 'Account' },
  { title: 'Profile' },
  { title: 'Confirm' },
]

const iconSteps = [
  { title: 'Cart', icon: 'shopping_cart' },
  { title: 'Shipping', icon: 'local_shipping' },
  { title: 'Payment', icon: 'payments' },
  { title: 'Done', icon: 'check_circle' },
]

const errorSteps = [
  { title: 'Account' },
  { title: 'Payment', status: 'error' },
  { title: 'Confirm' },
]

const descSteps = [
  { title: 'Create account', description: 'Set up your login credentials' },
  { title: 'Verify email', description: 'Check your inbox for the confirmation link' },
  { title: 'Complete profile', description: 'Add your name and avatar' },
]

function onChange({ from, to }) {
  void from
  void to
}
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Variants">
      <div class="showcase-col">
        <SeneuStepper v-model="basicStep" :steps="basicSteps" variant="numbered" @change="onChange" />
        <SeneuStepper v-model="dotStep" :steps="basicSteps" variant="dot" />
        <SeneuStepper v-model="iconStep" :steps="iconSteps" variant="icon" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Error Step">
      <SeneuStepper :model-value="2" :steps="errorSteps" />
    </DevShowcaseSection>

    <DevShowcaseSection title="With Description">
      <SeneuStepper v-model="withDescStep" :steps="descSteps" />
    </DevShowcaseSection>

    <DevShowcaseSection title="Clickable (navigate back to completed steps)">
      <SeneuStepper v-model="clickableStep" :steps="basicSteps" :clickable="true" @change="onChange" />
      <p class="showcase-caption">Step yang udah completed bisa di-klik atau fokus + Enter/Space buat balik.</p>
    </DevShowcaseSection>

    <DevShowcaseSection title="Vertical Orientation">
      <SeneuStepper v-model="verticalStep" :steps="descSteps" orientation="vertical" />
    </DevShowcaseSection>

    <DevShowcaseSection title="Loading">
      <SeneuStepper :steps="[]" :loading="true" />
    </DevShowcaseSection>

  </DevShowcase>
</template>

<style scoped>
.showcase-col {
  display: flex;
  flex-direction: column;
  gap: var(--primitive-space-8);
  align-items: flex-start;
}

.showcase-caption {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  margin-top: var(--primitive-space-2);
}
</style>
