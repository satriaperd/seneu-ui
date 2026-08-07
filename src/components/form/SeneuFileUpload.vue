<script setup>
import { ref, computed, useId } from 'vue'
import SeneuIcon from '../display/SeneuIcon.vue'

defineOptions({ inheritAttrs: false })

/**
 * File picker with drag & drop, image preview grid, and a file
 * list with per-item status. The component owns file *selection*
 * only — upload progress/status is driven by the consumer: mutate
 * `status`/`progress`/`error` on the entries received via v-model
 * or the `add` event as your own upload call reports back.
 */
const props = defineProps({
  /** Bound list of file entries — use with v-model */
  modelValue: { type: Array, default: () => [] },
  /** 'dropzone' — large drag & drop target. 'compact' — a single button + summary line */
  variant: {
    type: String,
    default: 'dropzone',
    validator: v => ['dropzone', 'compact'].includes(v),
  },
  /** Allows selecting more than one file at a time */
  multiple: { type: Boolean, default: true },
  /** Comma-separated accept list — MIME types, wildcards (image/*), or extensions (.pdf) */
  accept: { type: String, default: '' },
  /** Max size per file in bytes — 0 means unlimited */
  maxSize: { type: Number, default: 0 },
  /** Max total file count — 0 means unlimited */
  maxFiles: { type: Number, default: 0 },
  /** Shows an image thumbnail grid for image files */
  showPreview: { type: Boolean, default: true },
  /** Label shown above the field */
  label: { type: String, default: '' },
  /** Helper text shown below the field — also doubles as the restriction hint (e.g. file types/size) */
  hint: { type: String, default: '' },
  /** Error message — sets error state when non-empty */
  error: { type: String, default: '' },
  /** Disables the field entirely */
  disabled: { type: Boolean, default: false },
  /** Shows a busy state and blocks interaction — e.g. while an existing file list is loading */
  loading: { type: Boolean, default: false },
  /** Controls padding and icon/font sizes */
  size: {
    type: String,
    default: 'base',
    validator: v => ['sm', 'base', 'lg'].includes(v),
  },
  /** Explicit id — auto-generated when omitted */
  id: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'add', 'remove', 'error'])

const _uid = useId()
const fieldId = computed(() => props.id || _uid)

const inputRef = ref(null)
const isDragging = ref(false)
const validationError = ref('')

const iconSize = computed(() => ({ sm: 28, base: 36, lg: 44 }[props.size]))
const removeIconSize = computed(() => ({ sm: 16, base: 18, lg: 20 }[props.size]))

const imageFiles = computed(() => props.modelValue.filter(f => f.previewUrl))
const otherFiles = computed(() => props.modelValue.filter(f => !f.previewUrl))
const displayMessage = computed(() => props.error || validationError.value || props.hint)
const hasFieldError = computed(() => !!(props.error || validationError.value))

function triggerInput() {
  if (props.disabled || props.loading) return
  inputRef.value?.click()
}
function onDropzoneKeydown(e) {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); triggerInput() }
}
function onDragOver() {
  if (props.disabled || props.loading) return
  isDragging.value = true
}
function onDrop(e) {
  isDragging.value = false
  if (props.disabled || props.loading) return
  addFiles(Array.from(e.dataTransfer.files))
}
function onInputChange(e) {
  addFiles(Array.from(e.target.files))
  e.target.value = ''
}

function isAcceptedType(file) {
  if (!props.accept) return true
  return props.accept.split(',').map(s => s.trim()).filter(Boolean).some(pattern => {
    if (pattern.startsWith('.')) return file.name.toLowerCase().endsWith(pattern.toLowerCase())
    if (pattern.endsWith('/*')) return file.type.startsWith(pattern.slice(0, -1))
    return file.type === pattern
  })
}

function fmtSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function fileIcon(name) {
  const ext = name.split('.').pop().toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'].includes(ext)) return 'image'
  if (ext === 'pdf') return 'picture_as_pdf'
  if (['doc', 'docx'].includes(ext)) return 'description'
  if (['xls', 'xlsx'].includes(ext)) return 'table_chart'
  if (['zip', 'rar', '7z'].includes(ext)) return 'folder_zip'
  if (['mp4', 'mov', 'avi', 'webm'].includes(ext)) return 'movie'
  if (['mp3', 'wav', 'ogg'].includes(ext)) return 'audio_file'
  return 'draft'
}

let nextId = 0

function addFiles(newFiles) {
  if (props.disabled || props.loading || !newFiles.length) return
  validationError.value = ''

  const incoming = props.multiple ? newFiles : newFiles.slice(0, 1)

  if (props.maxFiles > 0 && props.modelValue.length + incoming.length > props.maxFiles) {
    validationError.value = `Maksimal ${props.maxFiles} file yang bisa diupload`
    emit('error', { reason: 'count', message: validationError.value })
    return
  }

  const accepted = []
  const next = [...props.modelValue]

  for (const file of incoming) {
    if (!isAcceptedType(file)) {
      validationError.value = `"${file.name}" bukan tipe file yang didukung`
      emit('error', { file, reason: 'type', message: validationError.value })
      continue
    }
    if (props.maxSize > 0 && file.size > props.maxSize) {
      validationError.value = `"${file.name}" melebihi batas ${fmtSize(props.maxSize)}`
      emit('error', { file, reason: 'size', message: validationError.value })
      continue
    }
    const entry = {
      id: `seneu-file-${++nextId}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      icon: fileIcon(file.name),
      previewUrl: props.showPreview && file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      status: 'pending', // 'pending' | 'uploading' | 'done' | 'error'
      progress: 0,
      error: '',
    }
    next.push(entry)
    accepted.push(entry)
  }

  if (accepted.length) {
    emit('update:modelValue', next)
    emit('add', accepted)
  }
}

function removeFile(id) {
  const entry = props.modelValue.find(f => f.id === id)
  if (entry?.previewUrl) URL.revokeObjectURL(entry.previewUrl)
  emit('update:modelValue', props.modelValue.filter(f => f.id !== id))
  emit('remove', entry)
}
</script>

<template>
  <div
    class="seneu-fileupload"
    :class="[
      `seneu-fileupload--${size}`,
      {
        'seneu-fileupload--error':    hasFieldError,
        'seneu-fileupload--disabled': disabled,
        'seneu-fileupload--loading':  loading,
      },
    ]"
  >
    <label v-if="label" :for="fieldId" class="seneu-fileupload__label">{{ label }}</label>

    <input
      :id="fieldId"
      ref="inputRef"
      type="file"
      class="seneu-fileupload__native-input"
      :multiple="multiple"
      :accept="accept"
      :disabled="disabled || loading"
      :aria-describedby="displayMessage ? `${fieldId}-desc` : undefined"
      v-bind="$attrs"
      @change="onInputChange"
    />

    <!-- Dropzone variant -->
    <div
      v-if="variant === 'dropzone'"
      class="seneu-fileupload__dropzone"
      role="button"
      :tabindex="disabled || loading ? -1 : 0"
      :aria-disabled="disabled || loading || undefined"
      :aria-label="label || 'Upload file'"
      :class="{
        'seneu-fileupload__dropzone--dragging': isDragging,
        'seneu-fileupload__dropzone--error':    hasFieldError && !isDragging,
      }"
      @click="triggerInput"
      @keydown="onDropzoneKeydown"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
    >
      <SeneuIcon
        v-if="loading"
        name="progress_activity"
        :size="iconSize"
        class="seneu-fileupload__icon seneu-fileupload__icon--spin"
        aria-hidden="true"
      />
      <SeneuIcon
        v-else
        :name="isDragging ? 'upload_file' : hasFieldError ? 'error' : 'cloud_upload'"
        :size="iconSize"
        class="seneu-fileupload__icon"
        :class="{ 'seneu-fileupload__icon--active': isDragging, 'seneu-fileupload__icon--error': hasFieldError && !isDragging }"
        aria-hidden="true"
      />

      <p class="seneu-fileupload__title">
        {{ loading ? 'Lagi memuat…' : isDragging ? 'Lepas file di sini' : 'Drag & drop file di sini' }}
      </p>
      <p v-if="!loading && !isDragging" class="seneu-fileupload__subtitle">
        atau <span class="seneu-fileupload__browse-link">klik buat browse</span> dari perangkat kamu
      </p>
    </div>

    <!-- Compact variant -->
    <div v-else class="seneu-fileupload__compact">
      <button
        type="button"
        class="seneu-fileupload__compact-btn"
        :disabled="disabled || loading"
        @click="triggerInput"
      >
        <SeneuIcon
          :name="loading ? 'progress_activity' : 'attach_file'"
          :size="removeIconSize"
          :class="{ 'seneu-fileupload__icon--spin': loading }"
          aria-hidden="true"
        />
        Pilih File
      </button>
      <span class="seneu-fileupload__compact-summary">
        {{ modelValue.length ? `${modelValue.length} file dipilih` : 'Belum ada file dipilih' }}
      </span>
    </div>

    <p
      v-if="displayMessage"
      :id="`${fieldId}-desc`"
      class="seneu-fileupload__message"
      :class="hasFieldError ? 'seneu-fileupload__message--error' : 'seneu-fileupload__message--hint'"
    >
      <SeneuIcon v-if="hasFieldError" name="error" :size="14" aria-hidden="true" />
      {{ displayMessage }}
    </p>

    <!-- Image preview grid -->
    <div v-if="imageFiles.length" class="seneu-fileupload__image-grid">
      <div v-for="entry in imageFiles" :key="entry.id" class="seneu-fileupload__thumb">
        <img :src="entry.previewUrl" :alt="entry.name" />
        <div class="seneu-fileupload__thumb-overlay">
          <button
            type="button"
            class="seneu-fileupload__thumb-remove"
            :aria-label="`Hapus ${entry.name}`"
            @click="removeFile(entry.id)"
          >
            <SeneuIcon name="close" :size="14" aria-hidden="true" />
          </button>
          <span v-if="entry.status === 'uploading'" class="seneu-fileupload__thumb-progress">{{ Math.round(entry.progress) }}%</span>
          <SeneuIcon v-else-if="entry.status === 'done'" name="check_circle" :size="16" class="seneu-fileupload__thumb-check" aria-hidden="true" />
          <SeneuIcon v-else-if="entry.status === 'error'" name="error" :size="16" class="seneu-fileupload__thumb-error" aria-hidden="true" />
        </div>
      </div>
    </div>

    <!-- File list (non-image) -->
    <div v-if="otherFiles.length" class="seneu-fileupload__list">
      <div
        v-for="entry in otherFiles" :key="entry.id"
        class="seneu-fileupload__item"
        :class="{ 'seneu-fileupload__item--error': entry.status === 'error' }"
      >
        <SeneuIcon :name="entry.icon" :size="20" class="seneu-fileupload__item-icon" aria-hidden="true" />
        <div class="seneu-fileupload__item-info">
          <span class="seneu-fileupload__item-name">{{ entry.name }}</span>
          <span class="seneu-fileupload__item-meta" :class="{ 'seneu-fileupload__item-meta--error': entry.status === 'error' }">
            <template v-if="entry.status === 'error'">
              <SeneuIcon name="error" :size="13" aria-hidden="true" />
              {{ entry.error || 'Upload gagal' }}
            </template>
            <template v-else-if="entry.status === 'uploading'">
              {{ fmtSize(entry.size) }} · Mengupload {{ Math.round(entry.progress) }}%
            </template>
            <template v-else-if="entry.status === 'done'">
              {{ fmtSize(entry.size) }} · Selesai
            </template>
            <template v-else>
              {{ fmtSize(entry.size) }}
            </template>
          </span>
          <div v-if="entry.status === 'uploading'" class="seneu-fileupload__item-bar-track">
            <div class="seneu-fileupload__item-bar" :style="{ width: entry.progress + '%' }" />
          </div>
        </div>
        <SeneuIcon v-if="entry.status === 'done'" name="check_circle" :size="18" class="seneu-fileupload__item-done" aria-hidden="true" />
        <button
          type="button"
          class="seneu-fileupload__item-remove"
          :aria-label="`Hapus ${entry.name}`"
          @click="removeFile(entry.id)"
        >
          <SeneuIcon name="close" :size="16" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</template>

<style>
/* ── Root ──────────────────────────────────────────────────── */
.seneu-fileupload {
  display:        flex;
  flex-direction: column;
  gap:            var(--space-component-gap);
}

.seneu-fileupload__label {
  font-size:   var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color:       var(--color-text-default);
  line-height: var(--line-height-normal);
}

.seneu-fileupload--disabled .seneu-fileupload__label { color: var(--color-text-disabled); }

.seneu-fileupload__native-input {
  position: absolute;
  width:    1px;
  height:   1px;
  opacity:  0;
  overflow: hidden;
  pointer-events: none;
}

/* ── Dropzone ──────────────────────────────────────────────── */
.seneu-fileupload__dropzone {
  display:         flex;
  flex-direction:  column;
  align-items:     center;
  justify-content: center;
  gap:             4px;
  border:          2px dashed var(--color-border-default);
  border-radius:   var(--radius-container);
  cursor:          pointer;
  text-align:      center;
  transition:
    border-color     var(--duration-fast) var(--easing-standard),
    background-color var(--duration-fast) var(--easing-standard);
}

.seneu-fileupload--sm   .seneu-fileupload__dropzone { padding: var(--primitive-space-5) var(--primitive-space-4); }
.seneu-fileupload--base .seneu-fileupload__dropzone { padding: var(--primitive-space-8) var(--primitive-space-6); }
.seneu-fileupload--lg   .seneu-fileupload__dropzone { padding: var(--primitive-space-10) var(--primitive-space-8); }

.seneu-fileupload__dropzone:hover,
.seneu-fileupload__dropzone--dragging {
  border-color: var(--color-border-brand);
  background:   var(--color-surface-brand-subtle);
}
.seneu-fileupload__dropzone:focus-visible {
  outline:        2px solid var(--color-border-focus);
  outline-offset: 2px;
}
.seneu-fileupload__dropzone--error {
  border-color: var(--color-border-danger);
  background:   var(--color-surface-danger-subtle);
}
.seneu-fileupload--disabled .seneu-fileupload__dropzone,
.seneu-fileupload--loading .seneu-fileupload__dropzone {
  opacity:        var(--opacity-disabled);
  cursor:         not-allowed;
  pointer-events: none;
}

.seneu-fileupload__icon {
  color:      var(--color-text-muted);
  transition: color var(--duration-fast) var(--easing-standard);
}
.seneu-fileupload__icon--active { color: var(--color-text-brand); }
.seneu-fileupload__icon--error  { color: var(--color-text-danger); }

@keyframes seneu-spin { to { transform: rotate(360deg); } }
.seneu-fileupload__icon--spin { animation: seneu-spin 0.8s linear infinite; }

.seneu-fileupload__title {
  font-size:   var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color:       var(--color-text-default);
  margin:      4px 0 0;
}
.seneu-fileupload__subtitle {
  font-size: var(--font-size-small);
  color:     var(--color-text-muted);
  margin:    0;
}
.seneu-fileupload__browse-link {
  color:           var(--color-text-brand);
  text-decoration: underline;
}

/* ── Compact variant ───────────────────────────────────────── */
.seneu-fileupload__compact {
  display:     flex;
  align-items: center;
  gap:         var(--space-inline-normal);
  flex-wrap:   wrap;
}

.seneu-fileupload__compact-btn {
  display:         inline-flex;
  align-items:     center;
  gap:             var(--space-inline-tight);
  font-family:     var(--font-sans);
  font-weight:     var(--font-weight-medium);
  color:           var(--color-text-default);
  background:      var(--color-surface-raised);
  border:          1px solid var(--color-border-default);
  border-radius:   var(--radius-element);
  cursor:          pointer;
  transition:
    border-color     var(--duration-fast) var(--easing-standard),
    background-color var(--duration-fast) var(--easing-standard);
}
.seneu-fileupload--sm   .seneu-fileupload__compact-btn { padding: 6px 12px;  font-size: var(--font-size-small); }
.seneu-fileupload--base .seneu-fileupload__compact-btn { padding: 9px 16px;  font-size: var(--font-size-body); }
.seneu-fileupload--lg   .seneu-fileupload__compact-btn { padding: 12px 20px; font-size: var(--font-size-lead); }

.seneu-fileupload__compact-btn:hover:not(:disabled) {
  border-color: var(--color-border-interactive);
  background:   var(--color-surface-raised-hover);
}
.seneu-fileupload__compact-btn:focus-visible {
  outline:        2px solid var(--color-border-focus);
  outline-offset: 2px;
}
.seneu-fileupload__compact-btn:disabled { opacity: var(--opacity-disabled); cursor: not-allowed; }

.seneu-fileupload__compact-summary {
  font-size: var(--font-size-small);
  color:     var(--color-text-muted);
}

/* ── Message line ──────────────────────────────────────────── */
.seneu-fileupload__message {
  display:     flex;
  align-items: center;
  gap:         4px;
  font-size:   var(--font-size-small);
  line-height: var(--line-height-normal);
}
.seneu-fileupload__message--hint  { color: var(--color-text-muted);  }
.seneu-fileupload__message--error { color: var(--color-text-danger); }

/* ── Image preview grid ────────────────────────────────────── */
.seneu-fileupload__image-grid {
  display:               grid;
  grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
  gap:                   var(--space-inline-tight);
}
.seneu-fileupload__thumb {
  position:      relative;
  aspect-ratio:  1;
  border-radius: var(--radius-element);
  overflow:      hidden;
  border:        1px solid var(--color-border-default);
  background:    var(--color-surface-raised);
}
.seneu-fileupload__thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

.seneu-fileupload__thumb-overlay {
  position:        absolute;
  inset:           0;
  background:      rgba(0, 0, 0, 0.35);
  display:         flex;
  align-items:     flex-start;
  justify-content: flex-end;
  padding:         4px;
  opacity:         0;
  transition:      opacity var(--duration-fast) var(--easing-standard);
}
.seneu-fileupload__thumb:hover .seneu-fileupload__thumb-overlay,
.seneu-fileupload__thumb:focus-within .seneu-fileupload__thumb-overlay { opacity: 1; }

.seneu-fileupload__thumb-remove {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           22px;
  height:          22px;
  background:      rgba(0, 0, 0, 0.6);
  border:          none;
  border-radius:   var(--radius-circle);
  cursor:          pointer;
  color:           #fff;
}
.seneu-fileupload__thumb-progress {
  position:    absolute;
  bottom:      4px;
  left:        4px;
  font-size:   var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color:       #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}
.seneu-fileupload__thumb-check {
  position: absolute;
  bottom:   4px;
  left:     4px;
  color:    #fff;
}
.seneu-fileupload__thumb-error {
  position: absolute;
  bottom:   4px;
  left:     4px;
  color:    var(--primitive-color-red-300);
}

/* ── File list ─────────────────────────────────────────────── */
.seneu-fileupload__list {
  display:        flex;
  flex-direction: column;
  gap:            var(--space-inline-tight);
}

.seneu-fileupload__item {
  display:       flex;
  align-items:   center;
  gap:           var(--space-inline-normal);
  padding:       10px 12px;
  border:        1px solid var(--color-border-default);
  border-radius: var(--radius-element);
  background:    var(--color-surface-raised);
}
.seneu-fileupload__item--error { border-color: var(--color-border-danger); }

.seneu-fileupload__item-icon { color: var(--color-text-muted); flex-shrink: 0; }
.seneu-fileupload__item-info {
  flex:           1;
  min-width:      0;
  display:        flex;
  flex-direction: column;
  gap:            3px;
}
.seneu-fileupload__item-name {
  font-size:     var(--font-size-small);
  font-weight:   var(--font-weight-medium);
  color:         var(--color-text-default);
  white-space:   nowrap;
  overflow:      hidden;
  text-overflow: ellipsis;
}
.seneu-fileupload__item-meta {
  display:     inline-flex;
  align-items: center;
  gap:         4px;
  font-size:   var(--font-size-xs);
  color:       var(--color-text-muted);
}
.seneu-fileupload__item-meta--error { color: var(--color-text-danger); }

.seneu-fileupload__item-bar-track {
  height:        3px;
  background:    var(--color-border-default);
  border-radius: var(--radius-pill);
  overflow:      hidden;
  margin-top:    2px;
}
.seneu-fileupload__item-bar {
  height:        100%;
  background:    var(--color-surface-brand);
  border-radius: var(--radius-pill);
  transition:    width var(--duration-normal) linear;
}

.seneu-fileupload__item-done { color: var(--color-text-success); flex-shrink: 0; }

.seneu-fileupload__item-remove {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           28px;
  height:          28px;
  border:          none;
  background:      transparent;
  border-radius:   var(--radius-element);
  cursor:          pointer;
  color:           var(--color-text-muted);
  flex-shrink:     0;
  transition:      background-color var(--duration-fast) var(--easing-standard), color var(--duration-fast) var(--easing-standard);
}
.seneu-fileupload__item-remove:hover { background: var(--color-surface-raised-hover); color: var(--color-text-default); }
.seneu-fileupload__item-remove:focus-visible {
  outline:        2px solid var(--color-border-focus);
  outline-offset: 1px;
}

/* ── Reduced motion ────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .seneu-fileupload__icon--spin { animation-duration: 0.01ms; }
}
</style>
