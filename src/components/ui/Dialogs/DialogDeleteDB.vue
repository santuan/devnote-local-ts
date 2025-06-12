<script setup lang='ts'>
import { X } from 'lucide-vue-next'

import { storeToRefs } from 'pinia'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { useDatabaseStore } from '@/stores/database'
import { useModalStore } from '@/stores/modal'

const database = useDatabaseStore()
const modal = useModalStore()
const { show_delete_db_modal, show_settings } = storeToRefs(modal)

const { t } = useI18n()

function clear() {
  database.clear_database()
  setTimeout(() => {
    toast(t('message.databaseCleared'))
    show_delete_db_modal.value = false
    show_settings.value = false
  }, 300)
}
</script>

<template>
  <DialogRoot v-model:open="show_delete_db_modal">
    <DialogTrigger
      class="bg-destructive text-white hover:bg-red-800 outline-hidden inline-flex ring-0 hover:ring-2 ring-destructive h-8 items-center justify-center rounded-[4px] px-3 text-xs font-semibold leading-none focus:outline-2 focus:outline-foreground focus:outline-dashed gap-3 focus:outline-offset-2"
      aria-label="Delete DB"
    >
      {{ t("verb.delete") }} DB
      <span class="sr-only"> {{ t("settings.deleteDB") }}</span>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-[904] bg-black/50" />
      <DialogContent
        class="font-mono fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-background p-3 md:p-[25px] shadow-sm focus:outline-hidden z-9000"
      >
        <DialogClose
          class="text-foreground hover:bg-secondary/80 hover:text-foreground absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center focus:outline-hidden focus-visible:ring-1 focus-visible:ring-primary focus-visible:text-primary"
          aria-label="Close"
        >
          <X class="size-4 text-foreground" />
        </DialogClose>
        <DialogTitle class="text-foreground m-0 text-[17px] font-semibold">
          {{ t("settings.deleteDB") }}
        </DialogTitle>
        <DialogDescription class="mt-3 text-sm text-foreground">
          {{ t("editor.deleteConfirm") }}
        </DialogDescription>
        <div class="flex items-center justify-end gap-3 mt-6">
          <DialogClose as-child>
            <button
              class="bg-background border-secondary border text-foreground hover:bg-backgorund/80 text-xs inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none focus:outline-2 focus:outline-foreground focus:outline-dashed gap-3 focus:outline-offset-2"
            >
              {{ t("verb.cancel") }}
            </button>
          </DialogClose>
          <button
            class="bg-red-600 text-white hover:bg-red-600/80 text-xs inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none hover:outline-hidden focus:outline-2 focus:outline-foreground focus:outline-dashed focus:outline-offset-2"
            @click="clear()"
          >
            {{ t("verb.delete") }}
          </button>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
