<script setup>
import { ref } from 'vue'
import SeneuAlert from '../components/feedback/SeneuAlert.vue'
import SeneuButton from '../components/form/SeneuButton.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const variants = ['default', 'brand', 'info', 'success', 'warning', 'danger']
const dismissed = ref(false)
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Types × Variants">
      <div class="showcase-col">
        <div v-for="type in ['subtle', 'solid', 'outline']" :key="type" class="showcase-type-group">
          <span class="showcase-row-label">{{ type }}</span>
          <SeneuAlert v-for="v in variants" :key="v" :variant="v" :type="type">
            This is a {{ v }} alert message.
          </SeneuAlert>
        </div>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="With Title">
      <SeneuAlert variant="success" title="Payment successful">
        Your subscription has been renewed for another month.
      </SeneuAlert>
    </DevShowcaseSection>

    <DevShowcaseSection title="With Actions">
      <SeneuAlert variant="warning" title="Your trial ends in 3 days">
        Upgrade now to keep access to all features without interruption.
        <template #actions>
          <SeneuButton variant="warning" size="sm">Upgrade</SeneuButton>
          <SeneuButton variant="default" size="sm">Remind me later</SeneuButton>
        </template>
      </SeneuAlert>
    </DevShowcaseSection>

    <DevShowcaseSection title="Dismissible">
      <SeneuAlert v-if="!dismissed" variant="info" dismissible @close="dismissed = true">
        You can close this alert with the button on the right.
      </SeneuAlert>
      <SeneuButton v-else variant="default" size="sm" @click="dismissed = false">Show alert again</SeneuButton>
    </DevShowcaseSection>

    <DevShowcaseSection title="Custom Icon">
      <SeneuAlert variant="brand" icon="rocket_launch" title="New feature available">
        Try out the new dashboard layout in your settings.
      </SeneuAlert>
    </DevShowcaseSection>

  </DevShowcase>
</template>

<style scoped>
.showcase-col {
  display: flex;
  flex-direction: column;
  gap: var(--primitive-space-6);
}

.showcase-type-group {
  display: flex;
  flex-direction: column;
  gap: var(--primitive-space-3);
}

.showcase-row-label {
  font-size: var(--font-size-xs);
  font-family: var(--font-mono);
  color: var(--color-text-muted);
  text-transform: uppercase;
}
</style>
