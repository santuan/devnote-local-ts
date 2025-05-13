<script setup lang="ts">
import { useDatabaseStore } from '@/stores/database'
import { useDocumentStore } from '@/stores/document'
import { useFocusStore } from '@/stores/focus'
import { breakpointsTailwind, useBreakpoints, useMagicKeys, whenever } from '@vueuse/core'
import { Plus } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const keys = useMagicKeys()
const focus_store = useFocusStore()
const document = useDocumentStore()
const database = useDatabaseStore()
const breakpoints = useBreakpoints(breakpointsTailwind)
const magicNewDocument = keys['ctrl+alt+n']
const largerThanLg = breakpoints.greater('lg')
const { t } = useI18n()

whenever(magicNewDocument, () => {
  new_document()
})

function new_document() {
  if (largerThanLg.value === true) {
    document.clear_editor()
    document.content_editable = true
  }
  else {
    document.clear_editor()
    document.show_sidebar_documents = false
    document.content_editable = true
  }
  focusOnTitle()
}

function focusOnTitle() {
  setTimeout(() => {
    focus_store.SetFocusTitle()
  }, 100)
}
</script>

<template>
  <div class="px-0 mx-1 mb-1 mt-1">
    <button
      class="CreateNewButton flex items-center my-0.5 justify-center gap-2 text-xs min-h-8 w-full text-left bg-primary rounded-[1px] focus-within:ring-1 ring-primary"
      :class="{
        'bg-red-600! ring-secondary! text-primary-foreground!': database.loaded_id === null,
        'bg-secondary! text-muted-foreground/50! ': database.loaded_id === '',
      }"
      @click="database.loaded_id === '' ? null : new_document()"
    >
      <Plus v-show="database.loaded_id !== ''" class="size-4 text-primary-foreground" />
      <span v-show="database.loaded_id === ''" class="flex items-center gap-1 text-primary">
        * {{ t("sidebar.newDocument") }}
        <span
          v-show="database.document_name"
          class="inline-block font-bold truncate opacity-80 max-w-24"
        >
          {{ database.document_name }}
        </span>
      </span>
      <span v-show="database.loaded_id !== ''" class="font-bold text-primary-foreground">
        {{ t("sidebar.newDocument") }}
      </span>
    </button>
  </div>
</template>
