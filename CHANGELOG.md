# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.23.1] - 2026-08-12

### Changed
- README: added npm version and license badges, linked `CHANGELOG.md` (existed but was never referenced), and noted TypeScript `.d.ts` support (a real, already-shipped feature the README never claimed). First of a planned multi-phase documentation pass — the bigger gap, per-component usage/props docs beyond the Quick Start example, is still open

## [1.23.0] - 2026-08-12

### Added
- `SeneuColorPicker` — new component. Saturation/value square + hue slider, with switchable HEX/RGB/HSL/HSV text inputs inside the popover for typing an exact value in whichever format is convenient. The `format` prop (`hex` default, or `rgb`/`hsl`/`hsv`) controls what string shape `v-model` reads from and emits — the in-popover format tabs are purely a display/input convenience and don't affect it
  - Full keyboard support: arrow keys nudge saturation/value on the SV square and hue on the slider (Shift for a ×10 step), Home/End jump the hue slider to its ends — dragging isn't the only way to operate it
  - Optional `presets` prop for a quick-pick swatch row; `clearable`, `loading`, `disabled`, `hint`/`error`, and `sm`/`base`/`lg` sizes match every other form field's API
  - Fixed a real rounding bug during development, not just a test artifact: converting a color through integer-rounded HSV and back (`hsvToRgb(rgbToHsv(rgb))`) can land ±1 off per channel — e.g. `#FC7A1E` in, `#FC7B1E` shown, with zero user interaction. The picker now keeps the exact input color authoritative (a preset click, a typed hex/RGB value, or the initial `modelValue`) until the user actually manipulates HSV space directly (dragging or arrow-keying the SV square/hue slider, or typing HSL/HSV numbers) — only then does HSV math legitimately take over
  - 44 new Vitest tests covering format parsing/emission in all 4 directions, keyboard nav, pointer drag, presets, and the exactness-preservation behavior above

## [1.22.0] - 2026-08-10

### Added
- 4 new chart colors — `--color-chart-5` through `--color-chart-8` (violet, gold, sky, magenta) — joining the existing teal/indigo/rose/lime, for a full 8-slot categorical palette. `SeneuChartWrapper`'s default color array now draws from all 8. Designed and validated with the `dataviz` skill's `validate_palette.js`: CVD-adjacent separation ΔE 13.1 (target ≥8), normal-vision floor ΔE 23.3 (target ≥15), both comfortably clear in the append order that preserves the existing `chart-1`..`chart-4` slots (no reordering — a reorder would've silently changed what an existing consumer's `chart-4` reference renders). `chart-5` (gold) joins `chart-4` (lime) in the validator's sub-3:1 contrast WARN band — same as before, pair with a legend or direct labels rather than color alone
- Full 10-step primitive color scales for Danger/Error (`red-*`), Warning (`amber-*`), Success (`green-*`), and Info (`blue-*`) are now visualized in the dev Token Preview, matching the Brand and Neutral sections. These scales already existed in `primitive.css` — they just weren't surfaced anywhere to look at

### Fixed
- `SeneuCheckbox` and `SeneuRadio`'s multi-line label+description case simplified to a clean `align-items: flex-start` with no sub-pixel nudge — the previous 1-2px offset (left over from before the center-alignment fix in v1.21.8) made "aligned to top" not quite read as flush

## [1.21.8] - 2026-08-10

### Fixed
- `SeneuCheckbox` and `SeneuRadio` vertically top-aligned the box/dot against the label instead of centering it, making a single-line label look like it trailed below center. Now centers by default (matching the pattern `SeneuToggle` already used correctly) and only top-aligns when a `description` is present, where aligning to the first line is the correct behavior. Verified this also mirrors correctly under `dir="rtl"` with zero extra CSS — the box moves to the right of the label automatically and stays perfectly centered, since the layout only ever used `display: flex` + `gap` (no hardcoded left/right offsets)

## [1.21.7] - 2026-08-10

### Changed
- Tightened `--space-component-gap` (label → field → hint/error spacing inside `SeneuInput`, `SeneuTextarea`, `SeneuSelect`, `SeneuCheckbox`, `SeneuRadio`, `SeneuToggle`, `SeneuDatePicker`, `SeneuFileUpload`, `SeneuSearchBar`, `SeneuRichTextEditor`) from `--primitive-space-3` (12px) to `--primitive-space-1` (4px). 12px read as too loose for a label directly coupled to its own field — closer coupling is the more conventional pattern for admin/CMS form density

## [1.21.6] - 2026-08-10

### Fixed
- **`@layer base`, not `@layer seneu-base`.** v1.21.5 wrapped the reset in a layer so host CSS would win, but used a private layer name — and a private name's cascade position is decided by whichever stylesheet mentions it *first* across the whole page. In apps that declare their own layers (e.g. Tailwind's `@layer theme, base, components, utilities;`) before loading this library's CSS, `seneu-base` was a name nobody had seen yet, so it got appended at the very end of the layer order — outranking `utilities` and defeating the fix entirely, confirmed by a real-world report against a Tailwind-based consumer app (gap: 0px where `space-y-*` should have applied). Renamed to `@layer base`, the same name Tailwind itself uses for exactly this purpose (element defaults that `utilities` always overrides) — reusing that name merges Seneu UI's reset into the same fixed layer position regardless of load order. Verified in a real browser in both directions: host CSS loaded before this library's stylesheet, and this library's stylesheet loaded before host CSS (the order this README recommends)

## [1.21.5] - 2026-08-10

### Fixed
- **`dist/style.css` no longer bundles Tailwind's entire engine.** The library's CSS entry (`src/main.css`, imported by `src/index.js`) also `@import`ed `tailwindcss` — needed only for the internal dev playground's own layout, never by actual components — so every published build shipped Tailwind's full Preflight, its `theme`/`base`/`components`/`utilities`/`properties` layers, and JIT-generated utility classes from dev-only files. Split into a dev-only CSS entry (`src/dev/dev.css`) that still pulls in Tailwind for the playground; the shipped entry now contains only design tokens and Seneu UI's own minimal reset
- **The base reset now composes correctly with host CSS frameworks.** It previously lived as plain unlayered CSS, which — per the CSS Cascade Layers spec — always wins over layered rules regardless of specificity or source order. Tailwind (and other frameworks that wrap their own utilities in `@layer`) lost every spacing/margin utility to Seneu UI's reset no matter how specific the selector was. The reset now lives inside a named layer, `@layer seneu-base`, so any host app's CSS — plain custom CSS, Bootstrap, or a layered framework loaded after this library's stylesheet — wins automatically. Verified in a real browser against both an unlayered override and a Tailwind-style `@layer utilities` override

Also documented this composability guarantee in the README ("Works Alongside Any CSS Framework").

### Added
- `LICENSE` file (MIT, Cimang Club) — `package.json` declared `"license": "MIT"` but the actual license text never shipped with the package

## [1.21.3] - 2026-08-09

### Added
- This changelog

## [1.21.2] - 2026-08-09

### Changed
- Publish as the scoped package `@cimang/seneu-ui` with `publishConfig.access: public`
- Fix `repository.url` in `package.json` — it pointed at the `seneu-cms` reference project instead of this repo; the GitHub repo itself is renamed from `senue-ui` to `seneu-ui`
- Update every import example (README, JSDoc, the exported `tokens` path) to the scoped package specifier

## [1.21.1] - 2026-08-09

### Fixed
- Build now emits `dist/style.css` as documented. The Vite build previously hardcoded the CSS output filename to `tokens.css`, which didn't match `package.json`'s `exports` map or any usage example in the README — following the README's own Quick Start would fail with a module-not-found error

## [1.21.0] - 2026-08-09

### Added
- Pluggable custom icon sets via `SENEU_ICON_KEY`. Every component renders icons through `SeneuIcon` internally, so providing a component at this injection key from your app root swaps the icon set library-wide (Button, Input, Alert, Toast, etc.) without touching individual components. Falls back to Material Symbols Rounded when nothing is provided

This release completes every component and cross-cutting concern in the CLAUDE.md checklist.

## [1.20.0] - 2026-08-09

### Added
- `SeneuToast` + `useToast` — imperative toast notifications (`toast.success()`, `.error()`, `.warning()`, `.info()`, `.show()`), 6 positions with direction-aware transitions, persistent toasts via `duration: 0`
- Auto-dismiss pauses on hover/focus and resumes from the remaining time rather than restarting (WCAG 2.2.1 Timing Adjustable)

## [1.19.0] - 2026-08-09

### Added
- `SeneuDrawer` — off-canvas panel from any edge (left/right/top/bottom), sharing `SeneuModal`'s real focus-trap behavior
- `SeneuConfirmDialog` + `useConfirmDialog` — promise-based replacement for `window.confirm()`; mount once, then `await confirm({ title, message, variant, onConfirm })` from anywhere. Async `onConfirm` shows a loading state and suspends dismissal while pending

## [1.18.0] - 2026-08-09

### Added
- `SeneuAlert` — inline status banner, 6 variants × 3 types (subtle/solid/outline), dismissible
- `SeneuModal` — Teleport-based dialog with a real WAI-ARIA focus trap (Tab/Shift+Tab cycling, initial focus on open, focus restored to the trigger on close), sm–fullscreen sizes

### Fixed
- `SeneuButton` never actually emitted `click` — `defineEmits(['click'])` was declared but `emit('click', ...)` was never called, and Vue excludes attrs matching a declared emit from automatic fallthrough. Every `@click` listener on `SeneuButton` across every consumer silently did nothing until this fix

## [1.17.0] - 2026-08-07

### Added
- `SeneuSpinner` — rotating loading indicator, 5 sizes, 6 variants + inverted
- `SeneuProgressBar` — determinate/indeterminate, striped/animated fill, full progressbar ARIA wiring

## [1.16.0] - 2026-08-07

### Added
- `SeneuChartWrapper` — wraps the Apache ECharts lifecycle (dynamic import of the optional peer dependency, resize via `ResizeObserver`, live re-theming on light/dark toggle). Falls back to a clear notice instead of crashing when `echarts` isn't installed

## [1.15.0] - 2026-08-07

### Added
- `SeneuTooltip` — hover/focus bubble, 4 placements with viewport-aware auto-flip
- `SeneuTable` — sortable columns, row selection with indeterminate select-all, per-column cell slots, opt-in stacked-card layout below the mobile breakpoint

## [1.14.0] - 2026-08-07

### Added
- `SeneuAvatar` — image → initials → icon fallback chain, deterministic tonal color per name
- `SeneuStatCard` — label/value/trend layout with an optional icon badge

## [1.13.0] - 2026-08-07

### Added
- `SeneuSkeleton` — shimmer placeholder (text/title/circle/rect/button variants)
- `SeneuEmptyState` — icon + title + description + actions layout for informative, actionable empty states

## [1.12.0] - 2026-08-07

### Added
- `SeneuCard` — default/elevated/outlined/flat variants, renders as `div`/`button`/`a` depending on interactivity
- `SeneuBadge` (passive status pill) and `SeneuTag` (interactive, removable/selectable chip)

## [1.11.0] - 2026-08-07

### Added
- `SeneuRichTextEditor` — built on native `contenteditable` + `execCommand`, no Tiptap/Quill dependency. Bold/italic/underline/strikethrough, headings, lists, alignment, link insert/remove, undo/redo, word/character counter

## [1.10.0] - 2026-08-07

### Added
- `SeneuStepper` — numbered/dot/icon variants, horizontal/vertical orientation
- `SeneuFooter` — simple and columns layouts
- `SeneuCarousel` — slide/fade transitions, autoplay with pause-on-hover/focus (WCAG 2.2.2)

## [1.9.0] - 2026-08-07

### Added
- `SeneuTabs` — line/pill/boxed variants, full WAI-ARIA tabs pattern with automatic activation
- `SeneuPagination` — numbered and simple variants

## [1.8.0] - 2026-08-07

### Added
- `SeneuTopbar` — title, menu-toggle, search/actions/user-menu slots
- `SeneuBreadcrumb` — router-agnostic, 4 separator styles, collapsing with an expandable ellipsis

## [1.7.0] - 2026-08-07

### Added
- `SeneuSidebar` — collapsible desktop rail, locked icon-only rail on tablet, off-canvas mobile drawer

## [1.6.0] - 2026-08-07

### Added
- `SeneuFileUpload` — dropzone and compact variants, image preview grid, per-file status, validation (maxSize/maxFiles/accept)
- `SeneuSearchBar` — default/compact/trigger (⌘K-style) variants, grouped suggestions dropdown, controlled recent-searches list

## [1.5.0] - 2026-08-06

### Added
- `SeneuDatePicker` — single-date and range modes, typeable text input with a dependency-free format/parse engine, full keyboard navigation, range presets, native `<input type="date">` fallback

## [1.4.1] - 2026-08-06

### Fixed
- Form field ids collided across instances (`useId()`-less counter reset on every mount), so clicking one item's `<label>` could activate a different input
- `SeneuCheckbox`/`SeneuRadio`/`SeneuToggle` resting (unchecked/off) state used the brand-orange interactive color, making unchecked and checked states nearly identical

## [1.4.0] - 2026-08-06

### Added
- `SeneuCheckbox` — boolean or array (group) `modelValue`, indeterminate state
- `SeneuRadio` — single radio designed for grouping via shared `v-model` + `name`
- `SeneuToggle` — on/off switch with reversible label placement

## [1.3.1] - 2026-08-06

### Changed
- Translated all documentation and code comments to English (README, JSDoc, token CSS headers) per the library's English-only documentation policy

## [1.3.0] - 2026-08-06

### Added
- `SeneuTextarea` — character counter with near-limit warning
- `SeneuSelect` — flat options list, disabled options, custom `<option>`/`<optgroup>` slot

## [1.2.0] - 2026-08-06

### Added
- `SeneuInput` — label/hint/error messaging, left/right icon slots, password visibility toggle, clearable, loading state

## [1.1.0] - 2026-05-16

### Added
- `SeneuButton` — 6 variants, 3 sizes, icon/icon-only support, loading and disabled states

## [1.0.0] - 2026-05-16

### Added
- Initial project scaffold: two-layer design token system (primitive + semantic) covering color, typography, spacing, radius, elevation, z-index, and animation
- Dark theme via `.dark` class with full token overrides, `useTheme` composable
- `SeneuIcon` (Material Symbols Rounded)
- Vite library-mode build (ESM + UMD) with TypeScript declaration generation

[1.23.1]: https://github.com/satriaperd/seneu-ui/compare/f3120e2...HEAD
[1.23.0]: https://github.com/satriaperd/seneu-ui/compare/ae1a94e...f3120e2
[1.22.0]: https://github.com/satriaperd/seneu-ui/compare/21babfe...ae1a94e
[1.21.8]: https://github.com/satriaperd/seneu-ui/compare/806477b...21babfe
[1.21.7]: https://github.com/satriaperd/seneu-ui/compare/3b46888...806477b
[1.21.6]: https://github.com/satriaperd/seneu-ui/compare/3f9049a...3b46888
[1.21.5]: https://github.com/satriaperd/seneu-ui/compare/592e8b3...3f9049a
[1.21.4]: https://github.com/satriaperd/seneu-ui/compare/34713a5...592e8b3
[1.21.3]: https://github.com/satriaperd/seneu-ui/compare/8f8e4f4...34713a5
[1.21.2]: https://github.com/satriaperd/seneu-ui/compare/9c13e8b...8f8e4f4
[1.21.1]: https://github.com/satriaperd/seneu-ui/compare/f7506d9...aa23799
[1.21.0]: https://github.com/satriaperd/seneu-ui/compare/193b960...9c13e8b
[1.20.0]: https://github.com/satriaperd/seneu-ui/compare/c5b1c1a...f7506d9
[1.19.0]: https://github.com/satriaperd/seneu-ui/compare/5b4b327...193b960
[1.18.0]: https://github.com/satriaperd/seneu-ui/compare/6c8a669...c5b1c1a
[1.17.0]: https://github.com/satriaperd/seneu-ui/compare/bccb14e...5b4b327
[1.16.0]: https://github.com/satriaperd/seneu-ui/compare/030c66c...6c8a669
[1.15.0]: https://github.com/satriaperd/seneu-ui/compare/a7dddcf...bccb14e
[1.14.0]: https://github.com/satriaperd/seneu-ui/compare/0980f97...030c66c
[1.13.0]: https://github.com/satriaperd/seneu-ui/compare/4e779da...a7dddcf
[1.12.0]: https://github.com/satriaperd/seneu-ui/compare/a323e61...0980f97
[1.11.0]: https://github.com/satriaperd/seneu-ui/compare/8331478...4e779da
[1.10.0]: https://github.com/satriaperd/seneu-ui/compare/632b277...a323e61
[1.9.0]: https://github.com/satriaperd/seneu-ui/compare/df34d83...8331478
[1.8.0]: https://github.com/satriaperd/seneu-ui/compare/645e8e0...632b277
[1.7.0]: https://github.com/satriaperd/seneu-ui/compare/e6d9af3...df34d83
[1.6.0]: https://github.com/satriaperd/seneu-ui/compare/46426c6...645e8e0
[1.5.0]: https://github.com/satriaperd/seneu-ui/compare/dd0aa67...e6d9af3
[1.4.1]: https://github.com/satriaperd/seneu-ui/compare/dd0aa67...46426c6
[1.4.0]: https://github.com/satriaperd/seneu-ui/compare/64c27d7...dd0aa67
[1.3.1]: https://github.com/satriaperd/seneu-ui/compare/5899be3...64c27d7
[1.3.0]: https://github.com/satriaperd/seneu-ui/compare/9b8bf0f...5899be3
[1.2.0]: https://github.com/satriaperd/seneu-ui/compare/688472c...9b8bf0f
[1.1.0]: https://github.com/satriaperd/seneu-ui/compare/7c7926e...688472c
[1.0.0]: https://github.com/satriaperd/seneu-ui/releases/tag/v1.0.0
