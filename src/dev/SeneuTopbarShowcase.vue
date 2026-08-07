<script setup>
import { ref } from 'vue'
import SeneuTopbar from '../components/layout/SeneuTopbar.vue'
import SeneuIcon from '../components/display/SeneuIcon.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const isDark = ref(false)
const menuToggleCount = ref(0)

function onMenuToggle() {
  menuToggleCount.value++
}
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Basic">
      <div class="showcase-frame">
        <SeneuTopbar title="Dashboard" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="With Section Prefix">
      <div class="showcase-frame">
        <SeneuTopbar section="Components" title="Button" />
      </div>
      <p class="showcase-caption">Section prefix otomatis disembunyiin di layar mobile (&lt;768px).</p>
    </DevShowcaseSection>

    <DevShowcaseSection title="With Menu Toggle">
      <div class="showcase-frame">
        <SeneuTopbar
          section="Components"
          title="Button"
          :show-menu-toggle="true"
          @menu-toggle="onMenuToggle"
        />
      </div>
      <p class="showcase-caption">Menu-toggle di-klik: {{ menuToggleCount }}x — wire ke `collapsed`/`mobileOpen` punya SeneuSidebar.</p>
    </DevShowcaseSection>

    <DevShowcaseSection title="With Actions">
      <div class="showcase-frame">
        <SeneuTopbar section="Components" title="Button">
          <template #actions>
            <button
              class="seneu-topbar-action"
              :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
              @click="isDark = !isDark"
            >
              <SeneuIcon :name="isDark ? 'light_mode' : 'dark_mode'" :size="20" />
            </button>
            <button class="seneu-topbar-action" aria-label="Notifications">
              <SeneuIcon name="notifications" :size="20" />
            </button>
          </template>
        </SeneuTopbar>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="With Search Slot">
      <div class="showcase-frame">
        <SeneuTopbar section="Components" title="Button">
          <template #search>
            <div class="showcase-fake-search">
              <SeneuIcon name="search" :size="18" />
              <span>Cari komponen…</span>
            </div>
          </template>
        </SeneuTopbar>
      </div>
      <p class="showcase-caption">Slot search disembunyiin otomatis di mobile buat ngirit ruang.</p>
    </DevShowcaseSection>

    <DevShowcaseSection title="With User Slot">
      <div class="showcase-frame">
        <SeneuTopbar section="Components" title="Button">
          <template #actions>
            <button class="seneu-topbar-action" aria-label="Notifications">
              <SeneuIcon name="notifications" :size="20" />
            </button>
          </template>
          <template #user>
            <button class="showcase-user-btn">
              <span class="showcase-user-btn__avatar">SP</span>
              <span class="showcase-user-btn__name">Satria P.</span>
              <SeneuIcon name="expand_more" :size="16" />
            </button>
          </template>
        </SeneuTopbar>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Loading">
      <div class="showcase-frame">
        <SeneuTopbar :loading="true" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Without Border">
      <div class="showcase-frame">
        <SeneuTopbar section="Components" title="Button" :bordered="false" />
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

.showcase-caption {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  margin-top: var(--primitive-space-2);
}

.showcase-fake-search {
  display: flex;
  align-items: center;
  gap: var(--space-inline-tight);
  width: 100%;
  padding: 6px var(--space-inline-normal);
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border-default);
  background: var(--color-surface-default);
  color: var(--color-text-muted);
  font-size: var(--font-size-small);
}

.showcase-user-btn {
  display: flex;
  align-items: center;
  gap: var(--space-inline-tight);
  padding: 4px 8px 4px 4px;
  border-radius: var(--radius-pill);
  border: none;
  background: transparent;
  color: var(--color-text-default);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--easing-standard);
}
.showcase-user-btn:hover { background-color: var(--color-surface-raised-hover); }

.showcase-user-btn__avatar {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-circle);
  background: var(--color-surface-brand-subtle);
  color: var(--color-text-brand);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  flex-shrink: 0;
}

.showcase-user-btn__name {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
}
</style>
