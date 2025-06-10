<script setup lang='ts'>
import { useElementSize } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import Editor from '@/components/ui/Tiptap/EditorTipTap.vue'
import EditorTitle from '@/components/ui/Tiptap/EditorTitle.vue'
import EditorToolbar from '@/components/ui/Tiptap/EditorToolbar.vue'
import { useDatabaseStore } from '@/stores/database'
import { useDocumentStore } from '@/stores/document'
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()
const database = useDatabaseStore()
const document = useDocumentStore()
const { content_editable, show_editor_toolbar } = storeToRefs(document)
const { t } = useI18n()

const toolbarSize = shallowRef(null)
const { height } = useElementSize(toolbarSize)
</script>

<template>
  <div :key="database.loaded_id" class="@container">
    <article class="editor" :style="`--editorToolbar:${height + 50}px`">
      <div v-if="content_editable" class="editor-top">
        <EditorTitle />
        <EditorToolbar v-if="show_editor_toolbar" ref="toolbarSize" />
      </div>
      <Editor v-model="database.document_body" :editable="!document.content_editable" :toolbar="show_editor_toolbar">
        <h2
          v-show="!content_editable"
          class="px-2 md:pl-5 md:p-4 mb-0 font-serif text-4xl md:text-5xl text-foreground md:pb-[1.155rem] font-black text-balance"
          :class="settings.show_heading_one_preview ? '' : 'sr-only'"
        >
          {{ database.document_name }}
        </h2>
      </Editor>
      <button
        v-show="!database.loaded_id" v-if="content_editable" :disabled="database.document_name === ''"
        class=" fixed md:absolute right-0.5 select-none! bottom-0 z-20 h-10 px-3 text-xs text-center left-12 md:left-2 GuardarDocumento disabled:text-foreground/50 focus:bg-primary/50"
        :class="[
          `${database.document_name ? 'bg-primary text-primary-foreground hover:bg-primary/80' : 'disabled bg-secondary pointer-events-none'}`,
        ]" @click="database.create_document()"
      >
        {{ t("editor.save") }}
      </button>
    </article>
  </div>
</template>

<style scoped>
@reference "@/assets/main.css";

.editor {
  @apply relative mx-auto lg:w-full pl-12 @xl:pl-10 md:pl-0 pr-0.5 print:grid-rows-none;
  display: grid;
  min-height: 100vh;
  grid-template-rows: auto 1fr;
}

.editor-top {
  @apply bg-background z-50;
}
</style>
