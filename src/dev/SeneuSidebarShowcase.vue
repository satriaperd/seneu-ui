<script setup>
import { ref } from 'vue'
import SeneuSidebar from '../components/layout/SeneuSidebar.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const collapsed1 = ref(false)
const collapsed2 = ref(true)
const mobileOpen = ref(false)
const mobileOpenLoading = ref(false)

const sections = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '#', active: true },
      { id: 'analytics', label: 'Analytics', icon: 'analytics', href: '#', badge: 3 },
    ],
  },
  {
    label: 'Content',
    items: [
      {
        id: 'content',
        label: 'Content',
        icon: 'article',
        children: [
          { id: 'posts', label: 'Posts', href: '#', icon: 'description' },
          { id: 'pages', label: 'Pages', href: '#', icon: 'article' },
          { id: 'media', label: 'Media Library', href: '#', icon: 'perm_media' },
        ],
      },
      { id: 'comments', label: 'Comments', icon: 'chat_bubble', href: '#', badge: 12, badgeVariant: 'danger' },
      { id: 'archive', label: 'Archive', icon: 'inventory_2', href: '#', disabled: true },
    ],
  },
  {
    label: 'Account',
    items: [
      { id: 'settings', label: 'Settings', icon: 'settings', href: '#' },
    ],
  },
]

function onItemClick() {
  // Demo only — real apps handle navigation here (e.g. router.push(item.href))
}
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Desktop Rail — Expanded / Collapsed">
      <div class="showcase-row">
        <div class="showcase-frame">
          <SeneuSidebar
            v-model:collapsed="collapsed1"
            brand-name="Seneu CMS"
            brand-icon="local_fire_department"
            :sections="sections"
            :show-mobile-trigger="false"
            @item-click="onItemClick"
          />
        </div>
        <div class="showcase-frame">
          <SeneuSidebar
            v-model:collapsed="collapsed2"
            brand-name="Seneu CMS"
            brand-icon="local_fire_department"
            :sections="sections"
            :show-mobile-trigger="false"
            @item-click="onItemClick"
          />
        </div>
      </div>
      <p class="showcase-caption">Klik tombol chevron di header buat toggle collapsed — state di-drive lewat v-model:collapsed.</p>
    </DevShowcaseSection>

    <DevShowcaseSection title="Footer Slot">
      <div class="showcase-row">
        <div class="showcase-frame">
          <SeneuSidebar brand-name="Seneu CMS" brand-icon="local_fire_department" :sections="sections" :show-mobile-trigger="false">
            <template #footer>
              <div class="showcase-user">
                <span class="showcase-user__avatar">SP</span>
                <span class="showcase-user__name seneu-sidebar__footer-label">Satria P.</span>
              </div>
            </template>
          </SeneuSidebar>
        </div>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Loading (skeleton)">
      <div class="showcase-row">
        <div class="showcase-frame">
          <SeneuSidebar brand-name="Seneu CMS" brand-icon="local_fire_department" :loading="true" :show-mobile-trigger="false" />
        </div>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Empty State">
      <div class="showcase-row">
        <div class="showcase-frame">
          <SeneuSidebar brand-name="Seneu CMS" brand-icon="local_fire_department" :sections="[]" :show-mobile-trigger="false" />
        </div>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Without Collapse Toggle">
      <div class="showcase-row">
        <div class="showcase-frame">
          <SeneuSidebar
            brand-name="Seneu CMS"
            brand-icon="local_fire_department"
            :sections="sections"
            :show-collapse-toggle="false"
            :show-mobile-trigger="false"
          />
        </div>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Mobile Drawer">
      <p class="showcase-caption">Di bawah 768px rail-nya disembunyiin off-canvas, diganti tombol hamburger mengambang buat buka drawer-nya — bukan bottom tab bar, biar gak overwhelming kalau menu CMS-nya banyak. `force-mobile` dipakai di sini biar preview-nya kelihatan tanpa perlu resize viewport beneran.</p>
      <div class="showcase-phone-frame">
        <SeneuSidebar
          v-model:mobile-open="mobileOpen"
          brand-name="Seneu CMS"
          brand-icon="local_fire_department"
          :sections="sections"
          :force-mobile="true"
          @item-click="onItemClick"
        />
        <div class="showcase-phone-frame__content">
          <p>Klik ikon hamburger di kiri atas buat buka drawer navigasinya. Klik item, backdrop, tombol close, atau Escape buat nutup.</p>
        </div>
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Mobile Drawer — Loading">
      <div class="showcase-phone-frame">
        <SeneuSidebar
          v-model:mobile-open="mobileOpenLoading"
          brand-name="Seneu CMS"
          brand-icon="local_fire_department"
          :loading="true"
          :force-mobile="true"
        />
        <div class="showcase-phone-frame__content">
          <p>Klik ikon hamburger buat lihat skeleton loading-nya.</p>
        </div>
      </div>
    </DevShowcaseSection>

  </DevShowcase>
</template>

<style scoped>
.showcase-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--primitive-space-6);
}

.showcase-frame {
  height: 460px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-container);
  overflow: hidden;
  display: flex;
}

.showcase-phone-frame {
  position: relative;
  width: 375px;
  max-width: 100%;
  height: 460px;
  /* `contain: layout` makes this the containing block for the sidebar's
     fixed-positioned trigger/backdrop/drawer, so the force-mobile preview
     stays confined to this frame instead of covering the whole page. */
  contain: layout;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-container);
  overflow: hidden;
  background: var(--color-surface-default);
}

.showcase-phone-frame__content {
  padding: var(--space-layout-content);
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  line-height: var(--line-height-relaxed);
}

.showcase-caption {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
}

.showcase-user {
  display: flex;
  align-items: center;
  gap: var(--space-inline-normal);
}

.showcase-user__avatar {
  width: 32px;
  height: 32px;
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

.showcase-user__name {
  font-size: var(--font-size-small);
  color: var(--color-text-default);
  font-weight: var(--font-weight-medium);
}

</style>
