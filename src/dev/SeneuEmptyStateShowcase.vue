<script setup>
import SeneuEmptyState from '../components/display/SeneuEmptyState.vue'
import SeneuButton from '../components/form/SeneuButton.vue'
import SeneuIcon from '../components/display/SeneuIcon.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Basic">
      <SeneuEmptyState
        icon="inbox"
        title="No messages yet"
        description="Once someone sends you a message, it'll show up here."
      />
    </DevShowcaseSection>

    <DevShowcaseSection title="With Action">
      <SeneuEmptyState
        icon="search_off"
        title="No results found"
        description="We couldn't find anything matching your search. Try a different keyword."
      >
        <template #actions>
          <SeneuButton variant="brand" size="sm">Clear search</SeneuButton>
          <SeneuButton variant="default" size="sm">Browse all</SeneuButton>
        </template>
      </SeneuEmptyState>
    </DevShowcaseSection>

    <DevShowcaseSection title="Custom Icon Slot">
      <SeneuEmptyState
        title="You're all caught up"
        description="No pending approvals right now — nice work."
      >
        <template #icon>
          <SeneuIcon name="task_alt" :size="32" style="color: var(--color-text-success)" />
        </template>
        <template #actions>
          <SeneuButton variant="success" size="sm">Back to dashboard</SeneuButton>
        </template>
      </SeneuEmptyState>
    </DevShowcaseSection>

    <DevShowcaseSection title="Sizes">
      <div class="showcase-col">
        <SeneuEmptyState size="sm" icon="folder_off" title="No files" description="Upload a file to get started." />
        <SeneuEmptyState size="base" icon="folder_off" title="No files" description="Upload a file to get started." />
        <SeneuEmptyState size="lg" icon="folder_off" title="No files" description="Upload a file to get started." />
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
.showcase-col > * {
  border: 1px dashed var(--color-border-default);
  border-radius: var(--radius-container);
}
</style>
