# Seneu UI

A Vue 3 component library for building CMS and admin panels — pairs with Tailwind CSS, a two-layer design token system, and components that are accessible by default (WCAG 2.2 AA).

> By Cimang Club. Brand color `#FC7A1E`.

## Install

```bash
npm install seneu-ui
```

Vue 3.5+ is required as a peer dependency. ECharts is optional and only needed if you use `SeneuChartWrapper`.

```bash
npm install echarts   # optional, only needed for chart components
```

## Quick Start

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import 'seneu-ui/dist/style.css'

createApp(App).mount('#app')
```

```vue
<script setup>
import { SeneuButton, SeneuInput } from 'seneu-ui'
</script>

<template>
  <SeneuInput v-model="email" label="Email" placeholder="name@email.com" />
  <SeneuButton variant="brand">Save</SeneuButton>
</template>
```

`seneu-ui/dist/style.css` already includes everything components need to render correctly: design tokens (primitive + semantic), a base reset, and fonts. No extra setup required.

## Typography & Font

Seneu UI uses **Inter** for general text and **JetBrains Mono** for code (`<code>`, `<pre>`, `<kbd>`, `<samp>`), plus **Material Symbols Rounded** for `SeneuIcon`.

These fonts are **loaded automatically** as soon as you import `seneu-ui/dist/style.css` — it contains an `@import` pointing to the Google Fonts CDN, so there's no need to add a `<link>` tag or install fonts yourself. Zero-config.

```css
/* already included inside dist/style.css — no need to add this manually */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
```

Every component references the semantic tokens `--font-sans` and `--font-mono` (see [Design Tokens](#design-tokens)), so if your project already has its own font strategy (e.g. a self-hosted font or a different brand font), you can override the tokens without touching any component:

```css
/* in your project's CSS, after importing seneu-ui/dist/style.css */
:root {
  --font-sans: 'Your Custom Font', sans-serif;
}
```

**Performance note:** because fonts are loaded via the Google Fonts CDN, there's one extra network request on first page load. If your project needs full control over font loading (self-hosting, preloading, subsetting), override `--font-sans`/`--font-mono` as shown above — Seneu UI's CDN import will still run in the background but components will no longer use it.

## Using a Custom Icon Set

Material Symbols is the *default* icon set, not a hard requirement. Every component that renders an icon — `SeneuButton`, `SeneuInput`, `SeneuAlert`, `SeneuToast`, all of them — does so through a single internal component, `SeneuIcon`. That means you can swap the entire library's icon set in one place, without touching any component.

Provide a component at the `SENEU_ICON_KEY` injection key from your app root:

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import { SENEU_ICON_KEY } from 'seneu-ui'
import MyIconAdapter from './MyIconAdapter.vue'

const app = createApp(App)
app.provide(SENEU_ICON_KEY, MyIconAdapter)
app.mount('#app')
```

Your adapter component receives the same props `SeneuIcon` does — `name`, `size`, `fill`, `weight`, `grade`, `label` — and renders whatever you want. `name` is Seneu UI's internal Material-Symbols-based icon name (e.g. `"close"`, `"search"`, `"chevron_left"`), so map it to your icon set's equivalent:

```vue
<!-- MyIconAdapter.vue — example using lucide-vue-next -->
<script setup>
import * as icons from 'lucide-vue-next'

const props = defineProps(['name', 'size', 'label'])

// Map Seneu UI's Material-Symbols-style names to your icon set
const ICON_MAP = {
  close: icons.X,
  search: icons.Search,
  chevron_left: icons.ChevronLeft,
  chevron_right: icons.ChevronRight,
  check: icons.Check,
  error: icons.AlertCircle,
  // ...add mappings for every icon name your app actually uses
}
</script>

<template>
  <component
    :is="ICON_MAP[name] || icons.HelpCircle"
    :size="size"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
  />
</template>
```

If you don't provide `SENEU_ICON_KEY`, nothing changes — components fall back to rendering Material Symbols Rounded, as documented above.

## Design Tokens

Seneu UI uses a two-layer token system:

- **Primitive** (`--primitive-*`) — raw values, not meant to be used directly in your code.
- **Semantic** (`--color-*`, `--space-*`, `--font-*`, etc.) — contextual tokens used by components and safe for you to override.

```js
import 'seneu-ui/dist/style.css' // tokens + base + fonts, all-in-one
```

Need just the token CSS without the base reset? Import the token files separately:

```js
import 'seneu-ui/src/tokens/primitive.css'
import 'seneu-ui/src/tokens/semantic.css'
```

## Dark & Light Theme

The default theme follows the device's `prefers-color-scheme`. For manual toggling, use the `useTheme` composable:

```vue
<script setup>
import { useTheme } from 'seneu-ui'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <SeneuButton @click="toggleTheme">
    Switch to {{ theme === 'dark' ? 'light' : 'dark' }}
  </SeneuButton>
</template>
```

## Components

All components below are built, tested, and WCAG 2.2 AA verified in both light and dark theme.

**Foundation**
`SeneuIcon` · `useTheme` · `useToast` · `useConfirmDialog`

**Form & Input**
`SeneuButton` · `SeneuInput` · `SeneuTextarea` · `SeneuSelect` · `SeneuCheckbox` · `SeneuRadio` · `SeneuToggle` · `SeneuDatePicker` · `SeneuFileUpload` · `SeneuSearchBar`

**Layout & Navigation**
`SeneuSidebar` · `SeneuTopbar` · `SeneuBreadcrumb` · `SeneuTabs` · `SeneuPagination` · `SeneuStepper` · `SeneuFooter` · `SeneuCarousel` · `SeneuRichTextEditor`

**Data Display**
`SeneuCard` · `SeneuTable` · `SeneuBadge` · `SeneuTag` · `SeneuTooltip` · `SeneuAvatar` · `SeneuStatCard` · `SeneuChartWrapper` · `SeneuEmptyState` · `SeneuSkeleton`

**Feedback & Overlay**
`SeneuAlert` · `SeneuToast` · `SeneuModal` · `SeneuDrawer` · `SeneuProgressBar` · `SeneuSpinner` · `SeneuConfirmDialog`

`SeneuRichTextEditor` is built on native `contenteditable` + `execCommand` — no Tiptap or other editor dependency needed.

`SeneuChartWrapper` uses ECharts as an optional peer dependency (see [Install](#install)).

## License

MIT
