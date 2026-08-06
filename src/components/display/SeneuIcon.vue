<script setup>
import { computed } from 'vue'

/**
 * Icon from Material Symbols Rounded.
 * Consumers must load the font via Google Fonts or self-host it.
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
</script>

<template>
  <span
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
