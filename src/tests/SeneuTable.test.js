import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuTable from '../components/display/SeneuTable.vue'

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role' },
]
const rows = [
  { id: 1, name: 'Ayu', role: 'Admin' },
  { id: 2, name: 'Budi', role: 'Editor' },
]

describe('SeneuTable — rendering', () => {
  it('renders a header cell per column', () => {
    const wrapper = mount(SeneuTable, { props: { columns, rows } })
    const headers = wrapper.findAll('.seneu-table__th')
    expect(headers).toHaveLength(2)
    expect(headers[0].text()).toContain('Name')
    expect(headers[1].text()).toBe('Role')
  })

  it('renders a row per data item with cell values', () => {
    const wrapper = mount(SeneuTable, { props: { columns, rows } })
    const dataRows = wrapper.findAll('.seneu-table__body .seneu-table__row')
    expect(dataRows).toHaveLength(2)
    expect(dataRows[0].text()).toContain('Ayu')
    expect(dataRows[0].text()).toContain('Admin')
  })

  it('falls back to an em dash for nullish cell values', () => {
    const wrapper = mount(SeneuTable, {
      props: { columns, rows: [{ id: 1, name: 'Ayu', role: null }] },
    })
    expect(wrapper.find('.seneu-table__td:last-child').text()).toBe('—')
  })

  it('renders custom cell content via the cell-{key} slot', () => {
    const wrapper = mount(SeneuTable, {
      props: { columns, rows },
      slots: { 'cell-name': '<template #cell-name="{ row }"><b class="custom">{{ row.name }}!</b></template>' },
    })
    expect(wrapper.find('.custom').text()).toBe('Ayu!')
  })
})

describe('SeneuTable — empty state', () => {
  it('renders the built-in empty state when there are no rows', () => {
    const wrapper = mount(SeneuTable, { props: { columns, rows: [] } })
    expect(wrapper.find('.seneu-empty-state').exists()).toBe(true)
    expect(wrapper.find('.seneu-empty-state__title').text()).toBe('No data yet')
  })

  it('uses custom empty title/description', () => {
    const wrapper = mount(SeneuTable, {
      props: { columns, rows: [], emptyTitle: 'No members', emptyDescription: 'Invite someone.' },
    })
    expect(wrapper.find('.seneu-empty-state__title').text()).toBe('No members')
  })

  it('renders the empty slot override instead of the default empty state', () => {
    const wrapper = mount(SeneuTable, {
      props: { columns, rows: [] },
      slots: { empty: '<div class="custom-empty">Nothing here</div>' },
    })
    expect(wrapper.find('.custom-empty').exists()).toBe(true)
    expect(wrapper.find('.seneu-empty-state').exists()).toBe(false)
  })
})

describe('SeneuTable — loading', () => {
  it('renders skeleton rows instead of data when loading', () => {
    const wrapper = mount(SeneuTable, { props: { columns, rows, loading: true, skeletonRows: 3 } })
    const skeletonRows = wrapper.findAll('.seneu-table__body .seneu-table__row')
    expect(skeletonRows).toHaveLength(3)
    expect(wrapper.find('.seneu-skeleton').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Ayu')
  })
})

describe('SeneuTable — sorting', () => {
  it('emits sort with asc direction on first click of a sortable column', async () => {
    const wrapper = mount(SeneuTable, { props: { columns, rows } })
    await wrapper.find('.seneu-table__sort-btn').trigger('click')
    expect(wrapper.emitted('sort')[0]).toEqual([{ key: 'name', dir: 'asc' }])
  })

  it('toggles to desc when the same column is already sorted asc', async () => {
    const wrapper = mount(SeneuTable, { props: { columns, rows, sortKey: 'name', sortDir: 'asc' } })
    await wrapper.find('.seneu-table__sort-btn').trigger('click')
    expect(wrapper.emitted('sort')[0]).toEqual([{ key: 'name', dir: 'desc' }])
  })

  it('does not render a sort button for non-sortable columns', () => {
    const wrapper = mount(SeneuTable, { props: { columns, rows } })
    const roleHeader = wrapper.findAll('.seneu-table__th')[1]
    expect(roleHeader.find('.seneu-table__sort-btn').exists()).toBe(false)
  })
})

describe('SeneuTable — selection', () => {
  it('renders a select-all checkbox and one per row when selectable', () => {
    const wrapper = mount(SeneuTable, { props: { columns, rows, selectable: true } })
    expect(wrapper.findAll('.seneu-checkbox, input[type="checkbox"]').length).toBeGreaterThan(0)
    expect(wrapper.find('.seneu-table__th--check').exists()).toBe(true)
  })

  it('emits update:selected with all row ids when select-all is checked', async () => {
    const wrapper = mount(SeneuTable, { props: { columns, rows, selectable: true } })
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    await checkboxes[0].setValue(true)
    expect(wrapper.emitted('update:selected')[0][0]).toEqual([1, 2])
  })

  it('emits update:selected with a single id when one row is checked', async () => {
    const wrapper = mount(SeneuTable, { props: { columns, rows, selectable: true } })
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    await checkboxes[1].setValue(true)
    expect(wrapper.emitted('update:selected')[0][0]).toEqual([1])
  })

  it('applies the selected modifier class to a selected row', () => {
    const wrapper = mount(SeneuTable, { props: { columns, rows, selectable: true, selected: [1] } })
    const dataRows = wrapper.findAll('.seneu-table__body .seneu-table__row')
    expect(dataRows[0].classes()).toContain('seneu-table__row--selected')
    expect(dataRows[1].classes()).not.toContain('seneu-table__row--selected')
  })
})

describe('SeneuTable — clickable rows', () => {
  it('does not emit row-click when clickableRows is false', async () => {
    const wrapper = mount(SeneuTable, { props: { columns, rows } })
    await wrapper.find('.seneu-table__body .seneu-table__row').trigger('click')
    expect(wrapper.emitted('row-click')).toBeFalsy()
  })

  it('emits row-click with the row data when clickableRows is true', async () => {
    const wrapper = mount(SeneuTable, { props: { columns, rows, clickableRows: true } })
    await wrapper.find('.seneu-table__body .seneu-table__row').trigger('click')
    expect(wrapper.emitted('row-click')[0]).toEqual([rows[0]])
  })
})

describe('SeneuTable — modifiers', () => {
  it('applies the striped modifier class', () => {
    const wrapper = mount(SeneuTable, { props: { columns, rows, striped: true } })
    expect(wrapper.find('.seneu-table').classes()).toContain('seneu-table--striped')
  })

  it('applies the stack-on-mobile wrapper class', () => {
    const wrapper = mount(SeneuTable, { props: { columns, rows, stackOnMobile: true } })
    expect(wrapper.find('.seneu-table-wrap').classes()).toContain('seneu-table-wrap--stack-mobile')
  })
})
