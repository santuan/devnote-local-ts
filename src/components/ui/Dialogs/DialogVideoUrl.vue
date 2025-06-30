<script setup lang="ts">
import { X } from 'lucide-vue-next'

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useModalStore } from '@/stores/modal'

const emit = defineEmits<{
  (e: 'submit', url: string): void
}>()
const modal = useModalStore()
const { t } = useI18n()
const videoUrl = ref('')

function handleSubmit() {
  emit('submit', videoUrl.value)
  videoUrl.value = ''
  modal.show_video_url_dialog = false
}
</script>

<template>
  <DialogRoot v-model:open="modal.show_video_url_dialog">
    <DialogPortal>
      <DialogOverlay class="bg-background/80 fixed inset-0 z-60" />
      <DialogContent
        class="font-mono fixed top-6 translate-y-0 sm:top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] sm:translate-y-[-50%] rounded-[6px] bg-background p-6 shadow-sm focus:outline-hidden z-100 border border-secondary"
      >
        <DialogTitle class="text-foreground m-0 text-[17px] font-medium">
          {{ t("verb.add") }} Video URL
        </DialogTitle>
        <DialogDescription class="text-foreground/60 mt-3 mb-2 text-[15px] leading-normal">
          {{ t("verb.add") }} video URL from any source
        </DialogDescription>

        <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
          <label for="video_url">
            <input
              v-model="videoUrl"
              type="url"
              required
              placeholder="https://"
              class="flex h-10 w-full rounded-md border border-secondary bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
          </label>
          <div class="flex justify-end gap-4">
            <DialogClose
              class="bg-background border-secondary border text-foreground hover:bg-backgorund/80 text-xs inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none  focus:outline-foreground focus:outline gap-3 focus:outline-offset-2"
            >
              {{ t("verb.cancel") }}
            </DialogClose>
            <button
              type="submit"
              class="bg-primary text-primary-foreground hover:bg-primary/80 text-xs inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none hover:outline-hidden  focus:outline-foreground focus:outline focus:outline-offset-2"
            >
              {{ t("verb.add") }}
            </button>
          </div>
        </form>

        <DialogClose
          class="text-foreground hover:bg-secondary/80 hover:text-foreground absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center focus:outline-hidden focus-visible:ring-1 focus-visible:ring-primary focus-visible:text-primary"
        >
          <X />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
