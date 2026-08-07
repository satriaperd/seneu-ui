<script setup>
import { ref } from 'vue'
import SeneuRichTextEditor from '../components/layout/SeneuRichTextEditor.vue'
import DevShowcase from './DevShowcase.vue'
import DevShowcaseSection from './DevShowcaseSection.vue'

const basic = ref('<p>Halo! Ini <strong>SeneuRichTextEditor</strong> — coba select teks ini terus pencet salah satu tombol toolbar-nya.</p>')
const withCounter = ref('<p>Ketik sesuatu di sini buat lihat word/character counter di bawah.</p>')
const errorDemo = ref('')
const readonlyContent = '<h2>Release Notes v1.11.0</h2><p>Nambahin komponen <strong>SeneuRichTextEditor</strong> — dibikin dari <em>native contenteditable</em>, bukan Tiptap.</p><ul><li>Bold, italic, underline, strikethrough</li><li>Heading &amp; blockquote</li><li>Bullet &amp; numbered list</li><li>Link insert/remove</li></ul>'
const disabledContent = '<p>Field ini lagi <strong>disabled</strong> — toolbar dan area edit-nya gak bisa dipakai.</p>'
const emptyDemo = ref('')
</script>

<template>
  <DevShowcase>

    <DevShowcaseSection title="Basic">
      <SeneuRichTextEditor v-model="basic" label="Deskripsi" />
    </DevShowcaseSection>

    <DevShowcaseSection title="Empty (placeholder)">
      <SeneuRichTextEditor v-model="emptyDemo" label="Catatan" placeholder="Tulis catatan kamu di sini…" />
    </DevShowcaseSection>

    <DevShowcaseSection title="With Word/Character Counter">
      <SeneuRichTextEditor v-model="withCounter" label="Bio" :show-counter="true" />
    </DevShowcaseSection>

    <DevShowcaseSection title="Hint & Error">
      <div class="showcase-col">
        <SeneuRichTextEditor v-model="basic" label="Ringkasan" hint="Maksimal 2 paragraf, fokus ke poin utama." />
        <SeneuRichTextEditor v-model="errorDemo" label="Wajib diisi" error="Konten gak boleh kosong." />
      </div>
    </DevShowcaseSection>

    <DevShowcaseSection title="Disabled">
      <SeneuRichTextEditor :model-value="disabledContent" label="Deskripsi" :disabled="true" />
    </DevShowcaseSection>

    <DevShowcaseSection title="Readonly (toolbar hidden)">
      <SeneuRichTextEditor :model-value="readonlyContent" label="Preview" :readonly="true" />
    </DevShowcaseSection>

    <DevShowcaseSection title="Loading">
      <SeneuRichTextEditor model-value="" label="Deskripsi" :loading="true" />
    </DevShowcaseSection>

    <DevShowcaseSection title="Custom Min Height">
      <SeneuRichTextEditor v-model="basic" label="Artikel" :min-height="320" />
    </DevShowcaseSection>

  </DevShowcase>
</template>

<style scoped>
.showcase-col {
  display: flex;
  flex-direction: column;
  gap: var(--primitive-space-6);
}
</style>
