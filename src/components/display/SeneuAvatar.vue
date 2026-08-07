<script setup>
import { ref, computed } from 'vue'
import SeneuIcon from './SeneuIcon.vue'
import SeneuSkeleton from './SeneuSkeleton.vue'

/**
 * Person/entity avatar. Falls back from image → initials → a generic
 * person icon, and recovers gracefully if the image fails to load.
 */
const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '',
  },
  /** Used to derive initials and a deterministic background color when there's no image */
  name: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'base',
    validator: v => ['xs', 'sm', 'base', 'lg', 'xl', '2xl'].includes(v),
  },
  shape: {
    type: String,
    default: 'circle',
    validator: v => ['circle', 'square'].includes(v),
  },
  /** Presence indicator dot */
  status: {
    type: String,
    default: '',
    validator: v => ['', 'online', 'away', 'busy', 'offline'].includes(v),
  },
  /** Shows a skeleton placeholder matching the current size/shape */
  loading: {
    type: Boolean,
    default: false,
  },
})

const imgError = ref(false)
const showImage = computed(() => Boolean(props.src) && !imgError.value)

const initials = computed(() => {
  if (!props.name) return ''
  const parts = props.name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
})

/* Deterministic tonal color from name — reuses existing semantic tokens
   instead of a dedicated avatar palette, so it stays theme-consistent. */
const PALETTE = [
  { bg: 'var(--color-surface-brand-subtle)',   text: 'var(--color-text-brand)'   },
  { bg: 'var(--color-surface-success-subtle)', text: 'var(--color-text-success)' },
  { bg: 'var(--color-surface-warning-subtle)', text: 'var(--color-text-warning)' },
  { bg: 'var(--color-surface-danger-subtle)',  text: 'var(--color-text-danger)'  },
  { bg: 'var(--color-surface-info-subtle)',    text: 'var(--color-text-info)'    },
]
const palette = computed(() => {
  if (!props.name) return { bg: 'var(--color-surface-raised-hover)', text: 'var(--color-text-muted)' }
  const index = [...props.name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % PALETTE.length
  return PALETTE[index]
})

const ICON_SIZE = { xs: 12, sm: 16, base: 18, lg: 24, xl: 32, '2xl': 48 }
const iconSize = computed(() => ICON_SIZE[props.size])

const SKELETON_SIZE = { xs: '1.25rem', sm: '1.75rem', base: '2.25rem', lg: '3rem', xl: '4rem', '2xl': '6rem' }
const skeletonSize = computed(() => SKELETON_SIZE[props.size])

const statusLabels = { online: 'Online', away: 'Away', busy: 'Busy', offline: 'Offline' }
const statusLabel = computed(() => statusLabels[props.status] || '')
</script>

<template>
  <SeneuSkeleton
    v-if="loading"
    :variant="shape === 'circle' ? 'circle' : 'rect'"
    :width="skeletonSize"
    :height="skeletonSize"
  />
  <span
    v-else
    class="seneu-avatar"
    :class="[`seneu-avatar--${size}`, `seneu-avatar--${shape}`, { 'seneu-avatar--has-status': status }]"
    :style="showImage ? {} : { '--seneu-avatar-bg': palette.bg, '--seneu-avatar-text': palette.text }"
    :title="name || alt"
    role="img"
    :aria-label="name || alt || 'Avatar'"
  >
    <img
      v-if="showImage"
      class="seneu-avatar__img"
      :src="src"
      :alt="alt || name"
      @error="imgError = true"
    />

    <span v-else-if="initials" class="seneu-avatar__initials" aria-hidden="true">{{ initials }}</span>

    <SeneuIcon v-else name="person" :size="iconSize" class="seneu-avatar__icon" />

    <span
      v-if="status"
      class="seneu-avatar__status"
      :class="`seneu-avatar__status--${status}`"
      :aria-label="statusLabel"
    />
  </span>
</template>

<style>
/* ── Base ──────────────────────────────────────────────── */
.seneu-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--seneu-avatar-bg, var(--color-surface-raised-hover));
  color: var(--seneu-avatar-text, var(--color-text-muted));
  flex-shrink: 0;
  user-select: none;
  font-family: var(--font-sans);
}

/* ── Shapes ────────────────────────────────────────────── */
.seneu-avatar--circle { border-radius: var(--radius-circle); }
.seneu-avatar--square { border-radius: var(--radius-element); }

/* ── Sizes ─────────────────────────────────────────────── */
.seneu-avatar--xs   { width: 1.25rem; height: 1.25rem; font-size: 0.5625rem; }
.seneu-avatar--sm   { width: 1.75rem; height: 1.75rem; font-size: 0.6875rem; }
.seneu-avatar--base { width: 2.25rem; height: 2.25rem; font-size: 0.8125rem; }
.seneu-avatar--lg   { width: 3rem;    height: 3rem;    font-size: 1rem; }
.seneu-avatar--xl   { width: 4rem;    height: 4rem;    font-size: 1.375rem; }
.seneu-avatar--2xl  { width: 6rem;    height: 6rem;    font-size: 2rem; }

/* ── Image ─────────────────────────────────────────────── */
.seneu-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: inherit;
}

/* ── Initials / icon fallback ─────────────────────────────── */
.seneu-avatar__initials {
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  letter-spacing: var(--letter-spacing-normal);
}
.seneu-avatar__icon { color: inherit; }

/* ── Status dot ────────────────────────────────────────── */
.seneu-avatar__status {
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: var(--radius-circle);
  border: 2px solid var(--color-surface-raised);
}
.seneu-avatar--xs  .seneu-avatar__status { width: 0.375rem; height: 0.375rem; border-width: 1px; }
.seneu-avatar--sm  .seneu-avatar__status { width: 0.5rem;   height: 0.5rem;   border-width: 1.5px; }
.seneu-avatar--base .seneu-avatar__status { width: 0.625rem; height: 0.625rem; }
.seneu-avatar--lg  .seneu-avatar__status { width: 0.75rem;  height: 0.75rem;  border-width: 2.5px; }
.seneu-avatar--xl  .seneu-avatar__status { width: 0.875rem; height: 0.875rem; border-width: 3px; }
.seneu-avatar--2xl .seneu-avatar__status { width: 1.125rem; height: 1.125rem; border-width: 3px; }

.seneu-avatar__status--online  { background-color: var(--color-surface-success); }
.seneu-avatar__status--away    { background-color: var(--color-surface-warning); }
.seneu-avatar__status--busy    { background-color: var(--color-surface-danger); }
.seneu-avatar__status--offline { background-color: var(--color-text-disabled); }
</style>
