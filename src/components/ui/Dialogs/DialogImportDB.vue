<script setup lang='ts'>
import { useDropZone, useFileDialog, useTimeoutFn } from '@vueuse/core'
import { DatabaseZap, X } from 'lucide-vue-next'

import { storeToRefs } from 'pinia'
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
} from 'reka-ui'

import { shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDatabaseStore } from '@/stores/database'
import { useModalStore } from '@/stores/modal'

const { t } = useI18n()

const database = useDatabaseStore()
const modal = useModalStore()
const { show_import_db } = storeToRefs(modal)
const dropZoneRef = shallowRef()
const filesData = shallowRef([])
const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)

const { open, onChange } = useFileDialog({
  accept: 'application/json',
})

onChange((files: any) => {
  if (files) {
    if (files[0].type !== 'application/json') {
      // eslint-disable-next-line no-alert
      alert('El archivo seleccionado no es un archivo JSON')
      return
    }
    database.import_database(files[0])
    filesData.value = files
    useTimeoutFn(() => {
      filesData.value = []
    }, 300)
  }
})

function onDrop(files: any) {
  if (files) {
    if (files[0].type !== 'application/json') {
      // eslint-disable-next-line no-alert
      alert('El archivo seleccionado no es un archivo JSON')
      return
    }
    database.import_database(files[0])
    // database.showProjects = true
    filesData.value = files
    show_import_db.value = false
    useTimeoutFn(() => {
      filesData.value = []
    }, 300)
  }
}
</script>

<template>
  <AlertDialogRoot v-model:open="show_import_db">
    <AlertDialogPortal>
      <AlertDialogOverlay
        class="bg-secondary/90 data-[state=open]:animate-overlayShow fixed inset-0 z-[800]"
      />
      <AlertDialogContent>
        <div
          class="dropZone fixed flex-col font-mono inset-0 text-foreground z-[801] justify-center flex items-center"
        >
          <div
            class="flex flex-col items-center justify-center w-full"
          >
            <div
              ref="dropZoneRef"
              class="fixed inset-0 flex flex-col items-center justify-center w-full gap-2 px-3 pt-10 pb-6 text-center shadow-sm bg-background/60 text-pretty"
              :class="isOverDropZone ? ' border-animated ' : '   '"
            >
              <DatabaseZap class="size-12" />
              <AlertDialogTitle class="text-mauve12 m-0 text-[17px] font-semibold">
                {{ t('settings.import') }}
              </AlertDialogTitle>
              <AlertDialogDescription
                class="text-foreground mt-4 text-pretty max-w-96 text-center mb-3 text-[15px] leading-normal"
              >
                {{ t('importDB.description') }}
              </AlertDialogDescription>
              <button
                type="button"
                class="mb-4 text-sm font-semibold underline text-primary underline-offset-2"
                @click="open()"
              >
                {{ t('importDB.action') }}
              </button>
              <AlertDialogCancel
                class="bg-secondary text-foreground hover:bg-backgorund/80 text-xs inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none focus:outline-2 focus:outline-foreground focus:outline-dashed focus:outline-offset-4"
              >
                {{ t('verb.cancel') }}
              </AlertDialogCancel>
              <AlertDialogCancel class="absolute top-0 size-6 flex justify-center items-center m-3 right-0 z-[999] text-foreground">
                <X class="size-4" />
                <span class="sr-only">{{ t('verb.close') }}</span>
              </AlertDialogCancel>
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>

<style>
@reference "@/assets/main.css";

.border-animated:before {
  @apply absolute inset-2;
  content: '';
  background:
    linear-gradient(90deg, hsl(var(--primary)) 50%, transparent 50%),
    linear-gradient(90deg, hsl(var(--primary)) 50%, transparent 50%),
    linear-gradient(0deg, hsl(var(--primary)) 50%, transparent 50%),
    linear-gradient(0deg, hsl(var(--primary)) 50%, transparent 50%);
  background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
  background-size:
    20px 2px,
    20px 2px,
    2px 20px,
    2px 20px;
  background-position:
    0px 0px,
    400px 100%,
    0px 70px,
    100% 0px;
  padding: 0;
  animation: border-dance 30s infinite linear;
}

@keyframes border-dance {
  0% {
    background-position:
      /* 0px 0px,
      300px 155px,
      0px 150px,
      445px 0px; */
      0px 0px,
      0 100%,
      0px 0px,
      100% 0px;
  }

  100% {
    background-position:
      /* 300px 0px,
      0px 155px,
      0px 0px,
      445px 150px; */
      -50% 0px,
      50% 100%,
      0px 50%,
      100% -50%;
  }
}
</style>
