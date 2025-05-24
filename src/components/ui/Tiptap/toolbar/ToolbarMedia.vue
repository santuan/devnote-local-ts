<script setup lang="ts">
import { Video as IconVideo, Youtube as IconYoutube, ImageDown, ImagePlus } from 'lucide-vue-next'

import { storeToRefs } from 'pinia'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  ToolbarButton,
} from 'reka-ui'

import { useI18n } from 'vue-i18n'
import CornerBottomRight from '@/assets/corner-bottom-right.vue'
import DialogImageUrl from '@/components/ui/Dialogs/DialogImageUrl.vue'
import DialogVideoUrl from '@/components/ui/Dialogs/DialogVideoUrl.vue'
import DialogYoutubeUrl from '@/components/ui/Dialogs/DialogYoutubeUrl.vue'
import Tooltip from '@/components/ui/Tooltip.vue'
import { useAddImageBase64 } from '@/composables/useAddImageBase64'
import { useSetVideo } from '@/composables/useSetVideo'
import { useEditorStore } from '@/stores/editor'
import { useModalStore } from '@/stores/modal'

const editorStore = useEditorStore()
const modal = useModalStore()
const { editor } = storeToRefs(editorStore)
const { t } = useI18n()

const { addImageBase64 } = useAddImageBase64(editor)
const { setVideo } = useSetVideo(editor)

function handleImageSubmit(url: string) {
  editor.value?.commands.setMedia({
    'src': url,
    'media-type': 'img',
    'alt': '',
    'title': '',
    'width': '800',
    'height': '400',
  })
}

function handleYoutubeSubmit(url: string) {
  editor.value.commands.setYoutubeVideo({
    src: url,
    width: Math.max(320, 640),
    height: Math.max(180, 480),
  })
}

function showImageDialog() {
  modal.show_image_url_dialog = true
}

function showYoutubeDialog() {
  modal.show_youtube_url_dialog = true
}

function handleBase64Upload() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/jpeg'
  input.onchange = e => addImageBase64(e)
  input.click()
}
</script>

<template>
  <DropdownMenuRoot>
    <ToolbarButton as-child>
      <DropdownMenuTrigger class="group interactive data-[state=open]:text-primary relative">
        <Tooltip :name="`${t('verb.add')} ${t('toolbar.image')}`" side="bottom">
          <span
            class="flex items-center interactive justify-center outline-hidden size-8 focus-visible:border-primary border-secondary"
          >
            <ImagePlus class="size-4" />
          </span>
          <span class="sr-only">{{ t("verb.add") }} {{ t("toolbar.image") }}</span>
          <CornerBottomRight />
        </Tooltip>
      </DropdownMenuTrigger>
    </ToolbarButton>
    <DropdownMenuPortal>
      <DropdownMenuContent
        side="bottom"
        :side-offset="6"
        class="z-50 grid w-40 text-xs gap-1 text-foreground font-mono bg-background border border-primary"
      >
        <DropdownMenuItem
          class="relative flex items-center justify-start gap-2 p-2 pr-3 bg-background outline-hidden focus-visible:bg-primary/30 hover:bg-primary/20"
          @click="handleBase64Upload"
        >
          <ImagePlus class="size-4" />
          <span>Base64</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          class="flex items-center justify-start gap-2 p-2 bg-background outline-hidden focus-visible:bg-primary/20 hover:bg-primary/20"
          @click="showImageDialog"
        >
          <ImageDown class="size-4" />
          Url
          <span class="sr-only">{{ t("verb.add") }} {{ t("toolbar.image") }} url</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>

  <Tooltip :name="`${t('verb.add')} Youtube video`" side="bottom">
    <ToolbarButton
      class="flex items-center justify-center outline-hidden interactive size-8 focus-visible:border-primary border-secondary"
      :value="`${t('verb.add')} Youtube video`"
      @click="showYoutubeDialog"
    >
      <IconYoutube class="size-4" />
      <span class="sr-only">{{ t("verb.add") }} Youtube video</span>
    </ToolbarButton>
  </Tooltip>
  <Tooltip name="Video URL" side="bottom">
    <ToolbarButton
      class="flex items-center interactive justify-center border outline-hidden size-8 focus-visible:border-primary border-secondary"
      value="Video URL"
      @click="setVideo(null)"
    >
      <IconVideo class="size-4" />
      <span class="sr-only">{{ t("verb.add") }} video URL</span>
    </ToolbarButton>
  </Tooltip>
  <DialogVideoUrl @submit="setVideo" />
  <DialogImageUrl @submit="handleImageSubmit" />
  <DialogYoutubeUrl @submit="handleYoutubeSubmit" />
</template>
