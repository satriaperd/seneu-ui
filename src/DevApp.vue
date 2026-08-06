<template>
  <div class="dev-shell" :class="{ dark: isDark }">

    <!-- Sidebar -->
    <aside class="dev-sidebar">
      <div class="dev-sidebar__header">
        <span class="dev-sidebar__logo">Seneu UI</span>
        <span class="dev-sidebar__version">v{{ version }}</span>
      </div>

      <nav class="dev-sidebar__nav">
        <div v-for="category in componentCategories" :key="category.label" class="dev-sidebar__group">
          <span class="dev-sidebar__group-label">{{ category.label }}</span>
          <button
            v-for="item in category.items"
            :key="item.id"
            class="dev-sidebar__item"
            :class="{ 'dev-sidebar__item--active': activeComponent === item.id, 'dev-sidebar__item--wip': !item.ready }"
            @click="activeComponent = item.id"
          >
            <span class="dev-sidebar__item-dot" :class="item.ready ? 'dev-sidebar__item-dot--done' : 'dev-sidebar__item-dot--wip'" />
            {{ item.name }}
          </button>
        </div>
      </nav>

      <div class="dev-sidebar__footer">
        <button class="dev-theme-toggle" @click="toggleTheme">
          <SeneuIcon :name="isDark ? 'light_mode' : 'dark_mode'" :size="16" />
          {{ isDark ? 'Light' : 'Dark' }}
        </button>
      </div>
    </aside>

    <!-- Main -->
    <main class="dev-main">
      <div class="dev-main__topbar">
        <div>
          <h1 class="dev-main__title">{{ activeItem?.name ?? 'Pilih komponen' }}</h1>
          <p v-if="activeItem" class="dev-main__subtitle">{{ activeItem.category }} · {{ activeItem.ready ? 'Selesai' : 'Belum dibuat' }}</p>
        </div>
        <div class="dev-main__badges">
          <span v-if="activeItem?.ready" class="dev-badge dev-badge--success">Ready</span>
          <span v-else class="dev-badge dev-badge--warning">WIP</span>
        </div>
      </div>

      <div class="dev-main__content">

        <!-- Token Preview -->
        <template v-if="activeComponent === '__tokens__'">
          <div class="dev-token-section">
            <h2 class="dev-token-section__title">Brand Colors</h2>
            <div class="dev-color-grid">
              <div v-for="shade in [50,100,200,300,400,500,600,700,800,900]" :key="shade" class="dev-color-swatch">
                <div class="dev-color-swatch__block" :style="{ background: `var(--primitive-color-orange-${shade})` }" />
                <span class="dev-color-swatch__label">orange-{{ shade }}</span>
              </div>
            </div>
          </div>

          <div class="dev-token-section">
            <h2 class="dev-token-section__title">Neutral / Warm Gray</h2>
            <div class="dev-color-grid">
              <div v-for="shade in [0,50,100,200,300,400,500,600,700,800,900,950]" :key="shade" class="dev-color-swatch">
                <div class="dev-color-swatch__block" :style="{ background: `var(--primitive-color-neutral-${shade})`, border: shade === 0 ? '1px solid var(--color-border-default)' : 'none' }" />
                <span class="dev-color-swatch__label">neutral-{{ shade }}</span>
              </div>
            </div>
          </div>

          <div class="dev-token-section">
            <h2 class="dev-token-section__title">Semantic Surfaces</h2>
            <div class="dev-color-grid">
              <div v-for="name in ['default','raised','brand','brand-subtle','danger','danger-subtle','warning','warning-subtle','success','success-subtle','info','info-subtle']" :key="name" class="dev-color-swatch">
                <div class="dev-color-swatch__block" :style="{ background: `var(--color-surface-${name})`, outline: '1px solid var(--color-border-default)' }" />
                <span class="dev-color-swatch__label">{{ name }}</span>
              </div>
            </div>
          </div>

          <div class="dev-token-section">
            <h2 class="dev-token-section__title">Chart Colors</h2>
            <div class="dev-color-grid">
              <div v-for="n in [1,2,3,4]" :key="n" class="dev-color-swatch">
                <div class="dev-color-swatch__block" :style="{ background: `var(--color-chart-${n})` }" />
                <span class="dev-color-swatch__label">chart-{{ n }}</span>
              </div>
            </div>
          </div>

          <div class="dev-token-section">
            <h2 class="dev-token-section__title">Elevation</h2>
            <div class="dev-elevation-grid">
              <div v-for="level in ['surface','raised','floating','overlay','sticky']" :key="level" class="dev-elevation-card" :style="{ boxShadow: `var(--elevation-${level})` }">
                <span>{{ level }}</span>
              </div>
            </div>
          </div>

          <div class="dev-token-section">
            <h2 class="dev-token-section__title">Border Radius</h2>
            <div class="dev-radius-grid">
              <div v-for="name in ['subtle','element','container','overlay','pill']" :key="name" class="dev-radius-card">
                <div class="dev-radius-card__box" :style="{ borderRadius: `var(--radius-${name})` }" />
                <span>{{ name }}</span>
              </div>
            </div>
          </div>

          <div class="dev-token-section">
            <h2 class="dev-token-section__title">Typography Scale</h2>
            <div class="dev-type-stack">
              <div v-for="size in ['xs','small','body','lead','heading-4','heading-3','heading-2','heading-1']" :key="size" class="dev-type-row">
                <span class="dev-type-row__label">{{ size }}</span>
                <span :style="{ fontSize: `var(--font-size-${size})`, lineHeight: '1.2' }">Seneu UI</span>
              </div>
            </div>
          </div>
        </template>

        <!-- Icon Showcase -->
        <template v-else-if="activeComponent === '__icon__'">
          <div class="dev-token-section">
            <h2 class="dev-token-section__title">Props</h2>
            <div class="dev-icon-prop-grid">
              <div class="dev-icon-prop-row">
                <span class="dev-icon-prop-row__label">size</span>
                <div class="dev-icon-row">
                  <div v-for="s in [12,16,20,24,32,48]" :key="s" class="dev-icon-cell">
                    <SeneuIcon name="star" :size="s" />
                    <span class="dev-icon-cell__label">{{ s }}px</span>
                  </div>
                </div>
              </div>
              <div class="dev-icon-prop-row">
                <span class="dev-icon-prop-row__label">fill</span>
                <div class="dev-icon-row">
                  <div class="dev-icon-cell">
                    <SeneuIcon name="favorite" :fill="false" :size="24" />
                    <span class="dev-icon-cell__label">false</span>
                  </div>
                  <div class="dev-icon-cell">
                    <SeneuIcon name="favorite" :fill="true" :size="24" />
                    <span class="dev-icon-cell__label">true</span>
                  </div>
                </div>
              </div>
              <div class="dev-icon-prop-row">
                <span class="dev-icon-prop-row__label">weight</span>
                <div class="dev-icon-row">
                  <div v-for="w in [100,200,300,400,500,600,700]" :key="w" class="dev-icon-cell">
                    <SeneuIcon name="settings" :weight="w" :size="24" />
                    <span class="dev-icon-cell__label">{{ w }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="dev-token-section">
            <h2 class="dev-token-section__title">Common Icons</h2>
            <div class="dev-icon-grid">
              <div v-for="icon in COMMON_ICONS" :key="icon" class="dev-icon-tile">
                <SeneuIcon :name="icon" :size="24" />
                <span class="dev-icon-tile__label">{{ icon }}</span>
              </div>
            </div>
          </div>

          <div class="dev-token-section">
            <h2 class="dev-token-section__title">Accessibility</h2>
            <div class="dev-icon-row" style="gap: var(--primitive-space-6);">
              <div>
                <p class="dev-showcase-caption">Decorative (aria-hidden)</p>
                <div style="display:flex;align-items:center;gap:var(--primitive-space-2);margin-top:var(--primitive-space-2);">
                  <SeneuIcon name="info" :size="20" />
                  <span style="font-size:var(--font-size-body);">No label prop — screen reader ignores it</span>
                </div>
              </div>
              <div>
                <p class="dev-showcase-caption">Meaningful (role="img")</p>
                <div style="display:flex;align-items:center;gap:var(--primitive-space-2);margin-top:var(--primitive-space-2);">
                  <SeneuIcon name="warning" :size="20" label="Warning" />
                  <span style="font-size:var(--font-size-body);">label="Warning" → screen reader announces it</span>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- useTheme Showcase -->
        <template v-else-if="activeComponent === '__theme__'">
          <div class="dev-token-section">
            <h2 class="dev-token-section__title">Current State</h2>
            <div class="dev-theme-state">
              <div class="dev-theme-state__indicator" :class="isDark ? 'dev-theme-state__indicator--dark' : 'dev-theme-state__indicator--light'">
                <SeneuIcon :name="isDark ? 'dark_mode' : 'light_mode'" :size="32" />
                <span>{{ isDark ? 'Dark mode' : 'Light mode' }}</span>
              </div>
              <code class="dev-theme-state__code">isDark = {{ isDark }}</code>
            </div>
          </div>

          <div class="dev-token-section">
            <h2 class="dev-token-section__title">API</h2>
            <div class="dev-theme-api">
              <div class="dev-theme-api__row">
                <button class="dev-btn-showcase" @click="toggleTheme">toggle()</button>
                <span class="dev-showcase-caption">flip antara light ↔ dark, simpan ke localStorage</span>
              </div>
              <div class="dev-theme-api__row">
                <button class="dev-btn-showcase" @click="setTheme('light')">setTheme('light')</button>
                <span class="dev-showcase-caption">paksa light mode</span>
              </div>
              <div class="dev-theme-api__row">
                <button class="dev-btn-showcase" @click="setTheme('dark')">setTheme('dark')</button>
                <span class="dev-showcase-caption">paksa dark mode</span>
              </div>
              <div class="dev-theme-api__row">
                <button class="dev-btn-showcase" @click="setTheme('system')">setTheme('system')</button>
                <span class="dev-showcase-caption">follow OS preference, clear override</span>
              </div>
            </div>
          </div>

          <div class="dev-token-section">
            <h2 class="dev-token-section__title">Singleton Behaviour</h2>
            <p style="font-size:var(--font-size-body);color:var(--color-text-muted);line-height:var(--line-height-normal);">
              Every component that calls <code style="font-family:var(--font-mono);font-size:var(--font-size-small);">useTheme()</code>
              shares the same <code style="font-family:var(--font-mono);font-size:var(--font-size-small);">isDark</code> —
              one change instantly reflects across the whole app.
              The theme toggle in the left sidebar uses the same composable.
            </p>
          </div>
        </template>

        <!-- Generic component showcase (future components) -->
        <template v-else-if="activeItem?.ready && activeItem?.showcase">
          <component :is="activeItem.showcase" />
        </template>

        <!-- WIP / not built yet -->
        <template v-else>
          <div class="dev-empty">
            <SeneuIcon name="construction" :size="48" style="color:var(--color-border-muted);" />
            <p class="dev-empty__title">Component not built yet</p>
            <p class="dev-empty__desc">{{ activeItem?.name ?? 'Select a component from the sidebar' }} will show up here once it's done.</p>
          </div>
        </template>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTheme } from './composables/useTheme.js'
import SeneuIcon from './components/display/SeneuIcon.vue'
import SeneuButtonShowcase   from './dev/SeneuButtonShowcase.vue'
import SeneuInputShowcase    from './dev/SeneuInputShowcase.vue'
import SeneuTextareaShowcase from './dev/SeneuTextareaShowcase.vue'
import SeneuSelectShowcase   from './dev/SeneuSelectShowcase.vue'

const version = '1.0.0'
const { isDark, toggle: toggleTheme, setTheme } = useTheme()
const activeComponent = ref('__tokens__')

const COMMON_ICONS = [
  'home', 'dashboard', 'settings', 'person', 'group', 'search',
  'add', 'edit', 'delete', 'close', 'check', 'arrow_back',
  'arrow_forward', 'chevron_right', 'expand_more', 'menu',
  'notifications', 'mail', 'calendar_today', 'schedule',
  'folder', 'file_copy', 'upload', 'download', 'link',
  'visibility', 'visibility_off', 'lock', 'lock_open',
  'info', 'warning', 'error', 'check_circle', 'help',
  'star', 'favorite', 'bookmark', 'share', 'more_vert',
]

const componentCategories = [
  {
    label: 'Foundation',
    items: [
      { id: '__tokens__', name: 'Token Preview', category: 'Foundation', ready: true, showcase: null },
      { id: '__icon__',   name: 'SeneuIcon',     category: 'Foundation', ready: true, showcase: null },
      { id: '__theme__',  name: 'useTheme',      category: 'Foundation', ready: true, showcase: null },
    ],
  },
  {
    label: 'Form & Input',
    items: [
      { id: 'SeneuButton',     name: 'Button',      category: 'Form', ready: true, showcase: SeneuButtonShowcase },
      { id: 'SeneuInput',      name: 'Input',       category: 'Form', ready: true, showcase: SeneuInputShowcase },
      { id: 'SeneuTextarea',   name: 'Textarea',    category: 'Form', ready: true, showcase: SeneuTextareaShowcase },
      { id: 'SeneuSelect',     name: 'Select',      category: 'Form', ready: true, showcase: SeneuSelectShowcase },
      { id: 'SeneuCheckbox',   name: 'Checkbox',    category: 'Form', ready: false },
      { id: 'SeneuRadio',      name: 'Radio',       category: 'Form', ready: false },
      { id: 'SeneuToggle',     name: 'Toggle',      category: 'Form', ready: false },
      { id: 'SeneuDatePicker', name: 'Date Picker', category: 'Form', ready: false },
      { id: 'SeneuFileUpload', name: 'File Upload', category: 'Form', ready: false },
      { id: 'SeneuSearchBar',  name: 'Search Bar',  category: 'Form', ready: false },
    ],
  },
  {
    label: 'Layout & Navigation',
    items: [
      { id: 'SeneuSidebar',         name: 'Sidebar',          category: 'Layout', ready: false },
      { id: 'SeneuTopbar',          name: 'Topbar',           category: 'Layout', ready: false },
      { id: 'SeneuBreadcrumb',      name: 'Breadcrumb',       category: 'Layout', ready: false },
      { id: 'SeneuTabs',            name: 'Tabs',             category: 'Layout', ready: false },
      { id: 'SeneuPagination',      name: 'Pagination',       category: 'Layout', ready: false },
      { id: 'SeneuStepper',         name: 'Stepper',          category: 'Layout', ready: false },
      { id: 'SeneuFooter',          name: 'Footer',           category: 'Layout', ready: false },
      { id: 'SeneuCarousel',        name: 'Carousel',         category: 'Layout', ready: false },
      { id: 'SeneuRichTextEditor',  name: 'Rich Text Editor', category: 'Layout', ready: false },
    ],
  },
  {
    label: 'Data Display',
    items: [
      { id: 'SeneuCard',         name: 'Card',          category: 'Display', ready: false },
      { id: 'SeneuTable',        name: 'Table',         category: 'Display', ready: false },
      { id: 'SeneuBadge',        name: 'Badge',         category: 'Display', ready: false },
      { id: 'SeneuTag',          name: 'Tag',           category: 'Display', ready: false },
      { id: 'SeneuTooltip',      name: 'Tooltip',       category: 'Display', ready: false },
      { id: 'SeneuAvatar',       name: 'Avatar',        category: 'Display', ready: false },
      { id: 'SeneuStatCard',     name: 'Stat Card',     category: 'Display', ready: false },
      { id: 'SeneuChartWrapper', name: 'Chart Wrapper', category: 'Display', ready: false },
      { id: 'SeneuEmptyState',   name: 'Empty State',   category: 'Display', ready: false },
      { id: 'SeneuSkeleton',     name: 'Skeleton',      category: 'Display', ready: false },
    ],
  },
  {
    label: 'Feedback & Overlay',
    items: [
      { id: 'SeneuAlert',         name: 'Alert',          category: 'Feedback', ready: false },
      { id: 'SeneuToast',         name: 'Toast',          category: 'Feedback', ready: false },
      { id: 'SeneuModal',         name: 'Modal',          category: 'Feedback', ready: false },
      { id: 'SeneuDrawer',        name: 'Drawer',         category: 'Feedback', ready: false },
      { id: 'SeneuProgressBar',   name: 'Progress Bar',   category: 'Feedback', ready: false },
      { id: 'SeneuSpinner',       name: 'Spinner',        category: 'Feedback', ready: false },
      { id: 'SeneuConfirmDialog', name: 'Confirm Dialog', category: 'Feedback', ready: false },
    ],
  },
]

const activeItem = computed(() => {
  for (const cat of componentCategories) {
    const found = cat.items.find(i => i.id === activeComponent.value)
    if (found) return { ...found, category: cat.label }
  }
  return null
})
</script>

<style>
/* Reset & base */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-sans);
  font-size: var(--font-size-body);
  background: var(--color-surface-default);
  color: var(--color-text-default);
}

/* Shell layout */
.dev-shell {
  display: flex;
  min-height: 100vh;
  background: var(--color-surface-default);
  color: var(--color-text-default);
}

/* ── Sidebar ─────────────────────────────────────── */
.dev-sidebar {
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--color-surface-raised);
  border-right: 1px solid var(--color-border-default);
  box-shadow: var(--elevation-sticky);
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}

.dev-sidebar__header {
  display: flex;
  align-items: baseline;
  gap: var(--space-inline-tight);
  padding: var(--primitive-space-4) var(--primitive-space-4);
  border-bottom: 1px solid var(--color-border-default);
  flex-shrink: 0;
}

.dev-sidebar__logo {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-default);
  letter-spacing: var(--letter-spacing-tight);
}

.dev-sidebar__version {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  font-family: var(--font-mono);
}

.dev-sidebar__nav {
  flex: 1;
  overflow-y: auto;
  padding: var(--primitive-space-3) 0;
  scrollbar-width: thin;
  scrollbar-color: var(--color-border-default) transparent;
}

.dev-sidebar__group {
  margin-bottom: var(--primitive-space-3);
}

.dev-sidebar__group-label {
  display: block;
  padding: var(--primitive-space-1) var(--primitive-space-4);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  margin-bottom: var(--primitive-space-1);
}

.dev-sidebar__item {
  display: flex;
  align-items: center;
  gap: var(--primitive-space-2);
  width: 100%;
  padding: var(--primitive-space-1) var(--primitive-space-4);
  font-size: var(--font-size-small);
  color: var(--color-text-default);
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  border-radius: 0;
  transition: background var(--duration-fast) var(--easing-standard),
              color var(--duration-fast) var(--easing-standard);
}

.dev-sidebar__item:hover {
  background: var(--color-surface-brand-subtle);
  color: var(--color-text-brand);
}

.dev-sidebar__item--active {
  background: var(--color-surface-brand-subtle);
  color: var(--color-text-brand);
  font-weight: var(--font-weight-medium);
}

.dev-sidebar__item--wip {
  opacity: 0.6;
}

.dev-sidebar__item-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-circle);
  flex-shrink: 0;
}

.dev-sidebar__item-dot--done { background: var(--color-surface-success); }
.dev-sidebar__item-dot--wip  { background: var(--color-border-muted); }

.dev-sidebar__footer {
  padding: var(--primitive-space-3) var(--primitive-space-4);
  border-top: 1px solid var(--color-border-default);
  flex-shrink: 0;
}

.dev-theme-toggle {
  display: flex;
  align-items: center;
  gap: var(--primitive-space-2);
  width: 100%;
  padding: var(--primitive-space-2) var(--primitive-space-3);
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  background: transparent;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-element);
  cursor: pointer;
  transition: all var(--duration-fast) var(--easing-standard);
}

.dev-theme-toggle:hover {
  color: var(--color-text-default);
  border-color: var(--color-border-interactive);
}

/* ── Main ────────────────────────────────────────── */
.dev-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.dev-main__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--primitive-space-4) var(--primitive-space-8);
  border-bottom: 1px solid var(--color-border-default);
  background: var(--color-surface-raised);
  box-shadow: var(--elevation-surface);
  flex-shrink: 0;
}

.dev-main__title {
  font-size: var(--font-size-lead);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-default);
}

.dev-main__subtitle {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  margin-top: 2px;
}

.dev-main__badges { display: flex; gap: var(--primitive-space-2); }

.dev-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: var(--radius-pill);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
}

.dev-badge--success {
  background: var(--color-surface-success-subtle);
  color: var(--color-text-success);
}

.dev-badge--warning {
  background: var(--color-surface-warning-subtle);
  color: var(--color-text-warning);
}

.dev-main__content {
  flex: 1;
  padding: var(--primitive-space-8);
  overflow-y: auto;
}

/* ── Empty state ─────────────────────────────────── */
.dev-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--primitive-space-3);
  min-height: 320px;
  color: var(--color-text-muted);
  text-align: center;
}

.dev-empty__title {
  font-size: var(--font-size-lead);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-default);
}

.dev-empty__desc {
  font-size: var(--font-size-body);
  max-width: 360px;
}

/* ── Token preview ───────────────────────────────── */
.dev-token-section {
  margin-bottom: var(--primitive-space-10);
}

.dev-token-section__title {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  margin-bottom: var(--primitive-space-4);
  padding-bottom: var(--primitive-space-2);
  border-bottom: 1px solid var(--color-border-default);
}

.dev-color-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--primitive-space-3);
}

.dev-color-swatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--primitive-space-1);
}

.dev-color-swatch__block {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-element);
}

.dev-color-swatch__label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  white-space: nowrap;
}

.dev-elevation-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--primitive-space-6);
}

.dev-elevation-card {
  width: 120px;
  height: 80px;
  border-radius: var(--radius-container);
  background: var(--color-surface-raised);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  font-family: var(--font-mono);
}

.dev-radius-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--primitive-space-6);
}

.dev-radius-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--primitive-space-2);
}

.dev-radius-card__box {
  width: 64px;
  height: 64px;
  background: var(--color-surface-brand-subtle);
  border: 2px solid var(--color-border-brand);
}

.dev-radius-card span {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  font-family: var(--font-mono);
}

.dev-type-stack {
  display: flex;
  flex-direction: column;
  gap: var(--primitive-space-3);
}

.dev-type-row {
  display: flex;
  align-items: baseline;
  gap: var(--primitive-space-4);
}

.dev-type-row__label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  width: 80px;
  flex-shrink: 0;
}

/* ── Icon showcase ───────────────────────────────── */
.dev-icon-prop-grid {
  display: flex;
  flex-direction: column;
  gap: var(--primitive-space-6);
}

.dev-icon-prop-row {
  display: flex;
  align-items: center;
  gap: var(--primitive-space-6);
}

.dev-icon-prop-row__label {
  font-size: var(--font-size-xs);
  font-family: var(--font-mono);
  color: var(--color-text-muted);
  width: 56px;
  flex-shrink: 0;
}

.dev-icon-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--primitive-space-4);
}

.dev-icon-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--primitive-space-1);
}

.dev-icon-cell__label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  font-family: var(--font-mono);
}

.dev-icon-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--primitive-space-3);
}

.dev-icon-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--primitive-space-1);
  padding: var(--primitive-space-3);
  border-radius: var(--radius-element);
  border: 1px solid var(--color-border-default);
  background: var(--color-surface-raised);
  min-width: 72px;
  transition: border-color var(--duration-fast) var(--easing-standard);
}

.dev-icon-tile:hover {
  border-color: var(--color-border-interactive);
}

.dev-icon-tile__label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  text-align: center;
  word-break: break-all;
}

/* ── useTheme showcase ───────────────────────────── */
.dev-theme-state {
  display: flex;
  align-items: center;
  gap: var(--primitive-space-6);
}

.dev-theme-state__indicator {
  display: flex;
  align-items: center;
  gap: var(--primitive-space-3);
  padding: var(--primitive-space-4) var(--primitive-space-6);
  border-radius: var(--radius-container);
  font-size: var(--font-size-lead);
  font-weight: var(--font-weight-medium);
  border: 1px solid var(--color-border-default);
}

.dev-theme-state__indicator--light {
  background: var(--color-surface-warning-subtle);
  color: var(--color-text-warning);
}

.dev-theme-state__indicator--dark {
  background: var(--color-surface-info-subtle);
  color: var(--color-text-info);
}

.dev-theme-state__code {
  font-family: var(--font-mono);
  font-size: var(--font-size-body);
  color: var(--color-text-muted);
  padding: var(--primitive-space-2) var(--primitive-space-3);
  background: var(--color-surface-raised);
  border-radius: var(--radius-element);
  border: 1px solid var(--color-border-default);
}

.dev-theme-api {
  display: flex;
  flex-direction: column;
  gap: var(--primitive-space-3);
}

.dev-theme-api__row {
  display: flex;
  align-items: center;
  gap: var(--primitive-space-4);
}

.dev-btn-showcase {
  font-family: var(--font-mono);
  font-size: var(--font-size-small);
  color: var(--color-text-brand);
  background: var(--color-surface-brand-subtle);
  border: 1px solid var(--color-border-brand);
  border-radius: var(--radius-element);
  padding: var(--primitive-space-2) var(--primitive-space-4);
  cursor: pointer;
  transition: all var(--duration-fast) var(--easing-standard);
  white-space: nowrap;
}

.dev-btn-showcase:hover {
  background: var(--color-surface-brand);
  color: var(--color-text-on-brand);
}

.dev-showcase-caption {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
}
</style>
