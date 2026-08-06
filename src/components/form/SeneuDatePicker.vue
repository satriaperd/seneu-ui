<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted, useId } from 'vue'
import SeneuIcon from '../display/SeneuIcon.vue'

defineOptions({ inheritAttrs: false })

/**
 * Date picker with single-date and range modes, typeable text
 * input, keyboard-navigable calendar grid, quick month/year jump,
 * min/max + custom disabled dates, and range presets. Falls back
 * to the native <input type="date"> via the `native` prop.
 */
const props = defineProps({
  /** Bound value — Date|null in single mode, { start, end } in range mode */
  modelValue: { type: null, default: null },
  /** Enables range selection — modelValue becomes { start: Date|null, end: Date|null } */
  range: { type: Boolean, default: false },
  /** Renders the browser's native <input type="date"> instead of the custom calendar (single mode only) */
  native: { type: Boolean, default: false },
  /** Label shown above the field */
  label: { type: String, default: '' },
  /** Start-date input label in range mode */
  labelStart: { type: String, default: 'Mulai' },
  /** End-date input label in range mode */
  labelEnd: { type: String, default: 'Selesai' },
  /** Placeholder text — defaults to the active format string */
  placeholder: { type: String, default: '' },
  /** Helper text shown below the field */
  hint: { type: String, default: '' },
  /** Error message — sets error state when non-empty */
  error: { type: String, default: '' },
  /** Disables the field entirely */
  disabled: { type: Boolean, default: false },
  /** Shows a spinner instead of the calendar icon — for async-loaded constraints */
  loading: { type: Boolean, default: false },
  /** Controls padding and font-size */
  size: {
    type: String,
    default: 'base',
    validator: v => ['sm', 'base', 'lg'].includes(v),
  },
  /** Display/parse format — tokens: YYYY, MMMM, MMM, MM, DD */
  format: { type: String, default: 'DD/MM/YYYY' },
  /** Earliest selectable date (inclusive) */
  minDate: { type: Date, default: null },
  /** Latest selectable date (inclusive) */
  maxDate: { type: Date, default: null },
  /** Custom predicate — return true to disable a given date */
  disabledDates: { type: Function, default: null },
  /** Day-of-week indices to disable (0 = Sunday … 6 = Saturday) */
  disabledDaysOfWeek: { type: Array, default: () => [] },
  /** Shows the × button to clear a set value */
  clearable: { type: Boolean, default: true },
  /** First day of the week — 0 = Sunday, 1 = Monday */
  weekStart: {
    type: Number,
    default: 1,
    validator: v => v === 0 || v === 1,
  },
  /** Shows the "Today" shortcut in the calendar footer */
  showToday: { type: Boolean, default: true },
  /** Shows quick range presets (range mode only) */
  showPresets: { type: Boolean, default: false },
  /** Custom presets — [{ label, value: [Date, Date] }]. Defaults to a sensible ID set. */
  presets: { type: Array, default: null },
  /** Explicit id — auto-generated when omitted */
  id: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'open', 'close', 'clear'])

const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const MONTHS_SHORT_ID = MONTHS_ID.map(m => m.slice(0, 3))
const DOW_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'] // index 0 = Sunday, matches Date#getDay()

const _uid = useId()
const fieldId = computed(() => props.id || _uid)
const startId = computed(() => `${fieldId.value}-start`)
const endId   = computed(() => `${fieldId.value}-end`)

const iconSize = computed(() => ({ sm: 16, base: 18, lg: 20 }[props.size]))

// ── Date helpers ──────────────────────────────────────────────────────
function pad2(n) { return String(n).padStart(2, '0') }
function startOfDay(d) { const c = new Date(d); c.setHours(0, 0, 0, 0); return c }
function dayKey(d) { return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` }
function isSameDay(a, b) { return !!a && !!b && dayKey(a) === dayKey(b) }
function addDays(d, n) { const c = new Date(d); c.setDate(c.getDate() + n); return c }
function today() { return startOfDay(new Date()) }

function isDateDisabled(date) {
  if (props.minDate && startOfDay(date) < startOfDay(props.minDate)) return true
  if (props.maxDate && startOfDay(date) > startOfDay(props.maxDate)) return true
  if (props.disabledDaysOfWeek.includes(date.getDay())) return true
  if (props.disabledDates && props.disabledDates(date)) return true
  return false
}

function formatDate(date, fmt = props.format) {
  if (!date) return ''
  return fmt
    .replace('YYYY', date.getFullYear())
    .replace('MMMM', MONTHS_ID[date.getMonth()])
    .replace('MMM', MONTHS_SHORT_ID[date.getMonth()])
    .replace('MM', pad2(date.getMonth() + 1))
    .replace('DD', pad2(date.getDate()))
}

const TOKENS = ['YYYY', 'MMMM', 'MMM', 'MM', 'DD']
const TOKEN_PATTERNS = {
  YYYY: '(\\d{4})',
  MMMM: '([A-Za-zÀ-ÿ]+)',
  MMM:  '([A-Za-zÀ-ÿ]+)',
  MM:   '(\\d{1,2})',
  DD:   '(\\d{1,2})',
}

function buildParser(fmt) {
  const tokens = []
  let pattern = ''
  let i = 0
  while (i < fmt.length) {
    const token = TOKENS.find(t => fmt.startsWith(t, i))
    if (token) {
      tokens.push(token)
      pattern += TOKEN_PATTERNS[token]
      i += token.length
    } else {
      pattern += fmt[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      i += 1
    }
  }
  return { regex: new RegExp(`^${pattern}$`), tokens }
}

function parseDate(str, fmt = props.format) {
  if (!str || !str.trim()) return null
  const { regex, tokens } = buildParser(fmt)
  const m = str.trim().match(regex)
  if (!m) return null
  let year, month, day
  tokens.forEach((token, idx) => {
    const val = m[idx + 1]
    if (token === 'YYYY') year = Number(val)
    else if (token === 'MM') month = Number(val) - 1
    else if (token === 'DD') day = Number(val)
    else if (token === 'MMMM' || token === 'MMM') {
      month = MONTHS_ID.findIndex((name, i2) =>
        name.toLowerCase().startsWith(val.toLowerCase()) || MONTHS_SHORT_ID[i2].toLowerCase() === val.toLowerCase(),
      )
    }
  })
  if (year == null || month == null || month < 0 || day == null) return null
  const d = new Date(year, month, day)
  if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) return null
  return d
}

const effectivePlaceholder = computed(() => props.placeholder || props.format)

// ── Open / close ──────────────────────────────────────────────────────
const rootRef  = ref(null)
const isOpen   = ref(false)
const viewMode = ref('days') // 'days' | 'months' | 'years'
const startInputRef = ref(null)
const endInputRef   = ref(null)

function open() {
  if (props.disabled || props.loading || isOpen.value) return
  isOpen.value = true
  viewMode.value = 'days'
  emit('open')
  nextTick(focusActiveDay)
}
function close(refocus = false) {
  if (!isOpen.value) return
  isOpen.value = false
  viewMode.value = 'days'
  rangeSelecting.value = false
  hoverDate.value = null
  emit('close')
  if (refocus) nextTick(() => (activePane.value === 'end' ? endInputRef : startInputRef).value?.focus())
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

// ── View (month/year being displayed) ────────────────────────────────
const seed = props.range ? (props.modelValue?.start ?? today()) : (props.modelValue ?? today())
const viewYear  = ref(seed.getFullYear())
const viewMonth = ref(seed.getMonth())
const yearBlockStart = ref(Math.floor(viewYear.value / 12) * 12)

function prevMonth() {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- } else viewMonth.value--
}
function nextMonth() {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ } else viewMonth.value++
}
function prevYear() { viewYear.value-- }
function nextYear() { viewYear.value++ }
function prevYearBlock() { yearBlockStart.value -= 12 }
function nextYearBlock() { yearBlockStart.value += 12 }

const isPrevMonthDisabled = computed(() => {
  if (!props.minDate) return false
  return viewYear.value === props.minDate.getFullYear() && viewMonth.value === props.minDate.getMonth()
})
const isNextMonthDisabled = computed(() => {
  if (!props.maxDate) return false
  return viewYear.value === props.maxDate.getFullYear() && viewMonth.value === props.maxDate.getMonth()
})

function openMonthPicker() { viewMode.value = viewMode.value === 'months' ? 'days' : 'months' }
function openYearPicker() {
  yearBlockStart.value = Math.floor(viewYear.value / 12) * 12
  viewMode.value = 'years'
}
function pickMonth(i) { viewMonth.value = i; viewMode.value = 'days'; nextTick(focusActiveDay) }
function pickYear(y) { viewYear.value = y; viewMode.value = 'months' }

// ── Month matrix ──────────────────────────────────────────────────────
function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1)
  const lastDay  = new Date(year, month + 1, 0)
  const firstDow = (firstDay.getDay() - props.weekStart + 7) % 7
  const days = []
  for (let i = firstDow; i > 0; i--) days.push({ date: new Date(year, month, 1 - i), inMonth: false })
  for (let d = 1; d <= lastDay.getDate(); d++) days.push({ date: new Date(year, month, d), inMonth: true })
  const rem = (7 - (days.length % 7)) % 7
  for (let d = 1; d <= rem; d++) days.push({ date: new Date(year, month + 1, d), inMonth: false })
  return days
}

const panes = computed(() => {
  if (!props.range) return [{ year: viewYear.value, month: viewMonth.value }]
  const y2 = viewMonth.value === 11 ? viewYear.value + 1 : viewYear.value
  const m2 = viewMonth.value === 11 ? 0 : viewMonth.value + 1
  return [
    { year: viewYear.value, month: viewMonth.value },
    { year: y2, month: m2 },
  ]
})

const weekdayLabels = computed(() => [...DOW_ID.slice(props.weekStart), ...DOW_ID.slice(0, props.weekStart)])

const yearBlock = computed(() => Array.from({ length: 12 }, (_, i) => yearBlockStart.value + i))

// ── Single-mode selection ────────────────────────────────────────────
const selectedDate = computed(() => (props.range ? null : props.modelValue))

function selectSingleDay(date) {
  if (isDateDisabled(date)) return
  emit('update:modelValue', new Date(date))
  close(true)
}

// ── Range-mode selection ─────────────────────────────────────────────
const rangeStart = ref(props.range ? (props.modelValue?.start ?? null) : null)
const rangeEnd   = ref(props.range ? (props.modelValue?.end   ?? null) : null)
const rangeSelecting = ref(false)
const hoverDate  = ref(null)
const activePane = ref('start') // which text field is being edited/focused

watch(() => props.modelValue, val => {
  if (!props.range) return
  rangeStart.value = val?.start ?? null
  rangeEnd.value   = val?.end   ?? null
  if (!val?.start && !val?.end) rangeSelecting.value = false
}, { deep: true })

function effectiveRange() {
  const start = rangeStart.value
  const end = rangeEnd.value || (rangeSelecting.value && hoverDate.value ? hoverDate.value : null)
  if (!start || !end) return { lo: start, hi: null }
  return start <= end ? { lo: start, hi: end } : { lo: end, hi: start }
}
function isRangeStart(date) { const { lo } = effectiveRange(); return !!lo && isSameDay(date, lo) }
function isRangeEnd(date)   { const { hi } = effectiveRange(); return !!hi && isSameDay(date, hi) }
function isInRange(date) {
  const { lo, hi } = effectiveRange()
  return !!lo && !!hi && date > lo && date < hi
}

function selectRangeDay(date) {
  if (isDateDisabled(date)) return
  const d = new Date(date)
  if (!rangeSelecting.value || rangeEnd.value) {
    rangeStart.value = d; rangeEnd.value = null; hoverDate.value = null; rangeSelecting.value = true
  } else {
    if (d < rangeStart.value) { rangeEnd.value = new Date(rangeStart.value); rangeStart.value = d }
    else rangeEnd.value = d
    rangeSelecting.value = false
    hoverDate.value = null
    emit('update:modelValue', { start: rangeStart.value, end: rangeEnd.value })
    close(true)
  }
}

function selectDay(date) { props.range ? selectRangeDay(date) : selectSingleDay(date) }

// ── Presets (range mode) ─────────────────────────────────────────────
const DEFAULT_PRESETS = computed(() => {
  const t = today()
  return [
    { label: 'Hari ini', value: [t, t] },
    { label: 'Kemarin', value: [addDays(t, -1), addDays(t, -1)] },
    { label: '7 hari terakhir', value: [addDays(t, -6), t] },
    { label: '30 hari terakhir', value: [addDays(t, -29), t] },
    { label: 'Bulan ini', value: [new Date(t.getFullYear(), t.getMonth(), 1), t] },
    { label: 'Bulan lalu', value: [new Date(t.getFullYear(), t.getMonth() - 1, 1), new Date(t.getFullYear(), t.getMonth(), 0)] },
  ]
})
const activePresets = computed(() => props.presets || DEFAULT_PRESETS.value)

function applyPreset(preset) {
  const [start, end] = preset.value
  rangeStart.value = start
  rangeEnd.value = end
  rangeSelecting.value = false
  viewYear.value = end.getFullYear()
  viewMonth.value = end.getMonth()
  emit('update:modelValue', { start, end })
  close(true)
}

// ── Today / Clear ─────────────────────────────────────────────────────
function goToday() {
  const t = today()
  viewYear.value = t.getFullYear()
  viewMonth.value = t.getMonth()
  viewMode.value = 'days'
  if (!props.range) {
    emit('update:modelValue', t)
    close(true)
  } else {
    nextTick(focusActiveDay)
  }
}
function clearValue() {
  if (props.range) {
    rangeStart.value = null; rangeEnd.value = null; rangeSelecting.value = false
    emit('update:modelValue', { start: null, end: null })
  } else {
    emit('update:modelValue', null)
  }
  emit('clear')
}

const hasValue = computed(() => props.range ? !!(rangeStart.value || rangeEnd.value) : !!props.modelValue)
const showClear = computed(() => props.clearable && hasValue.value && !props.disabled && !props.loading)

// ── Typed text inputs ─────────────────────────────────────────────────
const singleText = ref(props.range ? '' : formatDate(props.modelValue))
const startText  = ref(formatDate(rangeStart.value))
const endText    = ref(formatDate(rangeEnd.value))
const editingSingle = ref(false)
const editingStart  = ref(false)
const editingEnd    = ref(false)

watch(() => props.modelValue, val => {
  if (!props.range && !editingSingle.value) singleText.value = formatDate(val)
})
watch(rangeStart, val => { if (!editingStart.value) startText.value = formatDate(val) })
watch(rangeEnd,   val => { if (!editingEnd.value)   endText.value   = formatDate(val) })
watch(() => props.format, () => {
  if (!props.range) singleText.value = formatDate(props.modelValue)
  startText.value = formatDate(rangeStart.value)
  endText.value   = formatDate(rangeEnd.value)
})

function commitSingleText() {
  editingSingle.value = false
  const parsed = parseDate(singleText.value)
  if (!singleText.value.trim()) { emit('update:modelValue', null); return }
  if (parsed && !isDateDisabled(parsed)) {
    emit('update:modelValue', parsed)
    viewYear.value = parsed.getFullYear()
    viewMonth.value = parsed.getMonth()
  } else {
    singleText.value = formatDate(props.modelValue)
  }
}
function commitStartText() {
  editingStart.value = false
  const parsed = parseDate(startText.value)
  if (!startText.value.trim()) { rangeStart.value = null; emit('update:modelValue', { start: null, end: rangeEnd.value }); return }
  if (parsed && !isDateDisabled(parsed)) {
    rangeStart.value = parsed
    if (rangeEnd.value && parsed > rangeEnd.value) rangeEnd.value = parsed
    emit('update:modelValue', { start: rangeStart.value, end: rangeEnd.value })
    viewYear.value = parsed.getFullYear()
    viewMonth.value = parsed.getMonth()
  } else {
    startText.value = formatDate(rangeStart.value)
  }
}
function commitEndText() {
  editingEnd.value = false
  const parsed = parseDate(endText.value)
  if (!endText.value.trim()) { rangeEnd.value = null; emit('update:modelValue', { start: rangeStart.value, end: null }); return }
  if (parsed && !isDateDisabled(parsed)) {
    rangeEnd.value = parsed
    if (rangeStart.value && parsed < rangeStart.value) rangeStart.value = parsed
    emit('update:modelValue', { start: rangeStart.value, end: rangeEnd.value })
    viewYear.value = parsed.getFullYear()
    viewMonth.value = parsed.getMonth()
  } else {
    endText.value = formatDate(rangeEnd.value)
  }
}

function onFieldKeydown(e, commitFn) {
  if (e.key === 'Enter') { commitFn(); close() }
  else if (e.key === 'ArrowDown') { e.preventDefault(); open() }
}

// ── Native mode ───────────────────────────────────────────────────────
const nativeValue = computed(() => {
  if (!props.modelValue) return ''
  const d = props.modelValue
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
})
function onNativeChange(e) {
  if (!e.target.value) { emit('update:modelValue', null); return }
  const [y, m, d] = e.target.value.split('-').map(Number)
  emit('update:modelValue', new Date(y, m - 1, d))
}

// ── Keyboard grid navigation ──────────────────────────────────────────
const dayRefs = new Map()
function setDayRef(el, key) { if (el) dayRefs.set(key, el); else dayRefs.delete(key) }

const activeDate = ref(props.range ? (rangeStart.value ?? today()) : (props.modelValue ?? today()))

function focusActiveDay() {
  dayRefs.get(dayKey(activeDate.value))?.focus()
}

function moveActive(days) {
  let next = addDays(activeDate.value, days)
  activeDate.value = next
  if (next.getFullYear() !== viewYear.value || next.getMonth() !== viewMonth.value) {
    viewYear.value = next.getFullYear()
    viewMonth.value = next.getMonth()
  }
  nextTick(focusActiveDay)
}

function onGridKeydown(e) {
  switch (e.key) {
    case 'ArrowLeft':  e.preventDefault(); moveActive(-1); break
    case 'ArrowRight': e.preventDefault(); moveActive(1);  break
    case 'ArrowUp':    e.preventDefault(); moveActive(-7); break
    case 'ArrowDown':  e.preventDefault(); moveActive(7);  break
    case 'Home': {
      e.preventDefault()
      const dow = (activeDate.value.getDay() - props.weekStart + 7) % 7
      moveActive(-dow)
      break
    }
    case 'End': {
      e.preventDefault()
      const dow = (activeDate.value.getDay() - props.weekStart + 7) % 7
      moveActive(6 - dow)
      break
    }
    case 'PageUp':
      e.preventDefault()
      if (e.shiftKey) { viewYear.value--; activeDate.value = new Date(viewYear.value, viewMonth.value, Math.min(activeDate.value.getDate(), 28)) }
      else prevMonth()
      nextTick(focusActiveDay)
      break
    case 'PageDown':
      e.preventDefault()
      if (e.shiftKey) { viewYear.value++; activeDate.value = new Date(viewYear.value, viewMonth.value, Math.min(activeDate.value.getDate(), 28)) }
      else nextMonth()
      nextTick(focusActiveDay)
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      selectDay(activeDate.value)
      break
  }
}

// ── Display strings (footer/status) ──────────────────────────────────
const rangeDays = computed(() => {
  if (!rangeStart.value || !rangeEnd.value) return null
  return Math.round(Math.abs(rangeEnd.value - rangeStart.value) / 86400000) + 1
})
</script>

<template>
  <div
    ref="rootRef"
    class="seneu-datepicker"
    :class="[
      `seneu-datepicker--${size}`,
      {
        'seneu-datepicker--error':    !!error,
        'seneu-datepicker--disabled': disabled,
        'seneu-datepicker--loading':  loading,
        'seneu-datepicker--range':    range,
      },
    ]"
  >
    <label v-if="label" :for="range ? startId : fieldId" class="seneu-datepicker__label">
      {{ label }}
    </label>

    <!-- Native fallback (single mode only) -->
    <div v-if="native && !range" class="seneu-datepicker__wrapper">
      <input
        :id="fieldId"
        type="date"
        class="seneu-datepicker__field"
        :value="nativeValue"
        :disabled="disabled"
        :min="minDate ? `${minDate.getFullYear()}-${pad2(minDate.getMonth()+1)}-${pad2(minDate.getDate())}` : undefined"
        :max="maxDate ? `${maxDate.getFullYear()}-${pad2(maxDate.getMonth()+1)}-${pad2(maxDate.getDate())}` : undefined"
        v-bind="$attrs"
        @change="onNativeChange"
      />
    </div>

    <!-- Custom calendar mode -->
    <template v-else>
      <div class="seneu-datepicker__row">
        <!-- Single input -->
        <div v-if="!range" class="seneu-datepicker__wrapper">
          <input
            :id="fieldId"
            ref="startInputRef"
            type="text"
            class="seneu-datepicker__field"
            :placeholder="effectivePlaceholder"
            :value="singleText"
            :disabled="disabled || loading"
            :aria-describedby="(hint || error) ? `${fieldId}-desc` : undefined"
            :aria-invalid="error ? 'true' : undefined"
            aria-haspopup="dialog"
            :aria-expanded="isOpen"
            @focus="editingSingle = true; open()"
            @input="e => { editingSingle = true; singleText = e.target.value }"
            @blur="commitSingleText"
            @keydown="onFieldKeydown($event, commitSingleText)"
          />
          <button
            type="button"
            class="seneu-datepicker__icon-btn"
            tabindex="-1"
            :disabled="disabled || loading"
            aria-label="Buka kalender"
            @click="toggle"
          >
            <SeneuIcon v-if="loading" name="progress_activity" :size="iconSize" class="seneu-datepicker__spinner" aria-hidden="true" />
            <SeneuIcon v-else name="calendar_month" :size="iconSize" aria-hidden="true" />
          </button>
          <button
            v-if="showClear"
            type="button"
            class="seneu-datepicker__icon-btn seneu-datepicker__icon-btn--clear"
            aria-label="Hapus tanggal"
            @click="clearValue"
          >
            <SeneuIcon name="close" :size="iconSize" aria-hidden="true" />
          </button>
        </div>

        <!-- Range inputs -->
        <template v-else>
          <div class="seneu-datepicker__range-field">
            <label :for="startId" class="seneu-datepicker__sublabel">{{ labelStart }}</label>
            <div class="seneu-datepicker__wrapper">
              <input
                :id="startId"
                ref="startInputRef"
                type="text"
                class="seneu-datepicker__field"
                :placeholder="effectivePlaceholder"
                :value="startText"
                :disabled="disabled || loading"
                aria-haspopup="dialog"
                :aria-expanded="isOpen"
                @focus="editingStart = true; activePane = 'start'; open()"
                @input="e => { editingStart = true; startText = e.target.value }"
                @blur="commitStartText"
                @keydown="onFieldKeydown($event, commitStartText)"
              />
              <button type="button" class="seneu-datepicker__icon-btn" tabindex="-1" :disabled="disabled || loading" aria-label="Buka kalender" @click="activePane = 'start'; toggle()">
                <SeneuIcon name="calendar_month" :size="iconSize" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div class="seneu-datepicker__range-arrow">
            <SeneuIcon name="arrow_forward" :size="iconSize" aria-hidden="true" />
          </div>

          <div class="seneu-datepicker__range-field">
            <label :for="endId" class="seneu-datepicker__sublabel">{{ labelEnd }}</label>
            <div class="seneu-datepicker__wrapper">
              <input
                :id="endId"
                ref="endInputRef"
                type="text"
                class="seneu-datepicker__field"
                :placeholder="effectivePlaceholder"
                :value="endText"
                :disabled="disabled || loading"
                aria-haspopup="dialog"
                :aria-expanded="isOpen"
                @focus="editingEnd = true; activePane = 'end'; open()"
                @input="e => { editingEnd = true; endText = e.target.value }"
                @blur="commitEndText"
                @keydown="onFieldKeydown($event, commitEndText)"
              />
              <button type="button" class="seneu-datepicker__icon-btn" tabindex="-1" :disabled="disabled || loading" aria-label="Buka kalender" @click="activePane = 'end'; toggle()">
                <SeneuIcon v-if="loading" name="progress_activity" :size="iconSize" class="seneu-datepicker__spinner" aria-hidden="true" />
                <SeneuIcon v-else name="calendar_month" :size="iconSize" aria-hidden="true" />
              </button>
              <button
                v-if="showClear"
                type="button"
                class="seneu-datepicker__icon-btn seneu-datepicker__icon-btn--clear"
                aria-label="Hapus rentang tanggal"
                @click="clearValue"
              >
                <SeneuIcon name="close" :size="iconSize" aria-hidden="true" />
              </button>
            </div>
          </div>
        </template>

        <!-- Popover -->
        <Transition name="seneu-datepicker-pop">
          <div v-if="isOpen" class="seneu-datepicker__popover" role="dialog" aria-label="Pilih tanggal" @keydown="viewMode === 'days' && onGridKeydown($event)">
            <div class="seneu-datepicker__body-row">
              <div v-if="range && showPresets" class="seneu-datepicker__presets">
                <button
                  v-for="preset in activePresets"
                  :key="preset.label"
                  type="button"
                  class="seneu-datepicker__preset-btn"
                  @click="applyPreset(preset)"
                >{{ preset.label }}</button>
              </div>

              <div class="seneu-datepicker__panels">
                <div v-for="(pane, pi) in panes" :key="pi" class="seneu-datepicker__panel">
                  <!-- Header -->
                  <div class="seneu-datepicker__header">
                    <button
                      v-if="pi === 0"
                      type="button"
                      class="seneu-datepicker__nav"
                      :disabled="viewMode === 'days' && isPrevMonthDisabled"
                      aria-label="Bulan sebelumnya"
                      @click="viewMode === 'years' ? prevYearBlock() : viewMode === 'months' ? prevYear() : prevMonth()"
                    >
                      <SeneuIcon name="chevron_left" :size="18" aria-hidden="true" />
                    </button>
                    <span v-else class="seneu-datepicker__nav-spacer" />

                    <button
                      v-if="viewMode === 'days'"
                      type="button"
                      class="seneu-datepicker__title-btn"
                      :disabled="pi === 1"
                      @click="pi === 0 && openMonthPicker()"
                    >
                      {{ MONTHS_ID[pane.month] }} {{ pane.year }}
                      <SeneuIcon v-if="pi === 0" name="expand_more" :size="16" class="seneu-datepicker__title-chevron" aria-hidden="true" />
                    </button>
                    <button v-else-if="viewMode === 'months'" type="button" class="seneu-datepicker__title-btn" @click="openYearPicker">
                      {{ viewYear }}
                      <SeneuIcon name="expand_more" :size="16" class="seneu-datepicker__title-chevron" aria-hidden="true" />
                    </button>
                    <span v-else class="seneu-datepicker__title-btn seneu-datepicker__title-btn--static">
                      {{ yearBlock[0] }} – {{ yearBlock[11] }}
                    </span>

                    <button
                      v-if="pi === panes.length - 1"
                      type="button"
                      class="seneu-datepicker__nav"
                      :disabled="viewMode === 'days' && isNextMonthDisabled"
                      aria-label="Bulan berikutnya"
                      @click="viewMode === 'years' ? nextYearBlock() : viewMode === 'months' ? nextYear() : nextMonth()"
                    >
                      <SeneuIcon name="chevron_right" :size="18" aria-hidden="true" />
                    </button>
                    <span v-else class="seneu-datepicker__nav-spacer" />
                  </div>

                  <!-- Years view -->
                  <div v-if="viewMode === 'years' && pi === 0" class="seneu-datepicker__year-grid">
                    <button
                      v-for="y in yearBlock" :key="y"
                      type="button"
                      class="seneu-datepicker__year-item"
                      :class="{ 'seneu-datepicker__year-item--current': y === viewYear }"
                      @click="pickYear(y)"
                    >{{ y }}</button>
                  </div>

                  <!-- Months view -->
                  <div v-else-if="viewMode === 'months' && pi === 0" class="seneu-datepicker__month-grid">
                    <button
                      v-for="(m, i) in MONTHS_SHORT_ID" :key="m"
                      type="button"
                      class="seneu-datepicker__month-item"
                      :class="{ 'seneu-datepicker__month-item--current': i === viewMonth }"
                      @click="pickMonth(i)"
                    >{{ m }}</button>
                  </div>

                  <!-- Days view -->
                  <div v-else-if="viewMode === 'days'" class="seneu-datepicker__body">
                    <div class="seneu-datepicker__dow-row">
                      <span v-for="d in weekdayLabels" :key="d" class="seneu-datepicker__dow">{{ d }}</span>
                    </div>
                    <div class="seneu-datepicker__day-grid" role="grid">
                      <button
                        v-for="day in getMonthMatrix(pane.year, pane.month)" :key="dayKey(day.date)"
                        :ref="el => setDayRef(el, dayKey(day.date))"
                        type="button"
                        role="gridcell"
                        class="seneu-datepicker__day"
                        :class="{
                          'seneu-datepicker__day--out':      !day.inMonth,
                          'seneu-datepicker__day--today':    isSameDay(day.date, today()),
                          'seneu-datepicker__day--selected': range ? (isRangeStart(day.date) || isRangeEnd(day.date)) : isSameDay(day.date, selectedDate),
                          'seneu-datepicker__day--in-range': range && isInRange(day.date),
                          'seneu-datepicker__day--disabled': isDateDisabled(day.date),
                        }"
                        :disabled="isDateDisabled(day.date)"
                        :tabindex="isSameDay(day.date, activeDate) ? 0 : -1"
                        :aria-selected="range ? (isRangeStart(day.date) || isRangeEnd(day.date)) : isSameDay(day.date, selectedDate)"
                        :aria-current="isSameDay(day.date, today()) ? 'date' : undefined"
                        @click="activeDate = day.date; selectDay(day.date)"
                        @mouseenter="range && rangeSelecting ? (hoverDate = day.inMonth ? day.date : hoverDate) : null"
                      >{{ day.date.getDate() }}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="seneu-datepicker__footer">
              <span v-if="range" class="seneu-datepicker__status">
                {{ rangeStart && rangeEnd
                  ? `${formatDate(rangeStart)} – ${formatDate(rangeEnd)} · ${rangeDays} hari`
                  : rangeStart ? `Mulai: ${formatDate(rangeStart)} — pilih tanggal selesai` : 'Belum ada rentang dipilih' }}
              </span>
              <span v-else class="seneu-datepicker__status" />
              <div class="seneu-datepicker__footer-actions">
                <button v-if="showToday" type="button" class="seneu-datepicker__text-btn" @click="goToday">Hari ini</button>
                <button v-if="hasValue && clearable" type="button" class="seneu-datepicker__text-btn seneu-datepicker__text-btn--muted" @click="clearValue">Hapus</button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </template>

    <p
      v-if="error || hint"
      :id="`${fieldId}-desc`"
      class="seneu-datepicker__message"
      :class="error ? 'seneu-datepicker__message--error' : 'seneu-datepicker__message--hint'"
    >
      <SeneuIcon v-if="error" name="error" :size="14" aria-hidden="true" />
      {{ error || hint }}
    </p>
  </div>
</template>

<style>
/* ── Root ──────────────────────────────────────────────────── */
.seneu-datepicker {
  display:        flex;
  flex-direction: column;
  gap:            var(--space-component-gap);
}

.seneu-datepicker__label,
.seneu-datepicker__sublabel {
  font-size:   var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color:       var(--color-text-default);
  line-height: var(--line-height-normal);
}

.seneu-datepicker--disabled .seneu-datepicker__label {
  color: var(--color-text-disabled);
}

.seneu-datepicker__row {
  position:    relative;
  display:     flex;
  align-items: flex-end;
  gap:         var(--space-inline-normal);
  flex-wrap:   wrap;
}

.seneu-datepicker__range-field {
  display:        flex;
  flex-direction: column;
  gap:            var(--space-component-gap);
  flex:           1;
  min-width:      160px;
}

.seneu-datepicker__range-arrow {
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

/* ── Wrapper / field (mirrors SeneuInput) ─────────────────────────── */
.seneu-datepicker__wrapper {
  position:      relative;
  display:       flex;
  align-items:   center;
  width:         100%;
  background:    var(--color-surface-raised);
  border:        1px solid var(--color-border-default);
  border-radius: var(--radius-element);
  transition:
    border-color var(--duration-fast) var(--easing-standard),
    box-shadow   var(--duration-fast) var(--easing-standard);
}

.seneu-datepicker__wrapper:hover { border-color: var(--color-border-interactive); }
.seneu-datepicker--error .seneu-datepicker__wrapper:hover { border-color: var(--color-border-danger); }
.seneu-datepicker--disabled .seneu-datepicker__wrapper,
.seneu-datepicker--disabled .seneu-datepicker__wrapper:hover {
  border-color: var(--color-border-default);
  opacity:      var(--opacity-disabled);
  cursor:       not-allowed;
  background:   var(--color-surface-default);
}

.seneu-datepicker__wrapper:focus-within {
  border-color: var(--color-border-focus);
  box-shadow:   0 0 0 3px var(--color-ring-brand);
}
.seneu-datepicker--error .seneu-datepicker__wrapper:focus-within {
  border-color: var(--color-border-danger);
  box-shadow:   0 0 0 3px var(--color-ring-danger);
}

.seneu-datepicker__field {
  flex:        1;
  min-width:   0;
  width:       100%;
  border:      none;
  outline:     none;
  background:  transparent;
  font-family: var(--font-sans);
  color:       var(--color-text-default);
  line-height: var(--line-height-normal);
  cursor:      text;
}

.seneu-datepicker__field::placeholder { color: var(--color-text-muted); }
.seneu-datepicker__field:disabled { cursor: not-allowed; color: var(--color-text-disabled); }

.seneu-datepicker--sm   .seneu-datepicker__field { font-size: var(--font-size-small); padding: 6px 10px;  }
.seneu-datepicker--base .seneu-datepicker__field { font-size: var(--font-size-body);  padding: 9px 12px;  }
.seneu-datepicker--lg   .seneu-datepicker__field { font-size: var(--font-size-lead);  padding: 12px 16px; }

/* Native input */
.seneu-datepicker__wrapper .seneu-datepicker__field[type='date'] { cursor: default; }

/* ── Icon buttons ──────────────────────────────────────────────────── */
.seneu-datepicker__icon-btn {
  display:         flex;
  align-items:     center;
  justify-content: center;
  flex-shrink:     0;
  background:      none;
  border:          none;
  cursor:          pointer;
  color:           var(--color-text-muted);
  padding:         0 10px;
  align-self:      stretch;
  transition:      color var(--duration-fast) var(--easing-standard);
}
.seneu-datepicker__icon-btn:hover { color: var(--color-text-default); }
.seneu-datepicker__icon-btn:disabled { cursor: not-allowed; opacity: var(--opacity-disabled); }
.seneu-datepicker__icon-btn--clear:hover { color: var(--color-text-danger); }

@keyframes seneu-spin { to { transform: rotate(360deg); } }
.seneu-datepicker__spinner { animation: seneu-spin 0.8s linear infinite; }

/* ── Popover ───────────────────────────────────────────────────────── */
.seneu-datepicker__popover {
  position:      absolute;
  top:           calc(100% + 4px);
  left:          0;
  z-index:       var(--z-index-dropdown);
  display:       flex;
  flex-direction: column;
  background:    var(--color-surface-overlay);
  border:        1px solid var(--color-border-default);
  border-radius: var(--radius-container);
  box-shadow:    var(--elevation-floating);
  padding:       var(--primitive-space-4);
}

.seneu-datepicker__body-row {
  display: flex;
  gap:     var(--space-inline-normal);
}

.seneu-datepicker-pop-enter-active { transition: opacity var(--duration-fast) var(--easing-enter), transform var(--duration-fast) var(--easing-enter); }
.seneu-datepicker-pop-leave-active { transition: opacity var(--duration-fast) var(--easing-exit), transform var(--duration-fast) var(--easing-exit); }
.seneu-datepicker-pop-enter-from,
.seneu-datepicker-pop-leave-to { opacity: 0; transform: translateY(-6px); }

/* ── Presets ───────────────────────────────────────────────────────── */
.seneu-datepicker__presets {
  display:        flex;
  flex-direction: column;
  gap:            2px;
  padding-right:  var(--primitive-space-3);
  border-right:   1px solid var(--color-border-default);
  min-width:      140px;
}

.seneu-datepicker__preset-btn {
  text-align:    left;
  background:    none;
  border:        none;
  border-radius: var(--radius-element);
  padding:       8px 10px;
  font-family:   var(--font-sans);
  font-size:     var(--font-size-small);
  color:         var(--color-text-default);
  cursor:        pointer;
  white-space:   nowrap;
  transition:    background-color var(--duration-fast) var(--easing-standard);
}
.seneu-datepicker__preset-btn:hover { background: var(--color-surface-brand-subtle); }

/* ── Panels ────────────────────────────────────────────────────────── */
.seneu-datepicker__panels {
  display: flex;
  gap:     var(--primitive-space-4);
}

.seneu-datepicker__panel { width: 248px; }

/* ── Header ────────────────────────────────────────────────────────── */
.seneu-datepicker__header {
  display:         flex;
  align-items:     center;
  justify-content: space-between;
  gap:             4px;
  margin-bottom:   var(--primitive-space-3);
}

.seneu-datepicker__nav,
.seneu-datepicker__nav-spacer {
  width:  28px;
  height: 28px;
  flex-shrink: 0;
}

.seneu-datepicker__nav {
  display:         flex;
  align-items:     center;
  justify-content: center;
  border:          none;
  background:      transparent;
  border-radius:   var(--radius-element);
  cursor:          pointer;
  color:           var(--color-text-default);
  transition:      background-color var(--duration-fast) var(--easing-standard);
}
.seneu-datepicker__nav:hover:not(:disabled) { background: var(--color-surface-brand-subtle); }
.seneu-datepicker__nav:disabled { opacity: var(--opacity-disabled); cursor: not-allowed; }

.seneu-datepicker__title-btn {
  display:         inline-flex;
  align-items:     center;
  justify-content: center;
  gap:             2px;
  flex:            1;
  background:      transparent;
  border:          none;
  cursor:          pointer;
  font-family:     var(--font-sans);
  font-size:       var(--font-size-small);
  font-weight:     var(--font-weight-semibold);
  color:           var(--color-text-default);
  border-radius:   var(--radius-element);
  padding:         4px 6px;
  transition:      background-color var(--duration-fast) var(--easing-standard);
}
.seneu-datepicker__title-btn:not(:disabled):hover { background: var(--color-surface-brand-subtle); }
.seneu-datepicker__title-btn:disabled,
.seneu-datepicker__title-btn--static { cursor: default; color: var(--color-text-muted); }
.seneu-datepicker__title-chevron { color: var(--color-text-muted); }

/* ── Years / months grid ───────────────────────────────────────────── */
.seneu-datepicker__year-grid,
.seneu-datepicker__month-grid {
  display:               grid;
  grid-template-columns: repeat(3, 1fr);
  gap:                   4px;
  padding:               4px 0;
}

.seneu-datepicker__year-item,
.seneu-datepicker__month-item {
  padding:       10px 4px;
  border:        none;
  background:    transparent;
  border-radius: var(--radius-element);
  font-family:   var(--font-sans);
  font-size:     var(--font-size-small);
  color:         var(--color-text-default);
  cursor:        pointer;
  text-align:    center;
  transition:    background-color var(--duration-fast) var(--easing-standard);
}
.seneu-datepicker__year-item:hover,
.seneu-datepicker__month-item:hover { background: var(--color-surface-brand-subtle); }
.seneu-datepicker__year-item--current,
.seneu-datepicker__month-item--current {
  background:  var(--color-surface-brand);
  color:       var(--color-text-on-brand);
  font-weight: var(--font-weight-semibold);
}

/* ── Day grid ──────────────────────────────────────────────────────── */
.seneu-datepicker__dow-row {
  display:               grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom:         4px;
}
.seneu-datepicker__dow {
  text-align:  center;
  font-size:   var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color:       var(--color-text-muted);
  padding:     4px 0;
}

.seneu-datepicker__day-grid {
  display:               grid;
  grid-template-columns: repeat(7, 1fr);
  gap:                   2px;
}

.seneu-datepicker--range .seneu-datepicker__day-grid { gap: 0; }
.seneu-datepicker--range .seneu-datepicker__day--in-range { border-radius: var(--radius-none); }

.seneu-datepicker__day {
  aspect-ratio:  1;
  display:       flex;
  align-items:   center;
  justify-content: center;
  border:        1px solid transparent;
  background:    transparent;
  border-radius: var(--radius-element);
  font-family:   var(--font-sans);
  font-size:     var(--font-size-small);
  color:         var(--color-text-default);
  cursor:        pointer;
  transition:
    background-color var(--duration-fast) var(--easing-standard),
    color             var(--duration-fast) var(--easing-standard);
}
.seneu-datepicker__day:hover:not(:disabled):not(.seneu-datepicker__day--selected) { background: var(--color-surface-brand-subtle); }
.seneu-datepicker__day:focus-visible {
  outline:        2px solid var(--color-border-focus);
  outline-offset: 1px;
}
.seneu-datepicker__day--out { color: var(--color-text-disabled); }
.seneu-datepicker__day--today {
  border-color: var(--color-border-brand);
  color:        var(--color-text-brand);
  font-weight:  var(--font-weight-bold);
}
.seneu-datepicker__day--selected {
  background:   var(--color-surface-brand);
  color:        var(--color-text-on-brand);
  border-color: var(--color-surface-brand);
  font-weight:  var(--font-weight-semibold);
}
.seneu-datepicker__day--in-range {
  background:    var(--color-surface-brand-subtle);
  color:         var(--color-text-brand);
  border-radius: var(--radius-none);
}
.seneu-datepicker__day--disabled { opacity: var(--opacity-disabled); cursor: not-allowed; }

/* ── Footer ────────────────────────────────────────────────────────── */
.seneu-datepicker__footer {
  display:         flex;
  align-items:     center;
  justify-content: space-between;
  gap:             var(--space-inline-normal);
  margin-top:      var(--primitive-space-3);
  padding-top:     var(--primitive-space-3);
  border-top:      1px solid var(--color-border-default);
}

.seneu-datepicker__status {
  font-size: var(--font-size-xs);
  color:     var(--color-text-muted);
}

.seneu-datepicker__footer-actions { display: flex; gap: var(--space-inline-tight); flex-shrink: 0; }

.seneu-datepicker__text-btn {
  background:    none;
  border:        none;
  cursor:        pointer;
  font-family:   var(--font-sans);
  font-size:     var(--font-size-small);
  font-weight:   var(--font-weight-semibold);
  color:         var(--color-text-brand);
  padding:       4px 8px;
  border-radius: var(--radius-element);
  transition:    background-color var(--duration-fast) var(--easing-standard);
}
.seneu-datepicker__text-btn:hover { background: var(--color-surface-brand-subtle); }
.seneu-datepicker__text-btn--muted { color: var(--color-text-muted); }

/* ── Message line ──────────────────────────────────────────────────── */
.seneu-datepicker__message {
  display:     flex;
  align-items: center;
  gap:         4px;
  font-size:   var(--font-size-small);
  line-height: var(--line-height-normal);
}
.seneu-datepicker__message--hint  { color: var(--color-text-muted);  }
.seneu-datepicker__message--error { color: var(--color-text-danger); }

/* ── Responsive ────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .seneu-datepicker__row { flex-direction: column; align-items: stretch; }
  .seneu-datepicker__range-arrow { display: none; }
  .seneu-datepicker__popover { left: 0; right: 0; }
  .seneu-datepicker__body-row { flex-direction: column; }
  .seneu-datepicker__panels { flex-direction: column; }
  .seneu-datepicker__panel { width: 100%; }
  .seneu-datepicker__presets {
    flex-direction: row;
    flex-wrap:      wrap;
    border-right:   none;
    border-bottom:  1px solid var(--color-border-default);
    padding-right:  0;
    padding-bottom: var(--primitive-space-3);
    min-width:      0;
  }
}

/* ── Reduced motion ────────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .seneu-datepicker__spinner { animation-duration: 0.01ms; }
}
</style>
