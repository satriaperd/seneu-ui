<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import SeneuIcon from '../display/SeneuIcon.vue'

/**
 * Slide carousel with arrow/dot/keyboard/swipe navigation. Autoplay pauses
 * automatically on hover or keyboard focus and exposes a play/pause toggle
 * (WCAG 2.2.2 Pause, Stop, Hide) so auto-advancing content stays under
 * user control.
 */
const props = defineProps({
  /** Current slide index (0-based). Use with v-model. */
  modelValue: {
    type: Number,
    default: 0,
  },
  /** Array of { title, subtitle?, badge?, color?: 'brand' } for default slot rendering */
  slides: {
    type: Array,
    default: () => [],
  },
  /** slide: translate track. fade: cross-fade between slides. */
  variant: {
    type: String,
    default: 'slide',
    validator: v => ['slide', 'fade'].includes(v),
  },
  size: {
    type: String,
    default: 'base',
    validator: v => ['sm', 'base', 'lg'].includes(v),
  },
  showArrows: {
    type: Boolean,
    default: true,
  },
  showDots: {
    type: Boolean,
    default: true,
  },
  /** Shows "current / total" counter instead of (or alongside) dots */
  showCounter: {
    type: Boolean,
    default: false,
  },
  /** Wrap around from last to first and vice versa */
  loop: {
    type: Boolean,
    default: true,
  },
  autoplay: {
    type: Boolean,
    default: false,
  },
  /** Milliseconds between auto-advances */
  interval: {
    type: Number,
    default: 4000,
  },
  /** Shows a play/pause toggle when autoplay is enabled */
  showPlayToggle: {
    type: Boolean,
    default: true,
  },
  /** Shows shimmer placeholder instead of slides */
  loading: {
    type: Boolean,
    default: false,
  },
  ariaLabel: {
    type: String,
    default: 'Content carousel',
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const arrowIconSize = computed(() => ({ sm: 16, base: 20, lg: 24 }[props.size]))

const activeIndex = ref(props.modelValue)
watch(() => props.modelValue, v => { activeIndex.value = v })

function goTo(i) {
  const from = activeIndex.value
  if (from === i) return
  activeIndex.value = i
  emit('change', { from, to: i })
  emit('update:modelValue', i)
}

function prev() {
  if (props.loop) {
    goTo(activeIndex.value === 0 ? props.slides.length - 1 : activeIndex.value - 1)
  } else if (activeIndex.value > 0) {
    goTo(activeIndex.value - 1)
  }
}

function next() {
  if (props.loop) {
    goTo(activeIndex.value === props.slides.length - 1 ? 0 : activeIndex.value + 1)
  } else if (activeIndex.value < props.slides.length - 1) {
    goTo(activeIndex.value + 1)
  }
}

// ─── Autoplay — pauses on hover/focus and exposes a manual toggle ──────────
const userPaused = ref(false)
const hovering = ref(false)
const focused = ref(false)
let timer = null

const isPlaying = computed(() => props.autoplay && !userPaused.value && !hovering.value && !focused.value)

function startAutoplay() {
  stopAutoplay()
  if (isPlaying.value) timer = setInterval(next, props.interval)
}
function stopAutoplay() {
  if (timer) { clearInterval(timer); timer = null }
}
function togglePlay() {
  userPaused.value = !userPaused.value
}

watch(isPlaying, playing => { if (playing) startAutoplay(); else stopAutoplay() })
watch(() => props.autoplay, val => { if (!val) userPaused.value = false })
onMounted(() => { if (isPlaying.value) startAutoplay() })
onUnmounted(stopAutoplay)

function onMouseEnter() { hovering.value = true }
function onMouseLeave() { hovering.value = false }
function onFocusIn() { focused.value = true }
function onFocusOut() { focused.value = false }

// ─── Touch swipe ────────────────────────────────────────────────────────
let touchStartX = 0
let touchDeltaX = 0
const SWIPE_THRESHOLD = 40

function onTouchStart(e) {
  touchStartX = e.touches[0].clientX
  touchDeltaX = 0
}
function onTouchMove(e) {
  touchDeltaX = e.touches[0].clientX - touchStartX
}
function onTouchEnd() {
  if (touchDeltaX > SWIPE_THRESHOLD) prev()
  else if (touchDeltaX < -SWIPE_THRESHOLD) next()
  touchDeltaX = 0
}
</script>

<template>
  <div
    class="seneu-carousel"
    :class="[`seneu-carousel--${variant}`, `seneu-carousel--${size}`, { 'seneu-carousel--with-arrows': showArrows }]"
    role="region"
    :aria-label="ariaLabel"
    :tabindex="slides.length ? 0 : undefined"
    @keydown.left.prevent="prev"
    @keydown.right.prevent="next"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <div v-if="loading" class="seneu-carousel__skeleton" aria-hidden="true" />

    <div v-else-if="!slides.length" class="seneu-carousel__empty">
      <SeneuIcon name="image" :size="28" class="seneu-carousel__empty-icon" />
      <span class="seneu-carousel__empty-text">No slides to show</span>
    </div>

    <template v-else>
      <div class="seneu-carousel__inner">
        <div
          class="seneu-carousel__viewport"
          @touchstart.passive="onTouchStart"
          @touchmove.passive="onTouchMove"
          @touchend="onTouchEnd"
        >
          <div
            class="seneu-carousel__track"
            :style="variant === 'slide' ? { transform: `translateX(-${activeIndex * 100}%)` } : {}"
          >
            <div
              v-for="(slide, i) in slides"
              :key="i"
              class="seneu-carousel__slide"
              :class="{ 'seneu-carousel__slide--active': i === activeIndex }"
              role="group"
              :aria-label="`Slide ${i + 1} of ${slides.length}`"
              :aria-hidden="i !== activeIndex ? 'true' : undefined"
            >
              <slot :name="`slide-${i}`" :slide="slide" :index="i">
                <div class="seneu-carousel__card" :class="slide.color ? `seneu-carousel__card--${slide.color}` : ''">
                  <span v-if="slide.badge" class="seneu-carousel__badge">{{ slide.badge }}</span>
                  <p class="seneu-carousel__card-title">{{ slide.title }}</p>
                  <p v-if="slide.subtitle" class="seneu-carousel__card-sub">{{ slide.subtitle }}</p>
                </div>
              </slot>
            </div>
          </div>
        </div>

        <button
          v-if="showArrows"
          type="button"
          class="seneu-carousel__arrow seneu-carousel__arrow--prev"
          :disabled="!loop && activeIndex === 0"
          aria-label="Previous slide"
          @click="prev"
        >
          <SeneuIcon name="chevron_left" :size="arrowIconSize" />
        </button>
        <button
          v-if="showArrows"
          type="button"
          class="seneu-carousel__arrow seneu-carousel__arrow--next"
          :disabled="!loop && activeIndex === slides.length - 1"
          aria-label="Next slide"
          @click="next"
        >
          <SeneuIcon name="chevron_right" :size="arrowIconSize" />
        </button>
      </div>

      <div v-if="showDots || showCounter || (autoplay && showPlayToggle)" class="seneu-carousel__footer">
        <button
          v-if="autoplay && showPlayToggle"
          type="button"
          class="seneu-carousel__play-toggle"
          :aria-label="userPaused ? 'Play autoplay' : 'Pause autoplay'"
          @click="togglePlay"
        >
          <SeneuIcon :name="userPaused ? 'play_arrow' : 'pause'" :size="16" />
        </button>

        <div v-if="showDots" class="seneu-carousel__dots">
          <button
            v-for="(_, i) in slides"
            :key="i"
            type="button"
            class="seneu-carousel__dot"
            :class="{ 'seneu-carousel__dot--active': i === activeIndex }"
            :aria-label="`Go to slide ${i + 1}`"
            :aria-current="i === activeIndex ? 'true' : undefined"
            @click="goTo(i)"
          />
        </div>

        <span v-if="showCounter" class="seneu-carousel__counter" aria-live="polite">
          {{ activeIndex + 1 }} / {{ slides.length }}
        </span>
      </div>
    </template>
  </div>
</template>

<style>
/* ── Shell ─────────────────────────────────────────────── */
.seneu-carousel { display: flex; flex-direction: column; outline: none; font-family: var(--font-sans); }
.seneu-carousel:focus-visible .seneu-carousel__viewport {
  box-shadow: 0 0 0 3px var(--color-border-focus);
}

.seneu-carousel__inner { position: relative; }
.seneu-carousel__viewport { overflow: hidden; border-radius: var(--radius-container); touch-action: pan-y; }

/* ── Slide variant ─────────────────────────────────────── */
.seneu-carousel--slide .seneu-carousel__track {
  display: flex;
  transition: transform var(--duration-slow) var(--easing-standard);
}
.seneu-carousel--slide .seneu-carousel__slide { flex-shrink: 0; width: 100%; }

/* ── Fade variant ──────────────────────────────────────── */
.seneu-carousel--fade .seneu-carousel__track { position: relative; min-height: 200px; }
.seneu-carousel--sm.seneu-carousel--fade .seneu-carousel__track { min-height: 140px; }
.seneu-carousel--lg.seneu-carousel--fade .seneu-carousel__track { min-height: 280px; }
.seneu-carousel--fade .seneu-carousel__slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity var(--duration-slow) var(--easing-standard);
  pointer-events: none;
}
.seneu-carousel--fade .seneu-carousel__slide--active { opacity: 1; pointer-events: auto; }

/* ── Default card rendering ────────────────────────────── */
.seneu-carousel__card {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 6px;
  padding: var(--space-layout-content);
  min-height: 200px;
  background-color: var(--color-surface-raised);
  border: 1px solid var(--color-border-default);
  user-select: none;
}
.seneu-carousel--sm .seneu-carousel__card { min-height: 140px; padding: var(--space-inline-normal); }
.seneu-carousel--lg .seneu-carousel__card { min-height: 280px; padding: var(--space-layout-section); }

/* Extra inline padding so the default card's text never sits under the arrow buttons */
.seneu-carousel--with-arrows .seneu-carousel__card { padding-inline: 56px; }
.seneu-carousel--with-arrows.seneu-carousel--sm .seneu-carousel__card { padding-inline: 48px; }
.seneu-carousel--with-arrows.seneu-carousel--lg .seneu-carousel__card { padding-inline: 64px; }

.seneu-carousel__card--brand { background-color: var(--color-surface-brand); border-color: var(--color-surface-brand); }
.seneu-carousel__card--brand .seneu-carousel__card-title { color: var(--color-text-on-brand); }
.seneu-carousel__card--brand .seneu-carousel__card-sub { color: var(--color-text-on-brand); opacity: var(--opacity-high); }
.seneu-carousel__card--brand .seneu-carousel__badge {
  background-color: rgba(255, 255, 255, 0.2);
  color: var(--color-text-on-brand);
  border-color: transparent;
}

.seneu-carousel__badge {
  align-self: flex-start;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  background-color: var(--color-surface-brand-subtle);
  color: var(--color-text-brand);
  border: 1px solid var(--color-border-brand);
  border-radius: var(--radius-pill);
  padding: 2px 8px;
  margin-bottom: 4px;
}
.seneu-carousel__card-title {
  font-size: var(--font-size-heading-4);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-default);
  line-height: var(--line-height-tight);
  margin: 0;
}
.seneu-carousel__card-sub { font-size: var(--font-size-body); color: var(--color-text-muted); margin: 0; }

/* ── Arrows ────────────────────────────────────────────── */
.seneu-carousel__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: var(--z-index-raised);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-circle);
  border: 1px solid var(--color-border-default);
  background-color: var(--color-surface-raised);
  color: var(--color-text-muted);
  cursor: pointer;
  box-shadow: var(--elevation-raised);
  transition: background-color var(--duration-fast) var(--easing-standard),
              color var(--duration-fast) var(--easing-standard);
}
.seneu-carousel__arrow:hover:not(:disabled) { background-color: var(--color-surface-raised-hover); color: var(--color-text-default); }
.seneu-carousel__arrow:disabled { opacity: var(--opacity-disabled); cursor: not-allowed; }
.seneu-carousel__arrow:focus-visible { outline: 2px solid var(--color-border-focus); outline-offset: 2px; }
.seneu-carousel__arrow--prev { left: 12px; }
.seneu-carousel__arrow--next { right: 12px; }

.seneu-carousel--sm .seneu-carousel__arrow { width: 28px; height: 28px; }
.seneu-carousel--lg .seneu-carousel__arrow { width: 44px; height: 44px; }

/* ── Footer ────────────────────────────────────────────── */
.seneu-carousel__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-inline-normal);
  padding-top: var(--space-inline-normal);
}

/* ── Play/pause toggle ─────────────────────────────────── */
.seneu-carousel__play-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-circle);
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--easing-standard), color var(--duration-fast) var(--easing-standard);
}
.seneu-carousel__play-toggle:hover { background-color: var(--color-surface-raised-hover); color: var(--color-text-default); }
.seneu-carousel__play-toggle:focus-visible { outline: 2px solid var(--color-border-focus); outline-offset: 2px; }

/* ── Dots ──────────────────────────────────────────────── */
.seneu-carousel__dots { display: flex; align-items: center; gap: 6px; }
.seneu-carousel__dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-pill);
  background-color: var(--color-border-default);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: width var(--duration-fast) var(--easing-standard), background-color var(--duration-fast) var(--easing-standard);
}
.seneu-carousel__dot--active { width: 24px; background-color: var(--color-surface-brand); }
.seneu-carousel__dot:hover:not(.seneu-carousel__dot--active) { background-color: var(--color-border-interactive); }
.seneu-carousel__dot:focus-visible { outline: 2px solid var(--color-border-focus); outline-offset: 2px; }

/* ── Counter ───────────────────────────────────────────── */
.seneu-carousel__counter { font-size: var(--font-size-xs); font-weight: var(--font-weight-medium); color: var(--color-text-muted); }

/* ── Empty state ───────────────────────────────────────── */
.seneu-carousel__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-stack-tight);
  min-height: 200px;
  border-radius: var(--radius-container);
  border: 1px dashed var(--color-border-default);
  color: var(--color-text-muted);
}
.seneu-carousel__empty-icon { color: var(--color-text-disabled); }
.seneu-carousel__empty-text { font-size: var(--font-size-small); }

/* ── Skeleton (loading) ────────────────────────────────── */
.seneu-carousel__skeleton {
  min-height: 200px;
  border-radius: var(--radius-container);
  background: linear-gradient(
    90deg,
    var(--color-surface-raised-hover) 25%,
    var(--color-surface-raised-active) 50%,
    var(--color-surface-raised-hover) 75%
  );
  background-size: 200% 100%;
  animation: seneu-carousel-shimmer 1.5s ease-in-out infinite;
}
.seneu-carousel--sm .seneu-carousel__skeleton { min-height: 140px; }
.seneu-carousel--lg .seneu-carousel__skeleton { min-height: 280px; }
@keyframes seneu-carousel-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
