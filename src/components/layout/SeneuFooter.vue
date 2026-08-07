<script setup>
import SeneuIcon from '../display/SeneuIcon.vue'

/**
 * Page/app footer. `simple` variant is a single row (brand + inline nav
 * links + copyright); `columns` variant adds a top section with a brand
 * column and multiple link columns above that row.
 */
defineProps({
  variant: {
    type: String,
    default: 'simple',
    validator: v => ['simple', 'columns'].includes(v),
  },
  brand: {
    type: String,
    default: '',
  },
  /** Short tagline shown below the brand in the columns variant */
  tagline: {
    type: String,
    default: '',
  },
  copyright: {
    type: String,
    default: '',
  },
  /** Nav links for the simple variant: [{ label, href? }] */
  links: {
    type: Array,
    default: () => [],
  },
  /** Column definitions for the columns variant: [{ heading, links: [{ label, href? }] }] */
  columns: {
    type: Array,
    default: () => [],
  },
  /** Social/external icon links: [{ icon, href, label }] */
  socialLinks: {
    type: Array,
    default: () => [],
  },
  /** Shows shimmer placeholders instead of columns (columns variant only) */
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['link-click'])
</script>

<template>
  <footer class="seneu-footer" :class="`seneu-footer--${variant}`" role="contentinfo">

    <template v-if="variant === 'columns'">
      <div class="seneu-footer__top">
        <div class="seneu-footer__brand-col">
          <slot name="logo">
            <span v-if="brand" class="seneu-footer__brand-name">{{ brand }}</span>
          </slot>
          <p v-if="tagline" class="seneu-footer__tagline">{{ tagline }}</p>
        </div>

        <div v-if="loading" class="seneu-footer__link-columns" aria-hidden="true">
          <div v-for="n in 3" :key="n" class="seneu-footer__link-col">
            <span class="seneu-footer__skeleton seneu-footer__skeleton--heading" />
            <span v-for="l in 4" :key="l" class="seneu-footer__skeleton" />
          </div>
        </div>
        <div v-else class="seneu-footer__link-columns">
          <div v-for="col in columns" :key="col.heading" class="seneu-footer__link-col">
            <p class="seneu-footer__col-heading">{{ col.heading }}</p>
            <ul class="seneu-footer__link-list">
              <li v-for="link in col.links" :key="link.label">
                <a
                  :href="link.href || '#'"
                  class="seneu-footer__link"
                  @click="$emit('link-click', link)"
                >{{ link.label }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="seneu-footer__divider" aria-hidden="true" />
    </template>

    <div class="seneu-footer__bottom">
      <div class="seneu-footer__bottom-left">
        <template v-if="variant === 'simple'">
          <slot name="logo">
            <span v-if="brand" class="seneu-footer__brand-name">{{ brand }}</span>
          </slot>
          <div v-if="links.length" class="seneu-footer__nav-links">
            <a
              v-for="link in links"
              :key="link.label"
              :href="link.href || '#'"
              class="seneu-footer__link"
              @click="$emit('link-click', link)"
            >{{ link.label }}</a>
          </div>
        </template>
        <span v-if="copyright" class="seneu-footer__copy">{{ copyright }}</span>
      </div>

      <div v-if="socialLinks.length || $slots.default" class="seneu-footer__bottom-right">
        <a
          v-for="social in socialLinks"
          :key="social.label"
          :href="social.href || '#'"
          class="seneu-footer__social"
          :aria-label="social.label"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SeneuIcon :name="social.icon" :size="18" />
        </a>
        <slot />
      </div>
    </div>

  </footer>
</template>

<style>
/* ── Shell ─────────────────────────────────────────────── */
.seneu-footer {
  border-top: 1px solid var(--color-border-default);
  background-color: var(--color-surface-default);
  font-family: var(--font-sans);
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
}

/* ── Columns: top section ──────────────────────────────── */
.seneu-footer__top {
  display: flex;
  gap: var(--space-layout-section);
  padding: var(--space-layout-section) var(--space-layout-content);
  flex-wrap: wrap;
}
.seneu-footer__brand-col {
  flex: 0 0 200px;
  display: flex;
  flex-direction: column;
  gap: var(--space-stack-tight);
}
.seneu-footer__tagline {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  line-height: var(--line-height-relaxed);
  margin: 0;
  max-width: 200px;
}
.seneu-footer__link-columns {
  flex: 1;
  display: flex;
  gap: var(--space-inline-loose);
  flex-wrap: wrap;
}
.seneu-footer__link-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-stack-tight);
  min-width: 120px;
}
.seneu-footer__col-heading {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  color: var(--color-text-default);
  margin: 0;
}
.seneu-footer__link-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-stack-tight);
}

/* ── Divider ───────────────────────────────────────────── */
.seneu-footer__divider {
  height: 1px;
  background-color: var(--color-border-muted);
  margin: 0 var(--space-layout-content);
}

/* ── Bottom row ────────────────────────────────────────── */
.seneu-footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-inline-normal);
  padding: var(--space-inline-normal) var(--space-layout-content);
  flex-wrap: wrap;
}
.seneu-footer__bottom-left {
  display: flex;
  align-items: center;
  gap: var(--space-inline-normal);
  flex-wrap: wrap;
}
.seneu-footer__bottom-right {
  display: flex;
  align-items: center;
  gap: var(--space-inline-tight);
}

/* ── Brand name ────────────────────────────────────────── */
.seneu-footer__brand-name {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-default);
  font-size: var(--font-size-small);
}

/* ── Nav links (simple variant inline row) ────────────────── */
.seneu-footer__nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-inline-normal);
  flex-wrap: wrap;
}
.seneu-footer__bottom-left .seneu-footer__brand-name + .seneu-footer__nav-links::before {
  content: '\00b7';
  color: var(--color-border-default);
  line-height: 1;
}

/* ── Link ──────────────────────────────────────────────── */
.seneu-footer__link {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color var(--duration-fast) var(--easing-standard);
}
.seneu-footer__link:hover { color: var(--color-text-default); }
.seneu-footer__link:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
  border-radius: var(--radius-subtle);
}

/* ── Social icon links ─────────────────────────────────── */
.seneu-footer__social {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-element);
  color: var(--color-text-muted);
  text-decoration: none;
  transition: background-color var(--duration-fast) var(--easing-standard),
              color var(--duration-fast) var(--easing-standard);
}
.seneu-footer__social:hover { background-color: var(--color-surface-raised-hover); color: var(--color-text-default); }
.seneu-footer__social:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

/* ── Copyright ─────────────────────────────────────────── */
.seneu-footer__copy {
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
}

/* ── Skeleton (loading) ────────────────────────────────── */
.seneu-footer__skeleton {
  display: block;
  width: 100%;
  height: 12px;
  border-radius: var(--radius-subtle);
  background: linear-gradient(
    90deg,
    var(--color-surface-raised-hover) 25%,
    var(--color-surface-raised-active) 50%,
    var(--color-surface-raised-hover) 75%
  );
  background-size: 200% 100%;
  animation: seneu-footer-shimmer 1.5s ease-in-out infinite;
}
.seneu-footer__skeleton--heading { width: 60%; height: 10px; margin-bottom: 4px; }
@keyframes seneu-footer-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Responsive ────────────────────────────────────────── */
@media (max-width: 767px) {
  .seneu-footer__top { flex-direction: column; gap: var(--space-stack-loose); }
  .seneu-footer__bottom { flex-direction: column; align-items: flex-start; }
}
</style>
