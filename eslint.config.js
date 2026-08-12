import pluginVue from 'eslint-plugin-vue'
import js from '@eslint/js'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        navigator: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        URL: 'readonly',
        File: 'readonly',
        Node: 'readonly',
        getComputedStyle: 'readonly',
        ResizeObserver: 'readonly',
        KeyboardEvent: 'readonly',
        Event: 'readonly',
        MouseEvent: 'readonly',
        PointerEvent: 'readonly',
        Element: 'readonly',
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/html-self-closing': ['warn', { html: { void: 'always', normal: 'always', component: 'always' } }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',

      // This codebase deliberately favors dense, aligned formatting
      // (multiple attrs per line, aligned colons/spaces) over the
      // one-attribute-per-line style eslint-plugin-vue's recommended
      // preset assumes — off instead of fighting hundreds of warnings.
      'vue/max-attributes-per-line': 'off',
      'vue/no-multi-spaces': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
    },
  },
]
