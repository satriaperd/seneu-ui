<script setup>
import { ref, computed, watch } from 'vue'
import SeneuCheckbox from '../form/SeneuCheckbox.vue'
import SeneuIcon from './SeneuIcon.vue'
import SeneuSkeleton from './SeneuSkeleton.vue'
import SeneuEmptyState from './SeneuEmptyState.vue'

defineOptions({ inheritAttrs: false })

/**
 * Data table with sorting, row selection, and per-column cell slots.
 * Sorting is controlled — this component only renders the current
 * sort state and emits `sort`; the parent re-orders `rows` and passes
 * them back down.
 */
const props = defineProps({
  /** `{ key, label, sortable?, align?, width? }[]` */
  columns: {
    type: Array,
    default: () => [],
  },
  rows: {
    type: Array,
    default: () => [],
  },
  /** Property used as each row's unique id, for selection and :key */
  rowIdKey: {
    type: String,
    default: 'id',
  },
  selectable: {
    type: Boolean,
    default: false,
  },
  /** Array of selected row ids — supports v-model:selected */
  selected: {
    type: Array,
    default: () => [],
  },
  sortKey: {
    type: String,
    default: '',
  },
  sortDir: {
    type: String,
    default: 'asc',
    validator: v => ['asc', 'desc'].includes(v),
  },
  striped: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  skeletonRows: {
    type: Number,
    default: 4,
  },
  emptyTitle: {
    type: String,
    default: 'No data yet',
  },
  emptyDescription: {
    type: String,
    default: 'Once there is something to show, it will show up here.',
  },
  /** Switches to a stacked card layout below the mobile breakpoint instead of horizontal scroll */
  stackOnMobile: {
    type: Boolean,
    default: false,
  },
  /** Makes rows keyboard-focusable and clickable — emits `row-click` */
  clickableRows: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:selected', 'sort', 'row-click'])

const localSelected = ref(new Set(props.selected))
watch(() => props.selected, val => { localSelected.value = new Set(val) })

const allSelected = computed(() =>
  props.rows.length > 0 && props.rows.every(r => localSelected.value.has(r[props.rowIdKey])),
)
const someSelected = computed(() =>
  props.rows.some(r => localSelected.value.has(r[props.rowIdKey])),
)
const colSpan = computed(() => props.columns.length + (props.selectable ? 1 : 0))

function isSelected(row) {
  return localSelected.value.has(row[props.rowIdKey])
}

function toggleRow(row, checked) {
  const id = row[props.rowIdKey]
  const next = new Set(localSelected.value)
  if (checked) next.add(id)
  else next.delete(id)
  localSelected.value = next
  emit('update:selected', [...next])
}

function toggleAll() {
  const next = new Set()
  if (!allSelected.value) {
    for (const row of props.rows) next.add(row[props.rowIdKey])
  }
  localSelected.value = next
  emit('update:selected', [...next])
}

function handleSort(col) {
  if (!col.sortable) return
  const dir = props.sortKey === col.key && props.sortDir === 'asc' ? 'desc' : 'asc'
  emit('sort', { key: col.key, dir })
}
</script>

<template>
  <div
    class="seneu-table-wrap"
    :class="{ 'seneu-table-wrap--stack-mobile': stackOnMobile }"
    v-bind="$attrs"
  >
    <table class="seneu-table" :class="{ 'seneu-table--striped': striped }">
      <thead class="seneu-table__head">
        <tr class="seneu-table__row">
          <th v-if="selectable" class="seneu-table__th seneu-table__th--check">
            <SeneuCheckbox
              :model-value="allSelected"
              :indeterminate="someSelected && !allSelected"
              aria-label="Select all rows"
              @update:model-value="toggleAll"
            />
          </th>
          <th
            v-for="col in columns"
            :key="col.key"
            class="seneu-table__th"
            :class="[
              col.align && `seneu-table__th--${col.align}`,
              col.sortable && 'seneu-table__th--sortable',
              sortKey === col.key && 'seneu-table__th--sorted',
            ]"
            :style="col.width ? { width: col.width, minWidth: col.width } : {}"
            :aria-sort="sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : col.sortable ? 'none' : undefined"
          >
            <button
              v-if="col.sortable"
              type="button"
              class="seneu-table__sort-btn"
              @click="handleSort(col)"
            >
              {{ col.label }}
              <SeneuIcon
                :name="sortKey === col.key ? (sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'"
                :size="14"
                class="seneu-table__sort-icon"
              />
            </button>
            <template v-else>{{ col.label }}</template>
          </th>
        </tr>
      </thead>

      <tbody class="seneu-table__body">
        <template v-if="loading">
          <tr v-for="i in skeletonRows" :key="`skel-${i}`" class="seneu-table__row">
            <td v-if="selectable" class="seneu-table__td seneu-table__td--check">
              <SeneuSkeleton variant="rect" width="1.25rem" height="1.25rem" />
            </td>
            <td v-for="col in columns" :key="col.key" class="seneu-table__td">
              <SeneuSkeleton variant="text" width="80%" />
            </td>
          </tr>
        </template>

        <tr v-else-if="!rows.length" class="seneu-table__row seneu-table__row--empty">
          <td :colspan="colSpan" class="seneu-table__td seneu-table__td--empty">
            <slot name="empty">
              <SeneuEmptyState size="sm" icon="table_rows" :title="emptyTitle" :description="emptyDescription" />
            </slot>
          </td>
        </tr>

        <tr
          v-for="row in rows"
          v-else
          :key="row[rowIdKey] ?? rows.indexOf(row)"
          class="seneu-table__row"
          :class="{
            'seneu-table__row--selected': isSelected(row),
            'seneu-table__row--clickable': clickableRows,
          }"
          :tabindex="clickableRows ? 0 : undefined"
          @click="clickableRows && emit('row-click', row)"
          @keydown.enter="clickableRows && emit('row-click', row)"
        >
          <td v-if="selectable" class="seneu-table__td seneu-table__td--check" @click.stop>
            <SeneuCheckbox
              :model-value="isSelected(row)"
              :aria-label="`Select row ${row[rowIdKey] ?? ''}`"
              @update:model-value="val => toggleRow(row, val)"
            />
          </td>
          <td
            v-for="col in columns"
            :key="col.key"
            class="seneu-table__td"
            :class="col.align && `seneu-table__td--${col.align}`"
            :data-label="col.label"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
              {{ row[col.key] ?? '—' }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
/* ── Wrapper ───────────────────────────────────────────── */
.seneu-table-wrap {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-container);
}

/* ── Table ─────────────────────────────────────────────── */
.seneu-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
  font-family: var(--font-sans);
}

/* ── Head ──────────────────────────────────────────────── */
.seneu-table__head { background-color: var(--color-surface-raised-hover); }

.seneu-table__th {
  padding: var(--space-inline-tight) var(--space-inline-normal);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  color: var(--color-text-muted);
  text-align: left;
  border-bottom: 1px solid var(--color-border-default);
  white-space: nowrap;
}
.seneu-table__th--center { text-align: center; }
.seneu-table__th--right  { text-align: right; }
.seneu-table__th--check  { width: 3rem; text-align: center; }
.seneu-table__th--sorted { color: var(--color-text-brand); }

.seneu-table__sort-btn {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  text-transform: inherit;
  letter-spacing: inherit;
  cursor: pointer;
}
.seneu-table__sort-btn:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
  border-radius: var(--radius-subtle);
}

.seneu-table__sort-icon { opacity: var(--opacity-medium); }
.seneu-table__th--sorted .seneu-table__sort-icon { opacity: var(--opacity-full); }

/* ── Rows ──────────────────────────────────────────────── */
.seneu-table__row {
  border-bottom: 1px solid var(--color-border-default);
  transition: background-color var(--duration-fast) var(--easing-standard);
}
.seneu-table__row:last-child { border-bottom: none; }
.seneu-table__body .seneu-table__row:hover { background-color: var(--color-surface-raised-hover); }
.seneu-table__row--selected  { background-color: var(--color-surface-brand-subtle) !important; }
.seneu-table__row--clickable { cursor: pointer; }
.seneu-table__row--clickable:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: -2px;
}
.seneu-table__row--empty:hover { background-color: transparent; }

/* ── Striped ───────────────────────────────────────────── */
.seneu-table--striped .seneu-table__body .seneu-table__row:nth-child(even) {
  background-color: var(--color-surface-raised-hover);
}

/* ── Cells ─────────────────────────────────────────────── */
.seneu-table__td {
  padding: var(--space-inline-normal);
  font-size: var(--font-size-body);
  color: var(--color-text-default);
  vertical-align: middle;
}
.seneu-table__td--center { text-align: center; }
.seneu-table__td--right  { text-align: right; }
.seneu-table__td--check  { width: 3rem; text-align: center; }
.seneu-table__td--empty  { padding: 0; }

/* ── Stacked mobile layout (opt-in) ───────────────────── */
@media (max-width: 767px) {
  .seneu-table-wrap--stack-mobile { overflow-x: visible; border: none; }
  .seneu-table-wrap--stack-mobile .seneu-table { display: block; }
  .seneu-table-wrap--stack-mobile .seneu-table__head { display: none; }
  .seneu-table-wrap--stack-mobile .seneu-table__body,
  .seneu-table-wrap--stack-mobile .seneu-table__row,
  .seneu-table-wrap--stack-mobile .seneu-table__td {
    display: block;
    width: 100%;
  }
  .seneu-table-wrap--stack-mobile .seneu-table__row {
    margin-bottom: var(--space-stack-normal);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-element);
    overflow: hidden;
  }
  .seneu-table-wrap--stack-mobile .seneu-table__row--empty {
    border: none;
  }
  .seneu-table-wrap--stack-mobile .seneu-table__td {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-inline-normal);
    border-bottom: 1px solid var(--color-border-default);
    text-align: right;
  }
  .seneu-table-wrap--stack-mobile .seneu-table__td:last-child { border-bottom: none; }
  .seneu-table-wrap--stack-mobile .seneu-table__td--empty { display: block; text-align: left; }
  .seneu-table-wrap--stack-mobile .seneu-table__td::before {
    content: attr(data-label);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-muted);
    font-size: var(--font-size-xs);
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wide);
    text-align: left;
  }
  .seneu-table-wrap--stack-mobile .seneu-table__td--check {
    justify-content: flex-start;
  }
  .seneu-table-wrap--stack-mobile .seneu-table__td--check::before {
    content: 'Select';
  }
}
</style>
