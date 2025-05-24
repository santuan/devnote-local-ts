<script setup lang='ts'>
import { refDebounced } from '@vueuse/core'
import { Upload, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import { shallowRef, watch } from 'vue'

import { useI18n } from 'vue-i18n'
import { useDatabaseStore } from '@/stores/database'
import { useModalStore } from '@/stores/modal'

const database = useDatabaseStore()
const modal = useModalStore()
const { file_name } = storeToRefs(database)
const { show_export_db } = storeToRefs(modal)
const input = shallowRef(file_name)
const { t } = useI18n()

const debounced = refDebounced(input, 1000)

watch(debounced, (value) => {
  if (value) {
    database.update_database(debounced.value)
    database.auto_save()
  }
})
</script>

<template>
  <DialogRoot v-model:open="show_export_db">
    <DialogPortal>
      <DialogOverlay class="bg-background/80 data-[state=open]:animate-overlayShow fixed inset-0 z-200" />
      <DialogContent
        class="data-[state=open]:animate-contentShow font-mono fixed top-24 md:top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-background p-3 md:p-6 md:pt-4 shadow-sm focus:outline-hidden z-99999"
      >
        <DialogTitle class="text-foreground flex items-center justify-start gap-3 m-0 text-[17px] font-semibold">
          <Upload class="size-5" />
          {{ t('settings.export') }}
        </DialogTitle>
        <div class="flex gap-2 mt-6  justify-end items-end ">
          <DialogDescription as="label" for="id" class="text-sm text-foreground">
            {{ t('exportDB.description') }}
            <input
              id="id"
              v-model="input"
              type="text"
              class="w-full h-9 px-2 border bg-background text-foreground border-border outline-hidden focus:ring-1 focus:ring-primary"
            >
          </DialogDescription>
          <button
            class="bg-primary shrink-0 border-secondary border text-primary-foreground hover:bg-backgorund/80 text-xs inline-flex h-9 items-center justify-center rounded px-[15px] font-semibold focus:outline-2 focus:outline-foreground focus:outline-dashed gap-3 focus:outline-offset-2"
            @click="database.export_database(input)"
          >
            {{ t('settings.export') }}
          </button>
        </div>
        <DialogClose class="absolute top-0 size-6 flex justify-center items-center m-3 right-0 z-999 text-foreground">
          <X class="size-4" />
          <span class="sr-only">{{ t('verb.close') }}</span>
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
