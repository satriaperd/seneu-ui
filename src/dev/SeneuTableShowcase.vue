<script setup>
import { ref, computed } from 'vue'
import SeneuTable from '../components/display/SeneuTable.vue'
import SeneuBadge from '../components/display/SeneuBadge.vue'
import SeneuAvatar from '../components/display/SeneuAvatar.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', align: 'center' },
]

const baseRows = [
  { id: 1, name: 'Ayu Lestari', email: 'ayu@cimang.club', role: 'Admin', status: 'active' },
  { id: 2, name: 'Budi Santoso', email: 'budi@cimang.club', role: 'Editor', status: 'active' },
  { id: 3, name: 'Citra Dewi', email: 'citra@cimang.club', role: 'Viewer', status: 'invited' },
  { id: 4, name: 'Doni Prakoso', email: 'doni@cimang.club', role: 'Editor', status: 'suspended' },
  { id: 5, name: 'Eka Wulandari', email: 'eka@cimang.club', role: 'Admin', status: 'active' },
]

const sortKey = ref('')
const sortDir = ref('asc')
const rows = computed(() => {
  if (!sortKey.value) return baseRows
  const sorted = [...baseRows].sort((a, b) => {
    const av = a[sortKey.value]
    const bv = b[sortKey.value]
    return av < bv ? -1 : av > bv ? 1 : 0
  })
  return sortDir.value === 'asc' ? sorted : sorted.reverse()
})
function handleSort({ key, dir }) {
  sortKey.value = key
  sortDir.value = dir
}

const selected = ref([])
const isLoading = ref(false)
const isEmpty = ref(false)
const lastClicked = ref('')

const statusVariant = { active: 'success', invited: 'info', suspended: 'danger' }
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Sortable + Selectable">
      <SeneuTable
        :columns="columns"
        :rows="rows"
        :sort-key="sortKey"
        :sort-dir="sortDir"
        selectable
        :selected="selected"
        @sort="handleSort"
        @update:selected="v => (selected = v)"
      >
        <template #cell-name="{ row }">
          <div class="showcase-name-cell">
            <SeneuAvatar :name="row.name" size="sm" />
            <span>{{ row.name }}</span>
          </div>
        </template>
        <template #cell-status="{ value }">
          <SeneuBadge :variant="statusVariant[value]" type="subtle" size="sm">{{ value }}</SeneuBadge>
        </template>
      </SeneuTable>
      <p class="showcase-caption">{{ selected.length }} baris dipilih. Klik header "Name"/"Role" buat sort.</p>
    </DevShowcaseSection>

    <DevShowcaseSection title="Clickable Rows">
      <SeneuTable :columns="columns" :rows="baseRows" clickable-rows @row-click="row => (lastClicked = row.name)">
        <template #cell-status="{ value }">
          <SeneuBadge :variant="statusVariant[value]" type="subtle" size="sm">{{ value }}</SeneuBadge>
        </template>
      </SeneuTable>
      <p class="showcase-caption">Klik terakhir: {{ lastClicked || '(belum ada)' }}</p>
    </DevShowcaseSection>

    <DevShowcaseSection title="Striped">
      <SeneuTable :columns="columns" :rows="baseRows" striped>
        <template #cell-status="{ value }">
          <SeneuBadge :variant="statusVariant[value]" type="subtle" size="sm">{{ value }}</SeneuBadge>
        </template>
      </SeneuTable>
    </DevShowcaseSection>

    <DevShowcaseSection title="Loading / Empty States">
      <div class="showcase-row">
        <label class="showcase-toggle-label">
          <input v-model="isLoading" type="checkbox" @change="isLoading && (isEmpty = false)" />
          Loading
        </label>
        <label class="showcase-toggle-label">
          <input v-model="isEmpty" type="checkbox" @change="isEmpty && (isLoading = false)" />
          Empty
        </label>
      </div>
      <SeneuTable
        :columns="columns"
        :rows="isEmpty ? [] : baseRows"
        :loading="isLoading"
        empty-title="No members yet"
        empty-description="Invite someone to your workspace to see them here."
      >
        <template #cell-status="{ value }">
          <SeneuBadge :variant="statusVariant[value]" type="subtle" size="sm">{{ value }}</SeneuBadge>
        </template>
      </SeneuTable>
    </DevShowcaseSection>

    <DevShowcaseSection title="Stacked on Mobile">
      <SeneuTable :columns="columns" :rows="baseRows" stack-on-mobile>
        <template #cell-status="{ value }">
          <SeneuBadge :variant="statusVariant[value]" type="subtle" size="sm">{{ value }}</SeneuBadge>
        </template>
      </SeneuTable>
      <p class="showcase-caption">Persempit viewport di bawah 768px — tabel ini berubah jadi layout kartu.</p>
    </DevShowcaseSection>

  </DevShowcase>
</template>

<style scoped>
.showcase-name-cell {
  display: flex;
  align-items: center;
  gap: var(--primitive-space-2);
}

.showcase-row {
  display: flex;
  gap: var(--primitive-space-4);
  margin-bottom: var(--primitive-space-3);
}

.showcase-toggle-label {
  display: inline-flex;
  align-items: center;
  gap: var(--primitive-space-2);
  font-size: var(--font-size-small);
  color: var(--color-text-default);
  cursor: pointer;
}

.showcase-caption {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  margin-top: var(--primitive-space-2);
}
</style>
