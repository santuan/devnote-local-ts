<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Ripple from '@/components/ui/Inspira/Ripple/Ripple.vue'
import { useDocumentStore } from '@/stores/document'
import { useFocusStore } from '@/stores/focus'

const document = useDocumentStore()
const focus = useFocusStore()
const { t } = useI18n()

function focusOnTitle() {
  document.toggle_editable()
  setTimeout(() => {
    focus.SetFocusTitle()
  }, 100)
}

function focusOnTitleEsc(e: { keyCode: number }) {
  if (e.keyCode === 27) {
    document.toggle_editable()
    setTimeout(() => {
      focus.SetFocusTitle()
    }, 100)
  }
}
</script>

<template>
  <div
    role="alert"
    class="absolute ring-2 ring-primary w-40 sm:w-auto top-0.5 m-1 right-0.5 text-right flex-col flex justify-center items-center z-60 pointer-events-none"
  >
    <div class="p-2  relative z-10 text-xs text-foreground flex justify-center items-center bg-secondary">
      {{ t('message.documentNotSaved') }}
    </div>
  </div>
  <button
    class="m-1 mb-0 fixed ring-2 ring-primary z-10 flex ml-12 duration-1000 justify-center items-center inset-0"
    @click="focusOnTitle()" @keydown="focusOnTitleEsc($event)"
  >
    <span class="sr-only">{{ t('message.clickToEdit') }}</span>
    <Ripple
      class="transition-opacity duration-1000"
      :class="document.show_sidebar_documents ? 'opacity-70' : 'opacity-100'"
    />
  </button>
</template>
