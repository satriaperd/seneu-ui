// Seneu UI — entry point
// All components are exported from here

import './main.css'

// === Foundation ===
export { useTheme } from './composables/useTheme.js'
export { default as SeneuIcon } from './components/display/SeneuIcon.vue'

// === Form & Input ===
export { default as SeneuButton }   from './components/form/SeneuButton.vue'
export { default as SeneuInput }    from './components/form/SeneuInput.vue'
export { default as SeneuTextarea } from './components/form/SeneuTextarea.vue'
export { default as SeneuSelect }   from './components/form/SeneuSelect.vue'
export { default as SeneuCheckbox } from './components/form/SeneuCheckbox.vue'
export { default as SeneuRadio }    from './components/form/SeneuRadio.vue'
export { default as SeneuToggle }     from './components/form/SeneuToggle.vue'
export { default as SeneuDatePicker }  from './components/form/SeneuDatePicker.vue'
export { default as SeneuFileUpload }  from './components/form/SeneuFileUpload.vue'
export { default as SeneuSearchBar }   from './components/form/SeneuSearchBar.vue'

// === Layout & Navigation ===
export { default as SeneuSidebar } from './components/layout/SeneuSidebar.vue'
export { default as SeneuTopbar } from './components/layout/SeneuTopbar.vue'
export { default as SeneuBreadcrumb } from './components/layout/SeneuBreadcrumb.vue'
export { default as SeneuTabs } from './components/layout/SeneuTabs.vue'
export { default as SeneuPagination } from './components/layout/SeneuPagination.vue'
// export { default as SeneuStepper } from './components/layout/SeneuStepper.vue'
// export { default as SeneuFooter } from './components/layout/SeneuFooter.vue'
// export { default as SeneuCarousel } from './components/layout/SeneuCarousel.vue'
// export { default as SeneuRichTextEditor } from './components/layout/SeneuRichTextEditor.vue' — built from scratch, not using Tiptap

// === Data Display ===
// export { default as SeneuCard } from './components/display/SeneuCard.vue'
// export { default as SeneuTable } from './components/display/SeneuTable.vue'
// export { default as SeneuBadge } from './components/display/SeneuBadge.vue'
// export { default as SeneuTag } from './components/display/SeneuTag.vue'
// export { default as SeneuTooltip } from './components/display/SeneuTooltip.vue'
// export { default as SeneuAvatar } from './components/display/SeneuAvatar.vue'
// export { default as SeneuStatCard } from './components/display/SeneuStatCard.vue'
// export { default as SeneuChartWrapper } from './components/display/SeneuChartWrapper.vue'
// export { default as SeneuEmptyState } from './components/display/SeneuEmptyState.vue'
// export { default as SeneuSkeleton } from './components/display/SeneuSkeleton.vue'

// === Feedback & Overlay ===
// export { default as SeneuAlert } from './components/feedback/SeneuAlert.vue'
// export { default as SeneuToast } from './components/feedback/SeneuToast.vue'
// export { default as SeneuModal } from './components/feedback/SeneuModal.vue'
// export { default as SeneuDrawer } from './components/feedback/SeneuDrawer.vue'
// export { default as SeneuProgressBar } from './components/feedback/SeneuProgressBar.vue'
// export { default as SeneuSpinner } from './components/feedback/SeneuSpinner.vue'
// export { default as SeneuConfirmDialog } from './components/feedback/SeneuConfirmDialog.vue'

// Token CSS path — documented for consumers
export const tokens = 'seneu-ui/dist/style.css'
