<script setup>
import { ref, computed, useId, onMounted, onUnmounted } from 'vue'
import SeneuIcon from '../display/SeneuIcon.vue'

defineOptions({ inheritAttrs: false })

/**
 * Search input with autocomplete dropdown, grouped suggestions,
 * recent-search history, and a non-editable "trigger" variant for
 * launching a command-palette-style search elsewhere (⌘K).
 * Recent searches are a controlled prop — persistence is up to
 * the consumer (localStorage, API, session, …).
 */
const props = defineProps({
  /** Bound value — use with v-model */
  modelValue: { type: String, default: '' },
  /** Placeholder text */
  placeholder: { type: String, default: 'Cari…' },
  /** 'default' — full width. 'compact' — narrower, for toolbars. 'trigger' — read-only button that emits @trigger */
  variant: {
    type: String,
    default: 'default',
    validator: v => ['default', 'compact', 'trigger'].includes(v),
  },
  /** Keyboard shortcut badge (e.g. "⌘K") — shown in trigger variant, or next to the input otherwise */
  shortcut: { type: String, default: '' },
  /** Suggestions to show while typing — [{ label, sub, type, icon }] */
  suggestions: { type: Array, default: () => [] },
  /** Controlled recent-search list — [String], shown when the field is empty */
  recentSearches: { type: Array, default: () => [] },
  /** Shows the recent-searches section when the query is empty */
  showRecent: { type: Boolean, default: true },
  /** Minimum characters typed before suggestions are shown */
  minChars: { type: Number, default: 0 },
  /** Debounces the `search` event while typing, in ms — 0 disables auto-search (Enter still works) */
  debounce: { type: Number, default: 0 },
  /** Label shown above the field */
  label: { type: String, default: '' },
  /** Helper text shown below the field */
  hint: { type: String, default: '' },
  /** Error message — sets error state when non-empty */
  error: { type: String, default: '' },
  /** Shows a spinner instead of the search icon — for async search */
  loading: { type: Boolean, default: false },
  /** Disables the field entirely */
  disabled: { type: Boolean, default: false },
  /** Shows the × button to clear a non-empty value */
  clearable: { type: Boolean, default: true },
  /** Controls padding and font-size */
  size: {
    type: String,
    default: 'base',
    validator: v => ['sm', 'base', 'lg'].includes(v),
  },
  /** Explicit id — auto-generated when omitted */
  id: { type: String, default: '' },
})

const emit = defineEmits([
  'update:modelValue', 'update:recentSearches',
  'search', 'select', 'clear', 'trigger', 'focus', 'blur',
])

const _uid = useId()
const fieldId = computed(() => props.id || _uid)
const listboxId = computed(() => `${fieldId.value}-listbox`)

const iconSize = computed(() => ({ sm: 16, base: 18, lg: 20 }[props.size]))

const wrapRef  = ref(null)
const inputRef = ref(null)
const isOpen   = ref(false)
const activeIdx = ref(-1)
let debounceTimer = null
let blurTimer = null

const groups = computed(() => {
  const map = new Map()
  for (const item of props.suggestions) {
    if (!map.has(item.type)) map.set(item.type, [])
    map.get(item.type).push(item)
  }
  return Array.from(map, ([type, items]) => ({ type, items }))
})
const flatItems = computed(() => groups.value.flatMap(g => g.items))

const showingRecent = computed(() => !props.modelValue.trim() && props.showRecent)
const belowMinChars = computed(() => props.modelValue.trim().length < props.minChars && props.modelValue.trim().length > 0)
const activeItems = computed(() => showingRecent.value
  ? props.recentSearches.map(label => ({ label, isRecent: true }))
  : flatItems.value)

function activeOptionId(idx) { return idx >= 0 ? `${fieldId.value}-opt-${idx}` : undefined }

function openDropdown() {
  if (props.disabled) return
  isOpen.value = true
}
function closeDropdown() {
  isOpen.value = false
  activeIdx.value = -1
}

function onInput(e) {
  const val = e.target.value
  emit('update:modelValue', val)
  activeIdx.value = -1
  openDropdown()

  if (props.debounce > 0) {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => emit('search', val), props.debounce)
  }
}

function onFocus(e) {
  openDropdown()
  emit('focus', e)
}
function onBlur(e) {
  blurTimer = setTimeout(closeDropdown, 150)
  emit('blur', e)
}

function onClear() {
  emit('update:modelValue', '')
  emit('clear')
  activeIdx.value = -1
  inputRef.value?.focus()
}

function selectSuggestion(item) {
  pushRecent(item.label)
  emit('update:modelValue', item.label)
  emit('select', item)
  closeDropdown()
}
function selectRecent(label) {
  emit('update:modelValue', label)
  emit('select', { label })
  closeDropdown()
}
function removeRecent(label) {
  emit('update:recentSearches', props.recentSearches.filter(r => r !== label))
}
function clearAllRecent() {
  emit('update:recentSearches', [])
}
function pushRecent(label) {
  if (!label || props.recentSearches.includes(label)) return
  emit('update:recentSearches', [label, ...props.recentSearches].slice(0, 8))
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    if (isOpen.value) { closeDropdown(); return }
    inputRef.value?.blur()
    return
  }
  if (!isOpen.value) {
    openDropdown()
    return
  }
  const items = activeItems.value
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIdx.value = Math.min(activeIdx.value + 1, items.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIdx.value = Math.max(activeIdx.value - 1, -1)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    clearTimeout(blurTimer)
    const item = items[activeIdx.value]
    if (item) { item.isRecent ? selectRecent(item.label) : selectSuggestion(item) }
    else { pushRecent(props.modelValue.trim()); emit('search', props.modelValue); closeDropdown() }
  }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function highlight(text) {
  const q = props.modelValue.trim()
  const idx = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1
  if (idx === -1) return escapeHtml(text)
  const before = escapeHtml(text.slice(0, idx))
  const match  = escapeHtml(text.slice(idx, idx + q.length))
  const after  = escapeHtml(text.slice(idx + q.length))
  return `${before}<mark class="seneu-searchbar__highlight">${match}</mark>${after}`
}

function handleOutside(e) {
  if (wrapRef.value && !wrapRef.value.contains(e.target)) closeDropdown()
}
onMounted(() => document.addEventListener('pointerdown', handleOutside))
onUnmounted(() => {
  document.removeEventListener('pointerdown', handleOutside)
  clearTimeout(debounceTimer)
  clearTimeout(blurTimer)
})
</script>

<template>
  <div ref="wrapRef" class="seneu-searchbar" :class="`seneu-searchbar--${size}`">
    <label v-if="label" :for="fieldId" class="seneu-searchbar__label">{{ label }}</label>

    <!-- Trigger variant -->
    <button
      v-if="variant === 'trigger'"
      type="button"
      class="seneu-searchbar__wrapper seneu-searchbar__wrapper--trigger"
      :disabled="disabled"
      @click="$emit('trigger')"
    >
      <SeneuIcon name="search" :size="iconSize" class="seneu-searchbar__icon" aria-hidden="true" />
      <span class="seneu-searchbar__trigger-text">{{ placeholder }}</span>
      <kbd v-if="shortcut" class="seneu-searchbar__kbd">{{ shortcut }}</kbd>
    </button>

    <!-- Default / compact input -->
    <template v-else>
      <div
        class="seneu-searchbar__wrapper"
        :class="{
          'seneu-searchbar--compact':  variant === 'compact',
          'seneu-searchbar__wrapper--error': !!error,
          'seneu-searchbar__wrapper--disabled': disabled,
        }"
      >
        <SeneuIcon
          :name="loading ? 'progress_activity' : 'search'"
          :size="iconSize"
          class="seneu-searchbar__icon"
          :class="{ 'seneu-searchbar__icon--active': isOpen, 'seneu-searchbar__icon--spin': loading }"
          aria-hidden="true"
        />

        <input
          :id="fieldId"
          ref="inputRef"
          type="text"
          class="seneu-searchbar__input"
          role="combobox"
          aria-autocomplete="list"
          :aria-expanded="isOpen"
          :aria-controls="listboxId"
          :aria-activedescendant="activeOptionId(activeIdx)"
          :aria-describedby="(hint || error) ? `${fieldId}-desc` : undefined"
          :placeholder="placeholder"
          :disabled="disabled"
          :value="modelValue"
          autocomplete="off"
          v-bind="$attrs"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
          @keydown="onKeydown"
        />

        <kbd v-if="shortcut && !modelValue" class="seneu-searchbar__kbd">{{ shortcut }}</kbd>

        <button
          v-if="clearable && modelValue && !disabled"
          type="button"
          class="seneu-searchbar__clear"
          aria-label="Bersihkan pencarian"
          @mousedown.prevent
          @click="onClear"
        >
          <SeneuIcon name="close" :size="iconSize" aria-hidden="true" />
        </button>
      </div>

      <!-- Dropdown -->
      <Transition name="seneu-searchbar-drop">
        <div v-if="isOpen" :id="listboxId" class="seneu-searchbar__dropdown" role="listbox">
          <template v-if="showingRecent">
            <div class="seneu-searchbar__group-header">
              <span>Pencarian terbaru</span>
              <button
                v-if="recentSearches.length"
                type="button"
                class="seneu-searchbar__clear-recent"
                @mousedown.prevent
                @click="clearAllRecent"
              >Hapus semua</button>
            </div>
            <p v-if="!recentSearches.length" class="seneu-searchbar__empty">Belum ada pencarian terbaru</p>
            <div
              v-for="(r, i) in recentSearches" :id="activeOptionId(i)"
              :key="r"
              class="seneu-searchbar__item"
              :class="{ 'seneu-searchbar__item--active': activeIdx === i }"
              role="option"
              :aria-selected="activeIdx === i"
              @mousedown.prevent
              @click="selectRecent(r)"
            >
              <SeneuIcon name="history" :size="16" class="seneu-searchbar__item-icon" aria-hidden="true" />
              <span class="seneu-searchbar__item-label">{{ r }}</span>
              <button
                type="button"
                class="seneu-searchbar__item-remove"
                :aria-label="`Hapus '${r}' dari riwayat`"
                @mousedown.prevent
                @click.stop="removeRecent(r)"
              >
                <SeneuIcon name="close" :size="14" aria-hidden="true" />
              </button>
            </div>
          </template>

          <template v-else-if="belowMinChars">
            <p class="seneu-searchbar__empty">Ketik minimal {{ minChars }} karakter buat cari</p>
          </template>

          <template v-else-if="groups.length">
            <template v-for="group in groups" :key="group.type">
              <div class="seneu-searchbar__group-header">{{ group.type }}</div>
              <button
                v-for="item in group.items" :id="activeOptionId(flatItems.indexOf(item))"
                :key="item.label"
                type="button"
                class="seneu-searchbar__item"
                :class="{ 'seneu-searchbar__item--active': flatItems.indexOf(item) === activeIdx }"
                role="option"
                :aria-selected="flatItems.indexOf(item) === activeIdx"
                @mousedown.prevent
                @click="selectSuggestion(item)"
              >
                <SeneuIcon v-if="item.icon" :name="item.icon" :size="18" class="seneu-searchbar__item-icon" aria-hidden="true" />
                <span class="seneu-searchbar__item-body">
                  <span class="seneu-searchbar__item-label" v-html="highlight(item.label)" />
                  <span v-if="item.sub" class="seneu-searchbar__item-sub">{{ item.sub }}</span>
                </span>
                <span v-if="item.type" class="seneu-searchbar__item-type">{{ item.type }}</span>
              </button>
            </template>
          </template>

          <div v-else class="seneu-searchbar__empty seneu-searchbar__empty--noresult">
            <SeneuIcon name="search_off" :size="28" aria-hidden="true" />
            Nggak ada hasil buat "<strong>{{ modelValue }}</strong>"
          </div>
        </div>
      </Transition>
    </template>

    <p
      v-if="error || hint"
      :id="`${fieldId}-desc`"
      class="seneu-searchbar__message"
      :class="error ? 'seneu-searchbar__message--error' : 'seneu-searchbar__message--hint'"
    >
      <SeneuIcon v-if="error" name="error" :size="14" aria-hidden="true" />
      {{ error || hint }}
    </p>
  </div>
</template>

<style>
/* ── Root ──────────────────────────────────────────────────── */
.seneu-searchbar {
  display:        flex;
  flex-direction: column;
  gap:            var(--space-component-gap);
  position:       relative;
}

.seneu-searchbar__label {
  font-size:   var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color:       var(--color-text-default);
  line-height: var(--line-height-normal);
}

/* ── Wrapper ───────────────────────────────────────────────── */
.seneu-searchbar__wrapper {
  position:      relative;
  display:       flex;
  align-items:   center;
  gap:           var(--space-inline-tight);
  width:         100%;
  background:    var(--color-surface-raised);
  border:        1px solid var(--color-border-default);
  border-radius: var(--radius-element);
  transition:
    border-color var(--duration-fast) var(--easing-standard),
    box-shadow   var(--duration-fast) var(--easing-standard);
}
.seneu-searchbar--compact { max-width: 260px; }

.seneu-searchbar__wrapper:hover { border-color: var(--color-border-interactive); }
.seneu-searchbar__wrapper--error:hover { border-color: var(--color-border-danger); }
.seneu-searchbar__wrapper:focus-within {
  border-color: var(--color-border-focus);
  box-shadow:   0 0 0 3px var(--color-ring-brand);
}
.seneu-searchbar__wrapper--error {
  border-color: var(--color-border-danger);
}
.seneu-searchbar__wrapper--error:focus-within {
  box-shadow: 0 0 0 3px var(--color-ring-danger);
}
.seneu-searchbar__wrapper--disabled {
  opacity:    var(--opacity-disabled);
  cursor:     not-allowed;
  background: var(--color-surface-default);
}

.seneu-searchbar--sm   .seneu-searchbar__wrapper { padding: 0 10px; }
.seneu-searchbar--base .seneu-searchbar__wrapper { padding: 0 12px; }
.seneu-searchbar--lg   .seneu-searchbar__wrapper { padding: 0 16px; }

/* Trigger variant renders as a <button> */
.seneu-searchbar__wrapper--trigger {
  cursor:      pointer;
  font-family: var(--font-sans);
  text-align:  left;
}
.seneu-searchbar__wrapper--trigger:hover { border-color: var(--color-border-interactive); }
.seneu-searchbar__wrapper--trigger:focus-visible {
  outline:        2px solid var(--color-border-focus);
  outline-offset: 2px;
}
.seneu-searchbar__wrapper--trigger:disabled { opacity: var(--opacity-disabled); cursor: not-allowed; }

/* ── Icon ──────────────────────────────────────────────────── */
.seneu-searchbar__icon {
  color:       var(--color-text-muted);
  flex-shrink: 0;
  transition:  color var(--duration-fast) var(--easing-standard);
}
.seneu-searchbar__icon--active { color: var(--color-text-brand); }
.seneu-searchbar__icon--spin   { animation: seneu-searchbar-spin 0.8s linear infinite; }
@keyframes seneu-searchbar-spin { to { transform: rotate(360deg); } }

/* ── Input ─────────────────────────────────────────────────── */
.seneu-searchbar__input {
  flex:        1;
  min-width:   0;
  border:      none;
  outline:     none;
  background:  transparent;
  font-family: var(--font-sans);
  color:       var(--color-text-default);
}
.seneu-searchbar--sm   .seneu-searchbar__input { font-size: var(--font-size-small); padding: 6px 0;  }
.seneu-searchbar--base .seneu-searchbar__input { font-size: var(--font-size-body);  padding: 9px 0;  }
.seneu-searchbar--lg   .seneu-searchbar__input { font-size: var(--font-size-lead);  padding: 12px 0; }
.seneu-searchbar__input::placeholder { color: var(--color-text-muted); }
.seneu-searchbar__input:disabled { cursor: not-allowed; color: var(--color-text-disabled); }

.seneu-searchbar__trigger-text {
  flex:      1;
  font-size: var(--font-size-body);
  color:     var(--color-text-muted);
  padding:   9px 0;
}

/* ── Clear button ──────────────────────────────────────────── */
.seneu-searchbar__clear {
  display:         flex;
  align-items:     center;
  justify-content: center;
  border:          none;
  background:      transparent;
  border-radius:   var(--radius-circle);
  cursor:          pointer;
  color:           var(--color-text-muted);
  flex-shrink:     0;
  padding:         2px;
  transition:      color var(--duration-fast) var(--easing-standard);
}
.seneu-searchbar__clear:hover { color: var(--color-text-default); }

/* ── Shortcut badge ────────────────────────────────────────── */
.seneu-searchbar__kbd {
  display:         inline-flex;
  align-items:     center;
  padding:         2px 6px;
  font-family:     var(--font-sans);
  font-size:       var(--font-size-xs);
  font-weight:     var(--font-weight-semibold);
  color:           var(--color-text-muted);
  background:      var(--color-surface-default);
  border:          1px solid var(--color-border-default);
  border-radius:   var(--radius-subtle);
  flex-shrink:     0;
  user-select:     none;
}

/* ── Dropdown ──────────────────────────────────────────────── */
.seneu-searchbar__dropdown {
  position:       absolute;
  top:            calc(100% + 4px);
  left:           0;
  right:          0;
  z-index:        var(--z-index-dropdown);
  background:     var(--color-surface-overlay);
  border:         1px solid var(--color-border-default);
  border-radius:  var(--radius-container);
  box-shadow:     var(--elevation-floating);
  overflow-y:     auto;
  max-height:     340px;
  padding:        4px;
}

.seneu-searchbar__group-header {
  display:         flex;
  align-items:     center;
  justify-content: space-between;
  padding:         8px 10px 4px;
  font-size:       var(--font-size-xs);
  font-weight:     var(--font-weight-semibold);
  text-transform:  uppercase;
  letter-spacing:  var(--letter-spacing-wide);
  color:           var(--color-text-muted);
}

.seneu-searchbar__clear-recent {
  background:     none;
  border:         none;
  cursor:         pointer;
  font-family:    var(--font-sans);
  font-size:      var(--font-size-xs);
  font-weight:    var(--font-weight-semibold);
  color:          var(--color-text-brand);
  text-transform: none;
  letter-spacing: normal;
}

.seneu-searchbar__item {
  display:       flex;
  align-items:   center;
  gap:           var(--space-inline-tight);
  width:         100%;
  padding:       8px 10px;
  border:        none;
  background:    transparent;
  border-radius: var(--radius-element);
  cursor:        pointer;
  text-align:    left;
  font-family:   var(--font-sans);
  transition:    background-color var(--duration-fast) var(--easing-standard);
}
.seneu-searchbar__item:hover,
.seneu-searchbar__item--active { background: var(--color-surface-brand-subtle); }

.seneu-searchbar__item-icon { color: var(--color-text-muted); flex-shrink: 0; }
.seneu-searchbar__item-body { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.seneu-searchbar__item-label {
  font-size:     var(--font-size-small);
  font-weight:   var(--font-weight-medium);
  color:         var(--color-text-default);
  white-space:   nowrap;
  overflow:      hidden;
  text-overflow: ellipsis;
}
.seneu-searchbar__item-sub  { font-size: var(--font-size-xs); color: var(--color-text-muted); }
.seneu-searchbar__item-type {
  font-size:   var(--font-size-xs);
  color:       var(--color-text-muted);
  flex-shrink: 0;
}

.seneu-searchbar__item-remove {
  display:         flex;
  align-items:     center;
  justify-content: center;
  border:          none;
  background:      transparent;
  border-radius:   var(--radius-circle);
  cursor:          pointer;
  color:           var(--color-text-muted);
  flex-shrink:     0;
  padding:         3px;
  transition:      background-color var(--duration-fast) var(--easing-standard);
}
.seneu-searchbar__item-remove:hover { background: var(--color-surface-raised-hover); }

/* ── Highlight ─────────────────────────────────────────────── */
.seneu-searchbar__highlight {
  background:    var(--color-surface-brand-subtle);
  color:         var(--color-text-brand);
  font-weight:   var(--font-weight-bold);
  border-radius: var(--radius-subtle);
  padding:       0 1px;
}

/* ── Empty state ───────────────────────────────────────────── */
.seneu-searchbar__empty {
  display:        flex;
  flex-direction: column;
  align-items:    center;
  gap:            6px;
  padding:        24px 16px;
  font-size:      var(--font-size-small);
  color:          var(--color-text-muted);
  text-align:     center;
}

/* ── Message line ──────────────────────────────────────────── */
.seneu-searchbar__message {
  display:     flex;
  align-items: center;
  gap:         4px;
  font-size:   var(--font-size-small);
  line-height: var(--line-height-normal);
}
.seneu-searchbar__message--hint  { color: var(--color-text-muted);  }
.seneu-searchbar__message--error { color: var(--color-text-danger); }

/* ── Dropdown transition ───────────────────────────────────── */
.seneu-searchbar-drop-enter-active { transition: opacity var(--duration-fast) var(--easing-enter), transform var(--duration-fast) var(--easing-enter); }
.seneu-searchbar-drop-leave-active { transition: opacity var(--duration-fast) var(--easing-exit), transform var(--duration-fast) var(--easing-exit); }
.seneu-searchbar-drop-enter-from,
.seneu-searchbar-drop-leave-to { opacity: 0; transform: translateY(-6px); }

/* ── Reduced motion ────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .seneu-searchbar__icon--spin { animation-duration: 0.01ms; }
}
</style>
