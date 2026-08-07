<script setup>
import { ref, computed, reactive, onMounted, onBeforeUnmount, watch, nextTick, useId } from 'vue'
import SeneuIcon from '../display/SeneuIcon.vue'

/**
 * WYSIWYG rich text editor built on native contenteditable + execCommand —
 * no Tiptap/Quill dependency. v-model binds the HTML string. Covers the
 * standard basics: bold/italic/underline/strikethrough, headings,
 * bullet/numbered lists, blockquote, alignment, links, undo/redo, and
 * clear formatting.
 */
const props = defineProps({
  /** HTML content — use with v-model */
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Start writing…',
  },
  hint: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  /** Makes the content non-editable but still visible/selectable — toolbar is hidden */
  readonly: {
    type: Boolean,
    default: false,
  },
  /** Shows shimmer placeholders instead of the toolbar and editor */
  loading: {
    type: Boolean,
    default: false,
  },
  /** Shows a live word/character counter below the editor */
  showCounter: {
    type: Boolean,
    default: false,
  },
  minHeight: {
    type: [String, Number],
    default: 180,
  },
  id: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur'])

const _uid = useId()
const editorId = computed(() => props.id || _uid)

const editorRef = ref(null)
const toolbarRef = ref(null)
const isFocused = ref(false)
const htmlContent = ref(props.modelValue || '')

const INLINE_BUTTONS = [
  { cmd: 'bold', icon: 'format_bold', label: 'Bold' },
  { cmd: 'italic', icon: 'format_italic', label: 'Italic' },
  { cmd: 'underline', icon: 'format_underlined', label: 'Underline' },
  { cmd: 'strikeThrough', icon: 'strikethrough_s', label: 'Strikethrough' },
]
const LIST_BUTTONS = [
  { cmd: 'insertUnorderedList', icon: 'format_list_bulleted', label: 'Bullet list' },
  { cmd: 'insertOrderedList', icon: 'format_list_numbered', label: 'Numbered list' },
]
const ALIGN_BUTTONS = [
  { cmd: 'justifyLeft', icon: 'format_align_left', label: 'Align left' },
  { cmd: 'justifyCenter', icon: 'format_align_center', label: 'Align center' },
  { cmd: 'justifyRight', icon: 'format_align_right', label: 'Align right' },
]
const BLOCK_OPTIONS = [
  { value: 'p', label: 'Paragraph' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'blockquote', label: 'Quote' },
]

const formatState = reactive({
  bold: false,
  italic: false,
  underline: false,
  strikeThrough: false,
  insertUnorderedList: false,
  insertOrderedList: false,
  justifyLeft: false,
  justifyCenter: false,
  justifyRight: false,
})
const currentBlock = ref('p')
const blockMenuOpen = ref(false)
const linkPopoverOpen = ref(false)
const linkUrl = ref('')
const linkInputRef = ref(null)
let savedRange = null

// ─── Content sync ───────────────────────────────────────────────────────────
function isEditable() {
  return !props.disabled && !props.readonly
}

function htmlToText(html) {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || ''
}

function syncFromProp(val) {
  const next = val || ''
  if (editorRef.value && editorRef.value.innerHTML !== next) {
    editorRef.value.innerHTML = next
  }
  htmlContent.value = next
}

onMounted(() => syncFromProp(props.modelValue))
watch(() => props.modelValue, (val) => {
  if (val !== htmlContent.value) syncFromProp(val)
})

function onInput() {
  const html = editorRef.value.innerHTML
  htmlContent.value = html
  emit('update:modelValue', html)
  updateActiveFormats()
}

const isEmpty = computed(() => htmlToText(htmlContent.value).trim().length === 0)
const wordCount = computed(() => {
  const text = htmlToText(htmlContent.value).trim()
  return text ? text.split(/\s+/).length : 0
})
const charCount = computed(() => htmlToText(htmlContent.value).length)

// ─── Formatting commands ────────────────────────────────────────────────────
const LIST_COMMANDS = new Set(['insertUnorderedList', 'insertOrderedList'])

// execCommand collapses the cursor to the start of the affected <li> after
// converting a line into a list, instead of preserving where it was — a
// long-standing browser quirk. Move it back to the end of that text node so
// pressing Enter to continue the list behaves as expected.
function fixListCursor() {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return
  const node = sel.anchorNode
  if (node && node.nodeType === Node.TEXT_NODE) {
    const range = document.createRange()
    range.setStart(node, node.textContent.length)
    range.collapse(true)
    sel.removeAllRanges()
    sel.addRange(range)
  }
}

function exec(command, value = null) {
  if (!isEditable()) return
  editorRef.value.focus()
  document.execCommand(command, false, value)
  if (LIST_COMMANDS.has(command)) fixListCursor()
  onInput()
}

function updateActiveFormats() {
  if (!editorRef.value) return
  for (const key of Object.keys(formatState)) {
    try { formatState[key] = document.queryCommandState(key) } catch { /* unsupported in this browser */ }
  }
  try {
    const block = document.queryCommandValue('formatBlock')
    currentBlock.value = block ? block.toLowerCase() : 'p'
  } catch {
    currentBlock.value = 'p'
  }
}

function applyBlock(value) {
  if (!isEditable()) return
  editorRef.value.focus()
  document.execCommand('formatBlock', false, `<${value}>`)
  blockMenuOpen.value = false
  onInput()
}

const currentBlockLabel = computed(() => {
  const match = BLOCK_OPTIONS.find(o => o.value === currentBlock.value)
  return match ? match.label : 'Paragraph'
})

// ─── Link popover ───────────────────────────────────────────────────────────
function openLinkPopover() {
  if (!isEditable()) return
  const sel = window.getSelection()
  if (sel && sel.rangeCount > 0 && editorRef.value.contains(sel.anchorNode)) {
    savedRange = sel.getRangeAt(0).cloneRange()
  } else {
    savedRange = null
  }
  linkUrl.value = ''
  linkPopoverOpen.value = true
  blockMenuOpen.value = false
  nextTick(() => linkInputRef.value?.focus())
}

function confirmLink() {
  if (!linkUrl.value.trim()) { closeLinkPopover(); return }
  editorRef.value.focus()
  if (savedRange) {
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(savedRange)
  }
  document.execCommand('createLink', false, linkUrl.value.trim())
  closeLinkPopover()
  onInput()
}

function closeLinkPopover() {
  linkPopoverOpen.value = false
  savedRange = null
}

function removeLink() {
  exec('unlink')
}

// ─── Focus / blur ───────────────────────────────────────────────────────────
function onFocus(e) {
  isFocused.value = true
  emit('focus', e)
}
function onBlur(e) {
  isFocused.value = false
  blockMenuOpen.value = false
  emit('blur', e)
  emit('change', htmlContent.value)
}

function onClickOutside(e) {
  if (toolbarRef.value && !toolbarRef.value.contains(e.target)) {
    blockMenuOpen.value = false
    if (linkPopoverOpen.value) closeLinkPopover()
  }
}
onMounted(() => document.addEventListener('mousedown', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))

function onEditorKeydown(e) {
  if (e.key === 'Escape') editorRef.value.blur()
}
</script>

<template>
  <div
    class="seneu-rte"
    :class="{
      'seneu-rte--error': !!error,
      'seneu-rte--disabled': disabled,
      'seneu-rte--readonly': readonly,
      'seneu-rte--focused': isFocused,
    }"
  >
    <label v-if="label" :for="editorId" class="seneu-rte__label">{{ label }}</label>

    <div v-if="loading" class="seneu-rte__skeleton">
      <div class="seneu-rte__skeleton-toolbar">
        <span v-for="n in 8" :key="n" class="seneu-rte__skeleton-btn" />
      </div>
      <div class="seneu-rte__skeleton-body">
        <span class="seneu-rte__skeleton-line" style="width: 90%" />
        <span class="seneu-rte__skeleton-line" style="width: 75%" />
        <span class="seneu-rte__skeleton-line" style="width: 82%" />
      </div>
    </div>

    <div v-else class="seneu-rte__wrapper">
      <div
        v-if="!readonly"
        ref="toolbarRef"
        class="seneu-rte__toolbar"
        role="toolbar"
        aria-label="Formatting options"
        @mousedown.prevent
      >
        <button type="button" class="seneu-rte__btn" :disabled="disabled" title="Undo" aria-label="Undo" @click="exec('undo')">
          <SeneuIcon name="undo" :size="18" />
        </button>
        <button type="button" class="seneu-rte__btn" :disabled="disabled" title="Redo" aria-label="Redo" @click="exec('redo')">
          <SeneuIcon name="redo" :size="18" />
        </button>

        <span class="seneu-rte__sep" aria-hidden="true" />

        <div class="seneu-rte__block-menu">
          <button
            type="button"
            class="seneu-rte__btn seneu-rte__btn--block"
            :disabled="disabled"
            aria-haspopup="true"
            :aria-expanded="blockMenuOpen"
            @click="blockMenuOpen = !blockMenuOpen"
          >
            <span>{{ currentBlockLabel }}</span>
            <SeneuIcon name="expand_more" :size="16" />
          </button>
          <div v-if="blockMenuOpen" class="seneu-rte__block-dropdown" role="menu">
            <button
              v-for="opt in BLOCK_OPTIONS"
              :key="opt.value"
              type="button"
              role="menuitem"
              class="seneu-rte__block-option"
              :class="{ 'seneu-rte__block-option--active': currentBlock === opt.value }"
              @click="applyBlock(opt.value)"
            >{{ opt.label }}</button>
          </div>
        </div>

        <span class="seneu-rte__sep" aria-hidden="true" />

        <button
          v-for="btn in INLINE_BUTTONS"
          :key="btn.cmd"
          type="button"
          class="seneu-rte__btn"
          :class="{ 'seneu-rte__btn--active': formatState[btn.cmd] }"
          :disabled="disabled"
          :title="btn.label"
          :aria-label="btn.label"
          :aria-pressed="formatState[btn.cmd]"
          @click="exec(btn.cmd)"
        >
          <SeneuIcon :name="btn.icon" :size="18" />
        </button>

        <span class="seneu-rte__sep" aria-hidden="true" />

        <button
          v-for="btn in LIST_BUTTONS"
          :key="btn.cmd"
          type="button"
          class="seneu-rte__btn"
          :class="{ 'seneu-rte__btn--active': formatState[btn.cmd] }"
          :disabled="disabled"
          :title="btn.label"
          :aria-label="btn.label"
          :aria-pressed="formatState[btn.cmd]"
          @click="exec(btn.cmd)"
        >
          <SeneuIcon :name="btn.icon" :size="18" />
        </button>

        <span class="seneu-rte__sep" aria-hidden="true" />

        <button
          v-for="btn in ALIGN_BUTTONS"
          :key="btn.cmd"
          type="button"
          class="seneu-rte__btn"
          :class="{ 'seneu-rte__btn--active': formatState[btn.cmd] }"
          :disabled="disabled"
          :title="btn.label"
          :aria-label="btn.label"
          :aria-pressed="formatState[btn.cmd]"
          @click="exec(btn.cmd)"
        >
          <SeneuIcon :name="btn.icon" :size="18" />
        </button>

        <span class="seneu-rte__sep" aria-hidden="true" />

        <button type="button" class="seneu-rte__btn" :disabled="disabled" title="Insert link" aria-label="Insert link" @click="openLinkPopover">
          <SeneuIcon name="link" :size="18" />
        </button>
        <button type="button" class="seneu-rte__btn" :disabled="disabled" title="Remove link" aria-label="Remove link" @click="removeLink">
          <SeneuIcon name="link_off" :size="18" />
        </button>

        <span class="seneu-rte__sep" aria-hidden="true" />

        <button type="button" class="seneu-rte__btn" :disabled="disabled" title="Clear formatting" aria-label="Clear formatting" @click="exec('removeFormat')">
          <SeneuIcon name="format_clear" :size="18" />
        </button>

        <div v-if="linkPopoverOpen" class="seneu-rte__link-popover" @mousedown.stop>
          <input
            ref="linkInputRef"
            v-model="linkUrl"
            type="url"
            class="seneu-rte__link-input"
            placeholder="https://example.com"
            @keydown.enter.prevent="confirmLink"
            @keydown.escape.prevent="closeLinkPopover"
          />
          <button type="button" class="seneu-rte__link-confirm" aria-label="Apply link" @click="confirmLink">
            <SeneuIcon name="check" :size="16" />
          </button>
          <button type="button" class="seneu-rte__link-cancel" aria-label="Cancel" @click="closeLinkPopover">
            <SeneuIcon name="close" :size="16" />
          </button>
        </div>
      </div>

      <div
        :id="editorId"
        ref="editorRef"
        class="seneu-rte__editor"
        :class="{ 'seneu-rte__editor--empty': isEmpty }"
        :contenteditable="isEditable()"
        role="textbox"
        aria-multiline="true"
        :aria-label="label || placeholder"
        :aria-describedby="(hint || error) ? `${editorId}-desc` : undefined"
        :aria-invalid="error ? 'true' : undefined"
        :data-placeholder="placeholder"
        :style="{ minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keyup="updateActiveFormats"
        @mouseup="updateActiveFormats"
        @keydown="onEditorKeydown"
      />
    </div>

    <div v-if="!loading && (hint || error || (showCounter && !readonly))" class="seneu-rte__footer">
      <p
        v-if="error || hint"
        :id="`${editorId}-desc`"
        class="seneu-rte__message"
        :class="error ? 'seneu-rte__message--error' : 'seneu-rte__message--hint'"
      >
        <SeneuIcon v-if="error" name="error" :size="14" aria-hidden="true" />
        {{ error || hint }}
      </p>
      <span v-else />

      <span v-if="showCounter && !readonly" class="seneu-rte__counter" aria-live="polite">
        {{ wordCount }} words · {{ charCount }} characters
      </span>
    </div>
  </div>
</template>

<style>
/* ── Root ──────────────────────────────────────────────── */
.seneu-rte {
  display: flex;
  flex-direction: column;
  gap: var(--space-component-gap);
  font-family: var(--font-sans);
}

.seneu-rte__label {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-default);
  line-height: var(--line-height-normal);
}
.seneu-rte--disabled .seneu-rte__label { color: var(--color-text-disabled); }

/* ── Wrapper ───────────────────────────────────────────── */
.seneu-rte__wrapper {
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-element);
  background: var(--color-surface-raised);
  overflow: hidden;
  transition: border-color var(--duration-fast) var(--easing-standard),
              box-shadow var(--duration-fast) var(--easing-standard);
}
.seneu-rte__wrapper:hover { border-color: var(--color-border-interactive); }
.seneu-rte--error .seneu-rte__wrapper:hover { border-color: var(--color-border-danger); }
.seneu-rte--focused .seneu-rte__wrapper {
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px var(--color-ring-brand);
}
.seneu-rte--error .seneu-rte__wrapper {
  border-color: var(--color-border-danger);
}
.seneu-rte--error.seneu-rte--focused .seneu-rte__wrapper {
  box-shadow: 0 0 0 3px var(--color-ring-danger);
}
.seneu-rte--disabled .seneu-rte__wrapper {
  opacity: var(--opacity-disabled);
  background: var(--color-surface-default);
}
.seneu-rte--readonly .seneu-rte__wrapper {
  background: var(--color-surface-default);
  border-style: dashed;
}

/* ── Toolbar ───────────────────────────────────────────── */
.seneu-rte__toolbar {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
  padding: var(--space-inline-tight);
  border-bottom: 1px solid var(--color-border-default);
  background: var(--color-surface-default);
}
.seneu-rte--disabled .seneu-rte__toolbar { pointer-events: none; }

.seneu-rte__btn {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 30px;
  min-width: 30px;
  padding: 0 6px;
  border: none;
  border-radius: var(--radius-subtle);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--easing-standard),
              color var(--duration-fast) var(--easing-standard);
}
.seneu-rte__btn:hover:not(:disabled) {
  background-color: var(--color-surface-raised-hover);
  color: var(--color-text-default);
}
.seneu-rte__btn--active {
  background-color: var(--color-surface-brand-subtle);
  color: var(--color-text-brand);
}
.seneu-rte__btn:disabled { opacity: var(--opacity-disabled); cursor: not-allowed; }
.seneu-rte__btn:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: -2px;
}
.seneu-rte__btn--block {
  min-width: auto;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.seneu-rte__sep {
  width: 1px;
  height: 20px;
  background-color: var(--color-border-muted);
  margin: 0 4px;
  flex-shrink: 0;
}

/* ── Block format dropdown ─────────────────────────────── */
.seneu-rte__block-menu { position: relative; }
.seneu-rte__block-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: var(--z-index-dropdown);
  display: flex;
  flex-direction: column;
  min-width: 140px;
  padding: 4px;
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-element);
  box-shadow: var(--elevation-floating);
}
.seneu-rte__block-option {
  padding: 6px 10px;
  border: none;
  border-radius: var(--radius-subtle);
  background: transparent;
  color: var(--color-text-default);
  font-size: var(--font-size-small);
  text-align: left;
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--easing-standard);
}
.seneu-rte__block-option:hover { background-color: var(--color-surface-raised-hover); }
.seneu-rte__block-option--active {
  background-color: var(--color-surface-brand-subtle);
  color: var(--color-text-brand);
  font-weight: var(--font-weight-medium);
}

/* ── Link popover ──────────────────────────────────────── */
.seneu-rte__link-popover {
  position: absolute;
  top: calc(100% + 4px);
  right: var(--space-inline-tight);
  left: var(--space-inline-tight);
  z-index: var(--z-index-dropdown);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-element);
  box-shadow: var(--elevation-floating);
}
.seneu-rte__link-input {
  flex: 1;
  min-width: 0;
  height: 30px;
  padding: 0 8px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-subtle);
  background: var(--color-surface-default);
  color: var(--color-text-default);
  font-size: var(--font-size-small);
  outline: none;
}
.seneu-rte__link-input:focus { border-color: var(--color-border-focus); }
.seneu-rte__link-confirm,
.seneu-rte__link-cancel {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border: none;
  border-radius: var(--radius-subtle);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--easing-standard);
}
.seneu-rte__link-confirm { background: var(--color-surface-brand); color: var(--color-text-on-brand); }
.seneu-rte__link-confirm:hover { background: var(--color-surface-brand-hover); }
.seneu-rte__link-cancel { background: transparent; color: var(--color-text-muted); }
.seneu-rte__link-cancel:hover { background: var(--color-surface-raised-hover); color: var(--color-text-default); }

/* ── Editable area ─────────────────────────────────────── */
.seneu-rte__editor {
  padding: var(--space-inline-normal) var(--space-component-padding-inline);
  color: var(--color-text-default);
  font-size: var(--font-size-body);
  line-height: var(--line-height-relaxed);
  outline: none;
  overflow-y: auto;
}
.seneu-rte--readonly .seneu-rte__editor,
.seneu-rte--disabled .seneu-rte__editor { cursor: default; }

.seneu-rte__editor--empty::before {
  content: attr(data-placeholder);
  color: var(--color-text-muted);
  pointer-events: none;
}

.seneu-rte__editor :first-child { margin-top: 0; }
.seneu-rte__editor :last-child { margin-bottom: 0; }
.seneu-rte__editor h1 { font-size: var(--font-size-heading-3); font-weight: var(--font-weight-bold); margin: var(--space-stack-normal) 0; }
.seneu-rte__editor h2 { font-size: var(--font-size-heading-4); font-weight: var(--font-weight-bold); margin: var(--space-stack-normal) 0; }
.seneu-rte__editor h3 { font-size: var(--font-size-lead); font-weight: var(--font-weight-semibold); margin: var(--space-stack-tight) 0; }
.seneu-rte__editor p { margin: var(--space-stack-tight) 0; }
.seneu-rte__editor ul,
.seneu-rte__editor ol { margin: var(--space-stack-tight) 0; padding-left: 1.5em; list-style-position: outside; }
/* Explicit — Tailwind's Preflight (or any host app reset) zeroes out list-style
   on every <ul>/<ol> regardless of role, so bullets/numbers need restoring here. */
.seneu-rte__editor ul { list-style-type: disc; }
.seneu-rte__editor ol { list-style-type: decimal; }
.seneu-rte__editor li { display: list-item; }
.seneu-rte__editor blockquote {
  margin: var(--space-stack-normal) 0;
  padding-left: var(--space-inline-normal);
  border-left: 3px solid var(--color-border-brand);
  color: var(--color-text-muted);
  font-style: italic;
}
.seneu-rte__editor a { color: var(--color-text-brand); text-decoration: underline; }

/* ── Footer (message + counter) ───────────────────────── */
.seneu-rte__footer {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-inline-normal);
}
.seneu-rte__message {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-small);
  line-height: var(--line-height-normal);
}
.seneu-rte__message--hint { color: var(--color-text-muted); }
.seneu-rte__message--error { color: var(--color-text-danger); }
.seneu-rte__counter {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  flex-shrink: 0;
  white-space: nowrap;
}

/* ── Skeleton (loading) ────────────────────────────────── */
.seneu-rte__skeleton {
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-element);
  overflow: hidden;
}
.seneu-rte__skeleton-toolbar {
  display: flex;
  gap: 6px;
  padding: var(--space-inline-tight);
  border-bottom: 1px solid var(--color-border-default);
  background: var(--color-surface-default);
}
.seneu-rte__skeleton-btn { width: 28px; height: 28px; border-radius: var(--radius-subtle); }
.seneu-rte__skeleton-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-stack-normal);
  padding: var(--space-inline-normal) var(--space-component-padding-inline);
}
.seneu-rte__skeleton-line { height: 14px; border-radius: var(--radius-subtle); }
.seneu-rte__skeleton-btn,
.seneu-rte__skeleton-line {
  display: block;
  background: linear-gradient(
    90deg,
    var(--color-surface-raised-hover) 25%,
    var(--color-surface-raised-active) 50%,
    var(--color-surface-raised-hover) 75%
  );
  background-size: 200% 100%;
  animation: seneu-rte-shimmer 1.5s ease-in-out infinite;
}
@keyframes seneu-rte-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
