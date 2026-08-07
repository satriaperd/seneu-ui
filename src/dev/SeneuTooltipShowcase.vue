<script setup>
import SeneuTooltip from '../components/display/SeneuTooltip.vue'
import SeneuButton from '../components/form/SeneuButton.vue'
import SeneuIcon from '../components/display/SeneuIcon.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Placements">
      <div class="showcase-row showcase-row--spaced">
        <SeneuTooltip content="Tooltip on top" placement="top">
          <SeneuButton variant="default" size="sm">Top</SeneuButton>
        </SeneuTooltip>
        <SeneuTooltip content="Tooltip on bottom" placement="bottom">
          <SeneuButton variant="default" size="sm">Bottom</SeneuButton>
        </SeneuTooltip>
        <SeneuTooltip content="Tooltip on left" placement="left">
          <SeneuButton variant="default" size="sm">Left</SeneuButton>
        </SeneuTooltip>
        <SeneuTooltip content="Tooltip on right" placement="right">
          <SeneuButton variant="default" size="sm">Right</SeneuButton>
        </SeneuTooltip>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Variants">
      <div class="showcase-row showcase-row--spaced">
        <SeneuTooltip content="Dark bubble (default)" variant="dark">
          <SeneuButton variant="brand" size="sm">Dark</SeneuButton>
        </SeneuTooltip>
        <SeneuTooltip content="Light bubble with border" variant="light">
          <SeneuButton variant="default" size="sm">Light</SeneuButton>
        </SeneuTooltip>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Icon-only Trigger">
      <div class="showcase-row showcase-row--spaced">
        <SeneuTooltip content="Delete this item">
          <button type="button" class="showcase-icon-btn" aria-label="Delete">
            <SeneuIcon name="delete" :size="18" />
          </button>
        </SeneuTooltip>
      </div>
      <p class="showcase-caption">Trigger dapat aria-describedby otomatis pas tooltip muncul.</p>
    </DevShowcaseSection>

    <DevShowcaseSection title="Disabled">
      <div class="showcase-row showcase-row--spaced">
        <SeneuTooltip content="You won't see this" disabled>
          <SeneuButton variant="default" size="sm">Disabled tooltip</SeneuButton>
        </SeneuTooltip>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Near Viewport Edge — Auto-flip">
      <div class="showcase-edge-row">
        <SeneuTooltip content="I flip to bottom because top would clip" placement="top">
          <SeneuButton variant="default" size="sm">Top-left corner</SeneuButton>
        </SeneuTooltip>
      </div>
      <p class="showcase-caption">Hover tombol di pojok atas — placement otomatis flip ke bawah kalau ke-clip viewport.</p>
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
.showcase-row--spaced { padding: var(--primitive-space-8) 0; }

.showcase-edge-row {
  display: flex;
  padding-top: var(--primitive-space-2);
}

.showcase-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: var(--radius-element);
  border: 1px solid var(--color-border-default);
  background-color: var(--color-surface-raised);
  color: var(--color-text-default);
  cursor: pointer;
}
.showcase-icon-btn:hover { background-color: var(--color-surface-raised-hover); }
.showcase-icon-btn:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

.showcase-caption {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  margin-top: var(--primitive-space-2);
}
</style>
