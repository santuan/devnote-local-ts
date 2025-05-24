<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { Plus } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useDatabaseStore } from '@/stores/database'
import { useDocumentStore } from '@/stores/document'
import { useFocusStore } from '@/stores/focus'

const focus = useFocusStore()
const database = useDatabaseStore()
const document = useDocumentStore()
const breakpoints = useBreakpoints(breakpointsTailwind)
const largerThanLg = breakpoints.greater('lg')
const { loaded_id } = storeToRefs(database)
const { t } = useI18n()

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
    focus.SetFocusTitle()
  }, 100)
}
</script>

<template>
  <button
    class="CreateNewButton flex items-center justify-center gap-2 text-xs size-8 w-full text-left bg-primary focus-within:ring-1 ring-primary text-primary-foreground"
    :class="{
      'bg-secondary! ring-secondary! text-primary-foreground!': loaded_id === null,
      'bg-secondary/30! text-primary! ': loaded_id === '',
    }"
    @click="new_document()"
  >
    <Plus class="size-4" />
    <span class="sr-only">{{ t("sidebar.newDocument") }}</span>
  </button>
</template>
