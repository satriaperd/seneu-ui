<script setup>
import { computed, inject } from 'vue'
import { SENEU_ICON_KEY } from '../../composables/useIcon.js'

/**
 * Icon from Material Symbols Rounded by default.
 * Consumers must load the font via Google Fonts or self-host it —
 * unless a custom icon component was provided via SENEU_ICON_KEY,
 * in which case that component renders instead (see useIcon.js).
 * Every other Seneu UI component renders icons through this one,
 * so providing SENEU_ICON_KEY swaps the icon set library-wide.
 *
 * @see https://fonts.google.com/icons
 */
const props = defineProps({
  /** Material Symbols icon name (snake_case) */
  name: {
    type: String,
    required: true,
  },
  /** Size in px — also controls optical size (opsz) */
  size: {
    type: Number,
    default: 20,
  },
  /** Filled variant */
  fill: {
    type: Boolean,
    default: false,
  },
  /** Font weight (100–700) */
  weight: {
    type: Number,
    default: 300,
  },
  /** Grade: fine-tunes stroke weight (-50 to 200) */
  grade: {
    type: Number,
    default: 0,
  },
  /**
   * Accessibility label for meaningful icons.
   * If omitted, the icon is treated as decorative (aria-hidden).
   */
  label: {
    type: String,
    default: '',
  },
})

const style = computed(() => ({
  fontSize:             `${props.size}px`,
  fontVariationSettings: `'FILL' ${props.fill ? 1 : 0}, 'wght' ${props.weight}, 'GRAD' ${props.grade}, 'opsz' ${props.size}`,
}))

const CustomIcon = inject(SENEU_ICON_KEY, null)
</script>

<template>
  <component
    :is="CustomIcon"
    v-if="CustomIcon"
    :name="name"
    :size="size"
    :fill="fill"
    :weight="weight"
    :grade="grade"
    :label="label"
  />
  <span
    v-else
    class="seneu-icon"
    :style="style"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
  >{{ name }}</span>
</template>

<style>
.seneu-icon {
  font-family:      'Material Symbols Rounded';
  font-weight:      normal;
  font-style:       normal;
  line-height:      1;
  letter-spacing:   normal;
  text-transform:   none;
  display:          inline-flex;
  align-items:      center;
  white-space:      nowrap;
  word-wrap:        normal;
  direction:        ltr;
  user-select:      none;
  flex-shrink:      0;
}
</style>
