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

| Component | Status |
|---|---|
| `SeneuButton` | ✅ |
| `SeneuInput` | ✅ |
| `SeneuTextarea` | ✅ |
| `SeneuSelect` | ✅ |
| `SeneuIcon` | ✅ |

Other components (Sidebar, Table, Modal, etc.) are still in development — see [CLAUDE.md](CLAUDE.md) for the full roadmap.

## License

MIT
