<script setup>
import { ref } from 'vue'
import SeneuInput from '../components/form/SeneuInput.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const text     = ref('')
const email    = ref('')
const password = ref('')
const search   = ref('Hello world')
const number   = ref('')
const errorVal = ref('bad@')
const username = ref('satria_perdana')
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Basic">
      <div class="showcase-col">
        <SeneuInput v-model="text"  label="Full name"     placeholder="e.g. Satria Perdana" />
        <SeneuInput v-model="email" label="Email address" placeholder="you@example.com" type="email" />
        <SeneuInput                 label="Read-only"     :model-value="'Cimora CMS'" :readonly="true" />
        <SeneuInput                 label="Disabled"      placeholder="Can't touch this"  :disabled="true" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Password">
      <div class="showcase-col">
        <SeneuInput
          v-model="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          hint="Min. 8 characters"
        />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="With Icons">
      <div class="showcase-col">
        <SeneuInput v-model="search" label="Search" icon="search"   placeholder="Search anything…" />
        <SeneuInput v-model="email"  label="Email"  icon="mail"     placeholder="you@example.com" type="email" icon-right="verified" />
        <SeneuInput v-model="number" label="Amount" icon="payments" placeholder="0.00" type="number" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Clearable">
      <div class="showcase-col">
        <SeneuInput
          v-model="search"
          label="Clearable search"
          icon="search"
          :clearable="true"
          placeholder="Type something, then clear…"
        />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Hint & Error">
      <div class="showcase-col">
        <SeneuInput
          v-model="text"
          label="Username"
          placeholder="satria_perdana"
          hint="Only letters, numbers, and underscores."
        />
        <SeneuInput
          v-model="errorVal"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error="Please enter a valid email address."
        />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Loading">
      <div class="showcase-col">
        <SeneuInput
          v-model="username"
          label="Username"
          placeholder="Checking availability…"
          :loading="true"
          hint="Checking if this username is available…"
        />
        <SeneuInput
          v-model="search"
          label="Loading + clearable (spinner wins)"
          icon="search"
          :clearable="true"
          :loading="true"
        />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Sizes">
      <div class="showcase-col">
        <SeneuInput v-model="text" label="Small"  size="sm"   icon="person" placeholder="Small input" />
        <SeneuInput v-model="text" label="Base"   size="base" icon="person" placeholder="Base input" />
        <SeneuInput v-model="text" label="Large"  size="lg"   icon="person" placeholder="Large input" />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Live value">
      <div class="showcase-col">
        <SeneuInput v-model="text" label="Type here" placeholder="…" />
        <p class="showcase-value">
          Value: <code>{{ text || '(empty)' }}</code>
        </p>
      </div>
    </DevShowcaseSection>

  </DevShowcase>
</template>

<style scoped>
.showcase-col {
  display:        flex;
  flex-direction: column;
  gap:            var(--primitive-space-4);
  max-width:      480px;
}

.showcase-value {
  font-size:  var(--font-size-small);
  color:      var(--color-text-muted);
}

.showcase-value code {
  font-family: var(--font-mono);
  color:       var(--color-text-brand);
}
</style>
