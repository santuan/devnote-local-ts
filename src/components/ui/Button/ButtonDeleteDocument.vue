<script setup lang="ts">
import { Trash2, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'reka-ui'
import { useI18n } from 'vue-i18n'
import Tooltip from '@/components/ui/Tooltip.vue'
import { useDatabaseStore } from '@/stores/database'
import { useModalStore } from '@/stores/modal'
import { useSettingsStore } from '@/stores/settings'

const database = useDatabaseStore()
const modal = useModalStore()
const { show_delete_document_modal } = storeToRefs(modal)
const settings = useSettingsStore()

const { t } = useI18n()
</script>

<template>
  <AlertDialogRoot v-model:open="show_delete_document_modal">
    <Tooltip :name="t('editor.delete')" shortcut="shift + delete">
      <AlertDialogTrigger
        class="absolute bottom-1 print:hidden md:bottom-0 right-1 md:right-1 lg:right-0 flex items-center justify-center ml-auto text-xs ButtonDeleteDocument size-10 z-50 text-primary hover:bg-primary/20"
        :class="[
          database.loaded_id ? '' : 'hidden',
          settings.leva === true && settings.attach === true ? 'lg:-translate-x-72' : '',
        ]"
      >
        <Trash2 class="size-4 pointer-events-none" />
        <span class="select-none! sr-only">{{ t("editor.delete") }}</span>
      </AlertDialogTrigger>
    </Tooltip>
    <AlertDialogPortal>
      <AlertDialogOverlay class="fixed inset-0 z-[904] bg-black/50" />
      <AlertDialogContent
        class="fixed z-[905] w-[95vw] max-w-sm rounded-lg p-4 md:w-full top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-background text-foreground border border-secondary font-mono"
      >
        <AlertDialogTitle class="text-sm font-light pr-12">
          {{ t("editor.delete") }} <strong class="font-bold">{{ database.document_name }}</strong>
        </AlertDialogTitle>
        <AlertDialogDescription class="mt-3 mb-5 text-xs">
          {{ t("editor.deleteConfirm") }}
        </AlertDialogDescription>
        <div class="flex justify-between gap-x-2">
          <AlertDialogCancel as-child>
            <button
              class="bg-secondary ring-1 ring-secondary! text-foreground hover:bg-background hover:ring-2 hover:ring-foreground inline-flex h-[35px] items-center justify-center rounded-[4px] px-3 text-xs font-semibold leading-none focus-visible:ring-2 focus:outline-foreground"
            >
              {{ t("verb.cancel") }}
            </button>
          </AlertDialogCancel>
          <AlertDialogAction as-child>
            <button
              class="bg-red-600 text-white hover:bg-red-600/80 text-xs inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none hover:outline-hidden focus:outline-2 focus:outline-foreground focus:outline-dashed focus:outline-offset-2"
              @click="database.delete_document()"
            >
              {{ t("verb.delete") }}
            </button>
          </AlertDialogAction>
        </div>
        <AlertDialogCancel
          class="absolute top-0 size-6 flex justify-center items-center m-3 right-0 z-999 text-foreground"
        >
          <X class="size-4" />
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
