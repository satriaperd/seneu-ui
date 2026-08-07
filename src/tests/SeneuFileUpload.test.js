import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeneuFileUpload from '../components/form/SeneuFileUpload.vue'

function makeFile(name, size = 1024, type = 'text/plain') {
  const file = new File(['x'.repeat(size)], name, { type })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

async function selectFiles(wrapper, files) {
  const input = wrapper.find('input[type="file"]')
  Object.defineProperty(input.element, 'files', { value: files, configurable: true })
  await input.trigger('change')
}

describe('SeneuFileUpload — rendering', () => {
  it('renders a dropzone by default', () => {
    const wrapper = mount(SeneuFileUpload)
    expect(wrapper.find('.seneu-fileupload__dropzone').exists()).toBe(true)
  })

  it('renders compact variant', () => {
    const wrapper = mount(SeneuFileUpload, { props: { variant: 'compact' } })
    expect(wrapper.find('.seneu-fileupload__compact').exists()).toBe(true)
    expect(wrapper.find('.seneu-fileupload__dropzone').exists()).toBe(false)
  })

  it('renders label when prop is set', () => {
    const wrapper = mount(SeneuFileUpload, { props: { label: 'Documents' } })
    expect(wrapper.find('.seneu-fileupload__label').text()).toBe('Documents')
  })

  it('shows empty summary in compact variant with no files', () => {
    const wrapper = mount(SeneuFileUpload, { props: { variant: 'compact' } })
    expect(wrapper.find('.seneu-fileupload__compact-summary').text()).toBe('Belum ada file dipilih')
  })
})

describe('SeneuFileUpload — adding files', () => {
  it('emits update:modelValue with a new entry on file selection', async () => {
    const wrapper = mount(SeneuFileUpload, { props: { modelValue: [] } })
    await selectFiles(wrapper, [makeFile('doc.txt', 1024)])
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted[0][0]).toHaveLength(1)
    expect(emitted[0][0][0].name).toBe('doc.txt')
  })

  it('emits add with the newly added entries', async () => {
    const wrapper = mount(SeneuFileUpload, { props: { modelValue: [] } })
    await selectFiles(wrapper, [makeFile('doc.txt', 1024)])
    expect(wrapper.emitted('add')?.[0][0]).toHaveLength(1)
  })

  it('defaults new entries to pending status', async () => {
    const wrapper = mount(SeneuFileUpload, { props: { modelValue: [] } })
    await selectFiles(wrapper, [makeFile('doc.txt', 1024)])
    expect(wrapper.emitted('update:modelValue')[0][0][0].status).toBe('pending')
  })

  it('only accepts the first file when multiple is false', async () => {
    const wrapper = mount(SeneuFileUpload, { props: { modelValue: [], multiple: false } })
    await selectFiles(wrapper, [makeFile('a.txt'), makeFile('b.txt')])
    expect(wrapper.emitted('update:modelValue')[0][0]).toHaveLength(1)
  })

  it('generates a previewUrl for image files', async () => {
    const wrapper = mount(SeneuFileUpload, { props: { modelValue: [] } })
    await selectFiles(wrapper, [makeFile('photo.png', 2048, 'image/png')])
    expect(wrapper.emitted('update:modelValue')[0][0][0].previewUrl).toBeTruthy()
  })

  it('does not generate a previewUrl when showPreview is false', async () => {
    const wrapper = mount(SeneuFileUpload, { props: { modelValue: [], showPreview: false } })
    await selectFiles(wrapper, [makeFile('photo.png', 2048, 'image/png')])
    expect(wrapper.emitted('update:modelValue')[0][0][0].previewUrl).toBeNull()
  })
})

describe('SeneuFileUpload — validation', () => {
  it('rejects files exceeding maxSize and emits error', async () => {
    const wrapper = mount(SeneuFileUpload, { props: { modelValue: [], maxSize: 100 } })
    await selectFiles(wrapper, [makeFile('big.txt', 500)])
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    expect(wrapper.emitted('error')?.[0][0].reason).toBe('size')
  })

  it('shows the validation message in the field', async () => {
    const wrapper = mount(SeneuFileUpload, { props: { modelValue: [], maxSize: 100 } })
    await selectFiles(wrapper, [makeFile('big.txt', 500)])
    expect(wrapper.find('.seneu-fileupload__message--error').exists()).toBe(true)
  })

  it('rejects the whole batch when it would exceed maxFiles', async () => {
    const wrapper = mount(SeneuFileUpload, { props: { modelValue: [], maxFiles: 1 } })
    await selectFiles(wrapper, [makeFile('a.txt'), makeFile('b.txt')])
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    expect(wrapper.emitted('error')?.[0][0].reason).toBe('count')
  })

  it('rejects files that do not match accept', async () => {
    const wrapper = mount(SeneuFileUpload, { props: { modelValue: [], accept: 'image/*' } })
    await selectFiles(wrapper, [makeFile('doc.txt', 100, 'text/plain')])
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    expect(wrapper.emitted('error')?.[0][0].reason).toBe('type')
  })

  it('accepts files matching an extension pattern', async () => {
    const wrapper = mount(SeneuFileUpload, { props: { modelValue: [], accept: '.pdf' } })
    await selectFiles(wrapper, [makeFile('report.pdf', 100, 'application/pdf')])
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})

describe('SeneuFileUpload — remove', () => {
  it('emits update:modelValue without the removed entry', async () => {
    const entry = { id: 'seneu-file-1', name: 'a.txt', size: 10, previewUrl: null, status: 'pending', progress: 0, error: '' }
    const wrapper = mount(SeneuFileUpload, { props: { modelValue: [entry] } })
    await wrapper.find('.seneu-fileupload__item-remove').trigger('click')
    expect(wrapper.emitted('update:modelValue')[0][0]).toEqual([])
  })

  it('emits remove with the removed entry', async () => {
    const entry = { id: 'seneu-file-1', name: 'a.txt', size: 10, previewUrl: null, status: 'pending', progress: 0, error: '' }
    const wrapper = mount(SeneuFileUpload, { props: { modelValue: [entry] } })
    await wrapper.find('.seneu-fileupload__item-remove').trigger('click')
    expect(wrapper.emitted('remove')[0][0]).toEqual(entry)
  })
})

describe('SeneuFileUpload — file list rendering', () => {
  it('renders non-image files in the file list', () => {
    const entry = { id: '1', name: 'a.txt', size: 2048, previewUrl: null, status: 'pending', progress: 0, error: '', icon: 'draft' }
    const wrapper = mount(SeneuFileUpload, { props: { modelValue: [entry] } })
    expect(wrapper.find('.seneu-fileupload__item-name').text()).toBe('a.txt')
  })

  it('renders image files in the preview grid', () => {
    const entry = { id: '1', name: 'a.png', size: 2048, previewUrl: 'blob:mock', status: 'pending', progress: 0, error: '' }
    const wrapper = mount(SeneuFileUpload, { props: { modelValue: [entry] } })
    expect(wrapper.find('.seneu-fileupload__thumb').exists()).toBe(true)
  })

  it('shows a progress bar for uploading entries', () => {
    const entry = { id: '1', name: 'a.txt', size: 2048, previewUrl: null, status: 'uploading', progress: 42, error: '', icon: 'draft' }
    const wrapper = mount(SeneuFileUpload, { props: { modelValue: [entry] } })
    expect(wrapper.find('.seneu-fileupload__item-bar').attributes('style')).toContain('42%')
  })

  it('shows a done indicator for completed entries', () => {
    const entry = { id: '1', name: 'a.txt', size: 2048, previewUrl: null, status: 'done', progress: 100, error: '', icon: 'draft' }
    const wrapper = mount(SeneuFileUpload, { props: { modelValue: [entry] } })
    expect(wrapper.find('.seneu-fileupload__item-done').exists()).toBe(true)
  })

  it('shows an error message for failed entries', () => {
    const entry = { id: '1', name: 'a.txt', size: 2048, previewUrl: null, status: 'error', progress: 0, error: 'Upload gagal', icon: 'draft' }
    const wrapper = mount(SeneuFileUpload, { props: { modelValue: [entry] } })
    expect(wrapper.find('.seneu-fileupload__item--error').exists()).toBe(true)
    expect(wrapper.find('.seneu-fileupload__item-meta--error').text()).toContain('Upload gagal')
  })
})

describe('SeneuFileUpload — drag and drop', () => {
  it('applies dragging class on dragover', async () => {
    const wrapper = mount(SeneuFileUpload)
    await wrapper.find('.seneu-fileupload__dropzone').trigger('dragover')
    expect(wrapper.find('.seneu-fileupload__dropzone--dragging').exists()).toBe(true)
  })

  it('clears dragging class on dragleave', async () => {
    const wrapper = mount(SeneuFileUpload)
    const zone = wrapper.find('.seneu-fileupload__dropzone')
    await zone.trigger('dragover')
    await zone.trigger('dragleave')
    expect(wrapper.find('.seneu-fileupload__dropzone--dragging').exists()).toBe(false)
  })

  it('adds files on drop', async () => {
    const wrapper = mount(SeneuFileUpload, { props: { modelValue: [] } })
    await wrapper.find('.seneu-fileupload__dropzone').trigger('drop', {
      dataTransfer: { files: [makeFile('dropped.txt')] },
    })
    expect(wrapper.emitted('update:modelValue')[0][0]).toHaveLength(1)
  })
})

describe('SeneuFileUpload — disabled & loading', () => {
  it('sets disabled attribute on the native input', () => {
    const wrapper = mount(SeneuFileUpload, { props: { disabled: true } })
    expect(wrapper.find('input[type="file"]').attributes('disabled')).toBeDefined()
  })

  it('does not add files when disabled', async () => {
    const wrapper = mount(SeneuFileUpload, { props: { modelValue: [], disabled: true } })
    await selectFiles(wrapper, [makeFile('a.txt')])
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('shows a spinner in the dropzone when loading', () => {
    const wrapper = mount(SeneuFileUpload, { props: { loading: true } })
    expect(wrapper.find('.seneu-fileupload__icon--spin').exists()).toBe(true)
  })

  it('does not add files when loading', async () => {
    const wrapper = mount(SeneuFileUpload, { props: { modelValue: [], loading: true } })
    await selectFiles(wrapper, [makeFile('a.txt')])
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })
})

describe('SeneuFileUpload — size', () => {
  const sizes = ['sm', 'base', 'lg']
  for (const size of sizes) {
    it(`applies .seneu-fileupload--${size} class`, () => {
      const wrapper = mount(SeneuFileUpload, { props: { size } })
      expect(wrapper.classes()).toContain(`seneu-fileupload--${size}`)
    })
  }
})
