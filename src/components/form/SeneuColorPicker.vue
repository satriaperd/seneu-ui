<script setup>
import { reactive, ref, computed, watch, onMounted, onUnmounted, nextTick, useId } from 'vue'
import SeneuIcon from '../display/SeneuIcon.vue'

/**
 * Color picker with a saturation/value square, a hue slider, and
 * switchable HEX/RGB/HSL/HSV text inputs. The `format` prop controls
 * what string shape `modelValue` is read from and emitted as — the
 * in-popover format tabs are just a display/input convenience and
 * don't affect it.
 */
const props = defineProps({
  /** Bound color — string shape depends on `format` */
  modelValue: { type: String, default: '' },
  /** Format modelValue is parsed from / emitted as */
  format: {
    type: String,
    default: 'hex',
    validator: v => ['hex', 'rgb', 'hsl', 'hsv'].includes(v),
  },
  /** Label shown above the field */
  label: { type: String, default: '' },
  /** Helper text shown below the field */
  hint: { type: String, default: '' },
  /** Error message — sets error state when non-empty */
  error: { type: String, default: '' },
  /** Disables the field entirely */
  disabled: { type: Boolean, default: false },
  /** Shows a spinner instead of the chevron — for async validation */
  loading: { type: Boolean, default: false },
  /** Shows the × button to clear a set value */
  clearable: { type: Boolean, default: false },
  /** Optional quick-pick swatches — array of any parseable color string */
  presets: { type: Array, default: () => [] },
  /** Controls padding and font-size */
  size: {
    type: String,
    default: 'base',
    validator: v => ['sm', 'base', 'lg'].includes(v),
  },
  /** Explicit id — auto-generated when omitted */
  id: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'change', 'open', 'close', 'clear'])

const _uid = useId()
const fieldId = computed(() => props.id || _uid)

const iconSize = computed(() => ({ sm: 16, base: 18, lg: 20 }[props.size]))

// ── Color math ──────────────────────────────────────────────────────
function clamp(n, min, max) { return Math.min(max, Math.max(min, n)) }

function hsvToRgb(h, s, v) {
  s /= 100; v /= 100
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c
  let r, g, b
  if (h < 60)        { r = c; g = x; b = 0 }
  else if (h < 120)  { r = x; g = c; b = 0 }
  else if (h < 180)  { r = 0; g = c; b = x }
  else if (h < 240)  { r = 0; g = x; b = c }
  else if (h < 300)  { r = x; g = 0; b = c }
  else               { r = c; g = 0; b = x }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  const s = max === 0 ? 0 : (d / max) * 100
  return { h: Math.round(h), s: Math.round(s), v: Math.round(max * 100) }
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
  const l = (max + min) / 2
  let h = 0
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb(h, s, l) {
  s /= 100; l /= 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r, g, b
  if (h < 60)        { r = c; g = x; b = 0 }
  else if (h < 120)  { r = x; g = c; b = 0 }
  else if (h < 180)  { r = 0; g = c; b = x }
  else if (h < 240)  { r = 0; g = x; b = c }
  else if (h < 300)  { r = x; g = 0; b = c }
  else               { r = c; g = 0; b = x }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => clamp(Math.round(x), 0, 255).toString(16).padStart(2, '0')).join('').toUpperCase()
}

function hexToRgb(hex) {
  let h = String(hex).trim().replace('#', '')
  if (h.length === 3) h = h.split('').map(c => c + c).join('')
  if (!/^[0-9a-f]{6}$/i.test(h)) return null
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) }
}

function parseColorString(str) {
  if (!str || typeof str !== 'string') return null
  const s = str.trim()
  if (s.startsWith('#')) return hexToRgb(s)
  let m = s.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i)
  if (m) return { r: clamp(+m[1], 0, 255), g: clamp(+m[2], 0, 255), b: clamp(+m[3], 0, 255) }
  m = s.match(/^hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%/i)
  if (m) return hslToRgb(clamp(+m[1], 0, 360), clamp(+m[2], 0, 100), clamp(+m[3], 0, 100))
  m = s.match(/^hsva?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%/i)
  if (m) return hsvToRgb(clamp(+m[1], 0, 360), clamp(+m[2], 0, 100), clamp(+m[3], 0, 100))
  if (/^[0-9a-f]{6}$/i.test(s)) return hexToRgb('#' + s)
  return null
}

function formatColor(rgb, format) {
  if (format === 'rgb') return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  if (format === 'hsl') { const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b); return `hsl(${h}, ${s}%, ${l}%)` }
  if (format === 'hsv') { const { h, s, v } = rgbToHsv(rgb.r, rgb.g, rgb.b); return `hsv(${h}, ${s}%, ${v}%)` }
  return rgbToHex(rgb.r, rgb.g, rgb.b)
}

const DEFAULT_RGB = { r: 252, g: 122, b: 30 } // brand orange-500, used only as the picker's starting point

// ── Internal state ────────────────────────────────────────────────────
// hsv drives the picker's controls (slider positions, HSL/HSV tab
// display) and is always integer-rounded. Converting through it is
// lossy — hsvToRgb(rgbToHsv(rgb)) can land ±1 off the original channel
// values — so `originalRgb` holds the exact color whenever nothing has
// actually gone through HSV math yet (fresh from modelValue, a preset,
// or a typed hex/RGB value). currentRgb prefers it until an SV-square
// drag, hue-slider drag, or typed HSL/HSV value makes HSV space itself
// the source of truth, at which point it's cleared.
const hsv = reactive({ ...rgbToHsv(DEFAULT_RGB.r, DEFAULT_RGB.g, DEFAULT_RGB.b) })
const originalRgb = ref({ ...DEFAULT_RGB })

function setExactRgb(rgb) {
  originalRgb.value = rgb
  Object.assign(hsv, rgbToHsv(rgb.r, rgb.g, rgb.b))
}
function enterHsvSpace() { originalRgb.value = null }

let suppressNextWatch = false
watch(() => props.modelValue, val => {
  if (suppressNextWatch) { suppressNextWatch = false; return }
  const rgb = parseColorString(val)
  if (!rgb) return
  setExactRgb(rgb)
}, { immediate: true })

const currentRgb = computed(() => originalRgb.value ?? hsvToRgb(hsv.h, hsv.s, hsv.v))
const currentHex = computed(() => rgbToHex(currentRgb.value.r, currentRgb.value.g, currentRgb.value.b))
const displayValue = computed(() => props.modelValue || formatColor(currentRgb.value, props.format))

function emitChange() {
  const formatted = formatColor(currentRgb.value, props.format)
  suppressNextWatch = true
  emit('update:modelValue', formatted)
  emit('change', formatted)
}

// ── Open / close ──────────────────────────────────────────────────────
const rootRef    = ref(null)
const triggerRef = ref(null)
const isOpen     = ref(false)

function open() {
  if (props.disabled || props.loading || isOpen.value) return
  isOpen.value = true
  emit('open')
}
function close(refocus = false) {
  if (!isOpen.value) return
  isOpen.value = false
  emit('close')
  if (refocus) nextTick(() => triggerRef.value?.focus())
}
function toggle() { isOpen.value ? close() : open() }

function handleOutside(e) {
  if (rootRef.value && !rootRef.value.contains(e.target)) close()
}
function handleEscape(e) {
  if (e.key === 'Escape' && isOpen.value) { e.stopPropagation(); close(true) }
}
onMounted(() => {
  document.addEventListener('pointerdown', handleOutside)
  document.addEventListener('keydown', handleEscape)
})
onUnmounted(() => {
  document.removeEventListener('pointerdown', handleOutside)
  document.removeEventListener('keydown', handleEscape)
})

function clearValue() {
  suppressNextWatch = true
  emit('update:modelValue', '')
  emit('clear')
}

// ── Saturation/Value square ──────────────────────────────────────────
const svRef = ref(null)

function updateSvFromEvent(e) {
  const rect = svRef.value.getBoundingClientRect()
  const x = clamp(e.clientX - rect.left, 0, rect.width)
  const y = clamp(e.clientY - rect.top, 0, rect.height)
  enterHsvSpace()
  hsv.s = Math.round((x / rect.width) * 100)
  hsv.v = Math.round(100 - (y / rect.height) * 100)
  emitChange()
}
function startSvDrag(e) {
  if (props.disabled) return
  e.preventDefault()
  svRef.value.focus()
  svRef.value.setPointerCapture(e.pointerId)
  updateSvFromEvent(e)
  const onMove = ev => updateSvFromEvent(ev)
  const onUp = () => {
    svRef.value.removeEventListener('pointermove', onMove)
    svRef.value.removeEventListener('pointerup', onUp)
  }
  svRef.value.addEventListener('pointermove', onMove)
  svRef.value.addEventListener('pointerup', onUp)
}
function onSvKeydown(e) {
  const step = e.shiftKey ? 10 : 1
  if (e.key === 'ArrowRight')      { enterHsvSpace(); hsv.s = clamp(hsv.s + step, 0, 100); emitChange(); e.preventDefault() }
  else if (e.key === 'ArrowLeft')  { enterHsvSpace(); hsv.s = clamp(hsv.s - step, 0, 100); emitChange(); e.preventDefault() }
  else if (e.key === 'ArrowUp')    { enterHsvSpace(); hsv.v = clamp(hsv.v + step, 0, 100); emitChange(); e.preventDefault() }
  else if (e.key === 'ArrowDown')  { enterHsvSpace(); hsv.v = clamp(hsv.v - step, 0, 100); emitChange(); e.preventDefault() }
}
const svThumbStyle = computed(() => ({ left: `${hsv.s}%`, top: `${100 - hsv.v}%`, background: currentHex.value }))
const svBackgroundHue = computed(() => `hsl(${hsv.h}, 100%, 50%)`)

// ── Hue slider ────────────────────────────────────────────────────────
const hueRef = ref(null)

function updateHueFromEvent(e) {
  const rect = hueRef.value.getBoundingClientRect()
  const x = clamp(e.clientX - rect.left, 0, rect.width)
  enterHsvSpace()
  hsv.h = Math.min(359, Math.round((x / rect.width) * 360))
  emitChange()
}
function startHueDrag(e) {
  if (props.disabled) return
  e.preventDefault()
  hueRef.value.focus()
  hueRef.value.setPointerCapture(e.pointerId)
  updateHueFromEvent(e)
  const onMove = ev => updateHueFromEvent(ev)
  const onUp = () => {
    hueRef.value.removeEventListener('pointermove', onMove)
    hueRef.value.removeEventListener('pointerup', onUp)
  }
  hueRef.value.addEventListener('pointermove', onMove)
  hueRef.value.addEventListener('pointerup', onUp)
}
function onHueKeydown(e) {
  const step = e.shiftKey ? 10 : 1
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp')        { enterHsvSpace(); hsv.h = (hsv.h + step) % 360; emitChange(); e.preventDefault() }
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown')  { enterHsvSpace(); hsv.h = (hsv.h - step + 360) % 360; emitChange(); e.preventDefault() }
  else if (e.key === 'Home') { enterHsvSpace(); hsv.h = 0; emitChange(); e.preventDefault() }
  else if (e.key === 'End')  { enterHsvSpace(); hsv.h = 359; emitChange(); e.preventDefault() }
}
const hueThumbStyle = computed(() => ({ left: `${(hsv.h / 360) * 100}%` }))

// ── Format tabs + text inputs ───────────────────────────────────────
const FORMATS = ['hex', 'rgb', 'hsl', 'hsv']
const activeFormat = ref(props.format)

const hexText = ref(currentHex.value)
watch(currentHex, val => { if (activeFormat.value !== 'hex' || !hexFocused.value) hexText.value = val })
const hexFocused = ref(false)
function commitHex() {
  const rgb = hexToRgb(hexText.value)
  if (rgb) { setExactRgb(rgb); emitChange() }
  else { hexText.value = currentHex.value }
}

const rgbInputs = reactive({ r: currentRgb.value.r, g: currentRgb.value.g, b: currentRgb.value.b })
watch(currentRgb, val => { Object.assign(rgbInputs, val) })
function commitRgb() {
  rgbInputs.r = clamp(Math.round(rgbInputs.r || 0), 0, 255)
  rgbInputs.g = clamp(Math.round(rgbInputs.g || 0), 0, 255)
  rgbInputs.b = clamp(Math.round(rgbInputs.b || 0), 0, 255)
  setExactRgb({ r: rgbInputs.r, g: rgbInputs.g, b: rgbInputs.b })
  emitChange()
}

const hslDisplay = computed(() => rgbToHsl(currentRgb.value.r, currentRgb.value.g, currentRgb.value.b))
const hslInputs = reactive({ h: hslDisplay.value.h, s: hslDisplay.value.s, l: hslDisplay.value.l })
watch(hslDisplay, val => { Object.assign(hslInputs, val) })
function commitHsl() {
  hslInputs.h = clamp(Math.round(hslInputs.h || 0), 0, 360)
  hslInputs.s = clamp(Math.round(hslInputs.s || 0), 0, 100)
  hslInputs.l = clamp(Math.round(hslInputs.l || 0), 0, 100)
  const rgb = hslToRgb(hslInputs.h, hslInputs.s, hslInputs.l)
  enterHsvSpace()
  Object.assign(hsv, rgbToHsv(rgb.r, rgb.g, rgb.b))
  emitChange()
}

const hsvInputs = reactive({ h: hsv.h, s: hsv.s, v: hsv.v })
watch(hsv, val => { Object.assign(hsvInputs, val) }, { deep: true })
function commitHsv() {
  hsvInputs.h = clamp(Math.round(hsvInputs.h || 0), 0, 360)
  hsvInputs.s = clamp(Math.round(hsvInputs.s || 0), 0, 100)
  hsvInputs.v = clamp(Math.round(hsvInputs.v || 0), 0, 100)
  enterHsvSpace()
  Object.assign(hsv, { h: hsvInputs.h, s: hsvInputs.s, v: hsvInputs.v })
  emitChange()
}

function selectPreset(preset) {
  const rgb = parseColorString(preset)
  if (!rgb) return
  setExactRgb(rgb)
  emitChange()
}
</script>

<template>
  <div
    ref="rootRef"
    class="seneu-colorpicker"
    :class="[
      `seneu-colorpicker--${size}`,
      {
        'seneu-colorpicker--error':    !!error,
        'seneu-colorpicker--disabled': disabled,
      },
    ]"
  >
    <label v-if="label" :for="fieldId" class="seneu-colorpicker__label">{{ label }}</label>

    <div class="seneu-colorpicker__row">
      <button
        :id="fieldId"
        ref="triggerRef"
        type="button"
        class="seneu-colorpicker__trigger"
        :disabled="disabled || loading"
        aria-haspopup="dialog"
        :aria-expanded="isOpen"
        :aria-describedby="(hint || error) ? `${fieldId}-desc` : undefined"
        :aria-invalid="error ? 'true' : undefined"
        @click="toggle"
      >
        <span class="seneu-colorpicker__swatch" :class="{ 'seneu-colorpicker__swatch--empty': !modelValue }" :style="modelValue ? { background: currentHex } : {}" />
        <span class="seneu-colorpicker__trigger-text">{{ modelValue ? displayValue : 'Pilih warna' }}</span>
        <SeneuIcon v-if="loading" name="progress_activity" :size="iconSize" class="seneu-colorpicker__spinner" aria-hidden="true" />
        <SeneuIcon v-else name="expand_more" :size="iconSize" aria-hidden="true" />
      </button>

      <button
        v-if="clearable && modelValue"
        type="button"
        class="seneu-colorpicker__clear-btn"
        aria-label="Hapus warna"
        @click="clearValue"
      >
        <SeneuIcon name="close" :size="iconSize" aria-hidden="true" />
      </button>

      <Transition name="seneu-colorpicker-pop">
        <div v-if="isOpen" class="seneu-colorpicker__popover" role="dialog" aria-label="Pilih warna">
          <div
            ref="svRef"
            class="seneu-colorpicker__sv"
            :style="{ backgroundColor: svBackgroundHue }"
            tabindex="0"
            role="slider"
            aria-label="Saturation dan brightness"
            :aria-valuetext="`saturation ${hsv.s}%, brightness ${hsv.v}%`"
            @pointerdown="startSvDrag"
            @keydown="onSvKeydown"
          >
            <div class="seneu-colorpicker__sv-white" />
            <div class="seneu-colorpicker__sv-black" />
            <div class="seneu-colorpicker__sv-thumb" :style="svThumbStyle" />
          </div>

          <div
            ref="hueRef"
            class="seneu-colorpicker__hue"
            tabindex="0"
            role="slider"
            aria-label="Hue"
            :aria-valuenow="hsv.h"
            aria-valuemin="0"
            aria-valuemax="359"
            @pointerdown="startHueDrag"
            @keydown="onHueKeydown"
          >
            <div class="seneu-colorpicker__hue-thumb" :style="hueThumbStyle" />
          </div>

          <div class="seneu-colorpicker__body">
            <div class="seneu-colorpicker__preview" :style="{ background: currentHex }" />

            <div class="seneu-colorpicker__fields">
              <div class="seneu-colorpicker__tabs" role="tablist">
                <button
                  v-for="f in FORMATS" :key="f"
                  type="button"
                  role="tab"
                  class="seneu-colorpicker__tab"
                  :class="{ 'seneu-colorpicker__tab--active': activeFormat === f }"
                  :aria-selected="activeFormat === f"
                  @click="activeFormat = f"
                >{{ f.toUpperCase() }}</button>
              </div>

              <input
                v-if="activeFormat === 'hex'"
                v-model="hexText"
                type="text"
                class="seneu-colorpicker__input seneu-colorpicker__input--hex"
                aria-label="Hex"
                @focus="hexFocused = true"
                @blur="hexFocused = false; commitHex()"
                @keydown.enter="commitHex"
              />

              <div v-else-if="activeFormat === 'rgb'" class="seneu-colorpicker__input-row">
                <label class="seneu-colorpicker__input-group">
                  <span>R</span>
                  <input v-model.number="rgbInputs.r" type="number" min="0" max="255" @change="commitRgb" />
                </label>
                <label class="seneu-colorpicker__input-group">
                  <span>G</span>
                  <input v-model.number="rgbInputs.g" type="number" min="0" max="255" @change="commitRgb" />
                </label>
                <label class="seneu-colorpicker__input-group">
                  <span>B</span>
                  <input v-model.number="rgbInputs.b" type="number" min="0" max="255" @change="commitRgb" />
                </label>
              </div>

              <div v-else-if="activeFormat === 'hsl'" class="seneu-colorpicker__input-row">
                <label class="seneu-colorpicker__input-group">
                  <span>H</span>
                  <input v-model.number="hslInputs.h" type="number" min="0" max="360" @change="commitHsl" />
                </label>
                <label class="seneu-colorpicker__input-group">
                  <span>S</span>
                  <input v-model.number="hslInputs.s" type="number" min="0" max="100" @change="commitHsl" />
                </label>
                <label class="seneu-colorpicker__input-group">
                  <span>L</span>
                  <input v-model.number="hslInputs.l" type="number" min="0" max="100" @change="commitHsl" />
                </label>
              </div>

              <div v-else class="seneu-colorpicker__input-row">
                <label class="seneu-colorpicker__input-group">
                  <span>H</span>
                  <input v-model.number="hsvInputs.h" type="number" min="0" max="360" @change="commitHsv" />
                </label>
                <label class="seneu-colorpicker__input-group">
                  <span>S</span>
                  <input v-model.number="hsvInputs.s" type="number" min="0" max="100" @change="commitHsv" />
                </label>
                <label class="seneu-colorpicker__input-group">
                  <span>V</span>
                  <input v-model.number="hsvInputs.v" type="number" min="0" max="100" @change="commitHsv" />
                </label>
              </div>
            </div>
          </div>

          <div v-if="presets.length" class="seneu-colorpicker__presets">
            <button
              v-for="(p, i) in presets" :key="`${p}-${i}`"
              type="button"
              class="seneu-colorpicker__preset"
              :style="{ background: p }"
              :aria-label="`Pilih warna ${p}`"
              @click="selectPreset(p)"
            />
          </div>
        </div>
      </Transition>
    </div>

    <p
      v-if="error || hint"
      :id="`${fieldId}-desc`"
      class="seneu-colorpicker__message"
      :class="error ? 'seneu-colorpicker__message--error' : 'seneu-colorpicker__message--hint'"
    >
      <SeneuIcon v-if="error" name="error" :size="14" aria-hidden="true" />
      {{ error || hint }}
    </p>
  </div>
</template>

<style>
/* ── Root ──────────────────────────────────────────────────── */
.seneu-colorpicker {
  display:        flex;
  flex-direction: column;
  gap:            var(--space-component-gap);
}

.seneu-colorpicker__label {
  font-size:   var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color:       var(--color-text-default);
  line-height: var(--line-height-normal);
}

.seneu-colorpicker--disabled .seneu-colorpicker__label { color: var(--color-text-disabled); }

.seneu-colorpicker__row {
  position: relative;
  display:  flex;
  align-items: center;
  gap:      var(--space-inline-tight);
}

/* ── Trigger ───────────────────────────────────────────────── */
.seneu-colorpicker__trigger {
  display:       flex;
  align-items:   center;
  gap:           var(--space-inline-tight);
  flex:          1;
  min-width:     0;
  background:    var(--color-surface-raised);
  border:        1px solid var(--color-border-default);
  border-radius: var(--radius-element);
  cursor:        pointer;
  font-family:   var(--font-sans);
  color:         var(--color-text-default);
  transition:    border-color var(--duration-fast) var(--easing-standard), box-shadow var(--duration-fast) var(--easing-standard);
}
.seneu-colorpicker--sm   .seneu-colorpicker__trigger { padding: 6px 10px;  font-size: var(--font-size-small); }
.seneu-colorpicker--base .seneu-colorpicker__trigger { padding: 9px 12px;  font-size: var(--font-size-body); }
.seneu-colorpicker--lg   .seneu-colorpicker__trigger { padding: 12px 16px; font-size: var(--font-size-lead); }

.seneu-colorpicker__trigger:hover:not(:disabled) { border-color: var(--color-border-interactive); }
.seneu-colorpicker--error .seneu-colorpicker__trigger:hover:not(:disabled) { border-color: var(--color-border-danger); }
.seneu-colorpicker__trigger:focus-visible {
  outline:        2px solid var(--color-border-focus);
  outline-offset: 2px;
}
.seneu-colorpicker--error .seneu-colorpicker__trigger { border-color: var(--color-border-danger); }
.seneu-colorpicker__trigger:disabled {
  cursor:  not-allowed;
  opacity: var(--opacity-disabled);
}

.seneu-colorpicker__swatch {
  width:          20px;
  height:         20px;
  flex-shrink:    0;
  border-radius:  var(--radius-subtle);
  border:         1px solid var(--color-border-default);
  background-image:
    linear-gradient(45deg, var(--color-border-muted) 25%, transparent 25%, transparent 75%, var(--color-border-muted) 75%),
    linear-gradient(45deg, var(--color-border-muted) 25%, transparent 25%, transparent 75%, var(--color-border-muted) 75%);
  background-size:     8px 8px;
  background-position: 0 0, 4px 4px;
}
.seneu-colorpicker__swatch--empty { opacity: var(--opacity-medium); }

.seneu-colorpicker__trigger-text {
  flex:          1;
  min-width:     0;
  overflow:      hidden;
  text-overflow: ellipsis;
  white-space:   nowrap;
  text-align:    left;
}

@keyframes seneu-colorpicker-spin { to { transform: rotate(360deg); } }
.seneu-colorpicker__spinner { animation: seneu-colorpicker-spin 0.8s linear infinite; flex-shrink: 0; }

.seneu-colorpicker__clear-btn {
  display:         flex;
  align-items:     center;
  justify-content: center;
  border:          none;
  background:      transparent;
  border-radius:   var(--radius-subtle);
  cursor:          pointer;
  color:           var(--color-text-muted);
  padding:         6px;
  transition:      color var(--duration-fast) var(--easing-standard);
}
.seneu-colorpicker__clear-btn:hover { color: var(--color-text-danger); }
.seneu-colorpicker__clear-btn:focus-visible { outline: 2px solid var(--color-border-focus); outline-offset: 1px; }

/* ── Popover ───────────────────────────────────────────────── */
.seneu-colorpicker__popover {
  position:       absolute;
  top:            calc(100% + 4px);
  left:           0;
  z-index:        var(--z-index-dropdown);
  display:        flex;
  flex-direction: column;
  gap:            var(--primitive-space-3);
  width:          232px;
  background:     var(--color-surface-overlay);
  border:         1px solid var(--color-border-default);
  border-radius:  var(--radius-container);
  box-shadow:     var(--elevation-floating);
  padding:        var(--primitive-space-4);
}

.seneu-colorpicker-pop-enter-active { transition: opacity var(--duration-fast) var(--easing-enter), transform var(--duration-fast) var(--easing-enter); }
.seneu-colorpicker-pop-leave-active { transition: opacity var(--duration-fast) var(--easing-exit), transform var(--duration-fast) var(--easing-exit); }
.seneu-colorpicker-pop-enter-from,
.seneu-colorpicker-pop-leave-to { opacity: 0; transform: translateY(-6px); }

/* ── Saturation/Value square ───────────────────────────────── */
.seneu-colorpicker__sv {
  position:      relative;
  width:         100%;
  height:        140px;
  border-radius: var(--radius-element);
  cursor:        crosshair;
  touch-action:  none;
  overflow:      hidden;
}
.seneu-colorpicker__sv:focus-visible { outline: 2px solid var(--color-border-focus); outline-offset: 2px; }
.seneu-colorpicker__sv-white { position: absolute; inset: 0; background: linear-gradient(to right, #fff, transparent); }
.seneu-colorpicker__sv-black { position: absolute; inset: 0; background: linear-gradient(to top, #000, transparent); }
.seneu-colorpicker__sv-thumb {
  position:      absolute;
  width:         14px;
  height:        14px;
  border-radius: var(--radius-circle);
  border:        2px solid white;
  box-shadow:    0 0 0 1px rgba(0, 0, 0, 0.3), var(--elevation-raised);
  transform:     translate(-50%, -50%);
  pointer-events: none;
}

/* ── Hue slider ────────────────────────────────────────────── */
.seneu-colorpicker__hue {
  position:      relative;
  width:         100%;
  height:        12px;
  border-radius: var(--radius-pill);
  cursor:        pointer;
  touch-action:  none;
  background:    linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);
}
.seneu-colorpicker__hue:focus-visible { outline: 2px solid var(--color-border-focus); outline-offset: 2px; }
.seneu-colorpicker__hue-thumb {
  position:      absolute;
  top:           50%;
  width:         16px;
  height:        16px;
  border-radius: var(--radius-circle);
  border:        2px solid white;
  box-shadow:    0 0 0 1px rgba(0, 0, 0, 0.3), var(--elevation-raised);
  transform:     translate(-50%, -50%);
  background:    transparent;
  pointer-events: none;
}

/* ── Body: preview + format tabs + inputs ─────────────────── */
.seneu-colorpicker__body {
  display: flex;
  gap:     var(--space-inline-normal);
  align-items: flex-start;
}

.seneu-colorpicker__preview {
  width:          32px;
  height:         32px;
  flex-shrink:    0;
  border-radius:  var(--radius-element);
  border:         1px solid var(--color-border-default);
  margin-top:     22px;
}

.seneu-colorpicker__fields {
  flex:           1;
  min-width:      0;
  display:        flex;
  flex-direction: column;
  gap:            var(--space-inline-tight);
}

.seneu-colorpicker__tabs {
  display: flex;
  gap:     2px;
  background: var(--color-surface-default);
  border-radius: var(--radius-element);
  padding: 2px;
}
.seneu-colorpicker__tab {
  flex:          1;
  border:        none;
  background:    transparent;
  border-radius: var(--radius-subtle);
  padding:       4px 0;
  font-family:   var(--font-sans);
  font-size:     var(--font-size-xs);
  font-weight:   var(--font-weight-semibold);
  color:         var(--color-text-muted);
  cursor:        pointer;
  transition:    background-color var(--duration-fast) var(--easing-standard), color var(--duration-fast) var(--easing-standard);
}
.seneu-colorpicker__tab:hover { color: var(--color-text-default); }
.seneu-colorpicker__tab--active {
  background: var(--color-surface-raised);
  color:      var(--color-text-brand);
  box-shadow: var(--elevation-surface);
}
.seneu-colorpicker__tab:focus-visible { outline: 2px solid var(--color-border-focus); outline-offset: 1px; }

.seneu-colorpicker__input {
  width:         100%;
  box-sizing:    border-box;
  padding:       6px 8px;
  border:        1px solid var(--color-border-default);
  border-radius: var(--radius-element);
  background:    var(--color-surface-raised);
  font-family:   var(--font-mono);
  font-size:     var(--font-size-small);
  color:         var(--color-text-default);
}
.seneu-colorpicker__input:focus {
  outline:      none;
  border-color: var(--color-border-focus);
  box-shadow:   0 0 0 3px var(--color-ring-brand);
}

.seneu-colorpicker__input-row { display: flex; gap: 6px; }
.seneu-colorpicker__input-group {
  flex:           1;
  min-width:      0;
  display:        flex;
  flex-direction: column;
  gap:            2px;
  font-size:      var(--font-size-xs);
  color:          var(--color-text-muted);
}
.seneu-colorpicker__input-group input {
  width:         100%;
  box-sizing:    border-box;
  padding:       6px 6px;
  border:        1px solid var(--color-border-default);
  border-radius: var(--radius-element);
  background:    var(--color-surface-raised);
  font-family:   var(--font-mono);
  font-size:     var(--font-size-small);
  color:         var(--color-text-default);
}
.seneu-colorpicker__input-group input:focus {
  outline:      none;
  border-color: var(--color-border-focus);
  box-shadow:   0 0 0 3px var(--color-ring-brand);
}
/* Hide native number spinners — the field is narrow and they clip */
.seneu-colorpicker__input-group input::-webkit-outer-spin-button,
.seneu-colorpicker__input-group input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.seneu-colorpicker__input-group input[type='number'] { appearance: textfield; }

/* ── Presets ───────────────────────────────────────────────── */
.seneu-colorpicker__presets {
  display:               grid;
  grid-template-columns: repeat(8, 1fr);
  gap:                   6px;
}
.seneu-colorpicker__preset {
  width:         100%;
  aspect-ratio:  1;
  border-radius: var(--radius-subtle);
  border:        1px solid var(--color-border-default);
  cursor:        pointer;
  padding:       0;
  transition:    transform var(--duration-fast) var(--easing-standard);
}
.seneu-colorpicker__preset:hover { transform: scale(1.1); }
.seneu-colorpicker__preset:focus-visible { outline: 2px solid var(--color-border-focus); outline-offset: 1px; }

/* ── Message line ──────────────────────────────────────────── */
.seneu-colorpicker__message {
  display:     flex;
  align-items: center;
  gap:         4px;
  font-size:   var(--font-size-small);
  line-height: var(--line-height-normal);
}
.seneu-colorpicker__message--hint  { color: var(--color-text-muted); }
.seneu-colorpicker__message--error { color: var(--color-text-danger); }

/* ── Reduced motion ────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .seneu-colorpicker__spinner { animation-duration: 0.01ms; }
}
</style>
