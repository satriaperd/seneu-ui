<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useTheme } from '../../composables/useTheme.js'
import SeneuSkeleton from './SeneuSkeleton.vue'
import SeneuEmptyState from './SeneuEmptyState.vue'

/**
 * Chrome (title/subtitle/actions) plus the full lifecycle around an
 * Apache ECharts instance — init, resize, light/dark re-theming, and
 * disposal. `echarts` is an optional peer dependency: if it isn't
 * installed, this shows a helpful notice instead of crashing.
 * Pass a plain ECharts `option` object; consumer keys are merged on
 * top of token-derived defaults (chart palette, text/axis colors).
 */
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  height: {
    type: String,
    default: '320px',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  /** ECharts option object — omit to show the empty state */
  option: {
    type: Object,
    default: null,
  },
  emptyTitle: {
    type: String,
    default: 'Nothing to chart yet',
  },
  emptyDescription: {
    type: String,
    default: 'Once there is data, a chart will show up here.',
  },
  /** Accessible label for the chart canvas — falls back to `title` */
  ariaLabel: {
    type: String,
    default: '',
  },
})

const { isDark } = useTheme()
const containerRef = ref(null)
const dependencyMissing = ref(false)
let chart = null
let resizeObserver = null
let isUnmounted = false

let sharedEchartsPromise = null
function loadEcharts() {
  if (!sharedEchartsPromise) {
    sharedEchartsPromise = import('echarts').catch(() => null)
  }
  return sharedEchartsPromise
}

function tokenColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function buildMergedOption() {
  const base = {
    color: [
      tokenColor('--color-chart-1'),
      tokenColor('--color-chart-2'),
      tokenColor('--color-chart-3'),
      tokenColor('--color-chart-4'),
    ],
    backgroundColor: 'transparent',
    textStyle: { color: tokenColor('--color-text-muted'), fontFamily: 'inherit' },
  }
  return { ...base, ...props.option }
}

function renderChart() {
  if (!chart || !props.option) return
  chart.setOption(buildMergedOption(), true)
}

async function initChart() {
  if (!props.option || chart) return
  const echarts = await loadEcharts()
  if (isUnmounted) return
  if (!echarts) {
    dependencyMissing.value = true
    return
  }
  dependencyMissing.value = false
  if (!containerRef.value) return

  chart = echarts.init(containerRef.value)
  renderChart()

  resizeObserver = new ResizeObserver(() => chart?.resize())
  resizeObserver.observe(containerRef.value)
}

function disposeChart() {
  resizeObserver?.disconnect()
  resizeObserver = null
  chart?.dispose()
  chart = null
}

onMounted(() => { if (props.option) initChart() })
onBeforeUnmount(() => {
  isUnmounted = true
  disposeChart()
})

watch(() => props.option, (next) => {
  if (!next) {
    disposeChart()
    return
  }
  if (!chart) initChart()
  else renderChart()
}, { deep: true })

watch(isDark, () => renderChart())
</script>

<template>
  <div class="seneu-chartwrap">
    <div class="seneu-chartwrap__header">
      <div class="seneu-chartwrap__titles">
        <span v-if="title" class="seneu-chartwrap__title">{{ title }}</span>
        <span v-if="subtitle" class="seneu-chartwrap__subtitle">{{ subtitle }}</span>
      </div>
      <div v-if="$slots.actions" class="seneu-chartwrap__actions">
        <slot name="actions" />
      </div>
    </div>

    <div v-if="title || subtitle || $slots.actions" class="seneu-chartwrap__divider" />

    <div class="seneu-chartwrap__body" :style="{ height }">
      <div
        ref="containerRef"
        class="seneu-chartwrap__canvas"
        role="img"
        :aria-label="ariaLabel || title || 'Chart'"
      />

      <div v-if="loading" class="seneu-chartwrap__overlay" aria-hidden="true">
        <SeneuSkeleton variant="rect" width="100%" height="100%" :animated="true" />
      </div>
      <div v-else-if="dependencyMissing" class="seneu-chartwrap__overlay">
        <SeneuEmptyState
          size="sm"
          icon="error_outline"
          title="echarts isn't installed"
          description="Run npm install echarts to render this chart."
        />
      </div>
      <div v-else-if="!option" class="seneu-chartwrap__overlay">
        <SeneuEmptyState size="sm" icon="bar_chart" :title="emptyTitle" :description="emptyDescription" />
      </div>
    </div>
  </div>
</template>

<style>
/* ── Wrapper ───────────────────────────────────────────── */
.seneu-chartwrap {
  background-color: var(--color-surface-raised);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-container);
  overflow: hidden;
  font-family: var(--font-sans);
}

/* ── Header ────────────────────────────────────────────── */
.seneu-chartwrap__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-inline-normal);
  padding: var(--space-inline-normal);
}
.seneu-chartwrap__titles {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.seneu-chartwrap__title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-default);
  line-height: var(--line-height-tight);
}
.seneu-chartwrap__subtitle {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
}
.seneu-chartwrap__actions {
  display: flex;
  align-items: center;
  gap: var(--space-inline-tight);
  flex-shrink: 0;
}
.seneu-chartwrap__divider {
  height: 1px;
  background-color: var(--color-border-default);
}

/* ── Body ──────────────────────────────────────────────── */
.seneu-chartwrap__body {
  position: relative;
  padding: var(--space-inline-tight);
  box-sizing: content-box;
}
.seneu-chartwrap__canvas {
  width: 100%;
  height: 100%;
}

/* ── Overlays (loading / empty / missing dependency) ──── */
.seneu-chartwrap__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-surface-raised);
}
</style>
