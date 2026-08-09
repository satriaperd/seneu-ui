/**
 * Injection key for overriding the icon renderer used by every
 * Seneu UI component. Provide a component at your app root to
 * replace Material Symbols with your own icon set — every
 * component that renders an icon (Button, Input, Alert, Toast, …)
 * picks it up automatically since they all delegate to SeneuIcon.
 *
 * The provided component receives the same props SeneuIcon does:
 * `name`, `size`, `fill`, `weight`, `grade`, `label`. `name` is
 * Seneu UI's internal Material-Symbols-based icon name (e.g.
 * "close", "search", "chevron_left") — map it to your own icon
 * set's equivalent inside your adapter component.
 *
 * @example
 * import { createApp } from 'vue'
 * import { SENEU_ICON_KEY } from '@cimang/seneu-ui'
 * import MyIconAdapter from './MyIconAdapter.vue'
 *
 * const app = createApp(App)
 * app.provide(SENEU_ICON_KEY, MyIconAdapter)
 */
export const SENEU_ICON_KEY = Symbol('seneu-icon-component')
