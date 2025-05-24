<script setup lang="ts">
import { storeToRefs } from 'pinia'

import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from 'reka-ui'
import { useI18n } from 'vue-i18n'
import { useDocumentStore } from '@/stores/document'
import { useEditorStore } from '@/stores/editor'

const document = useDocumentStore()
const editor_store = useEditorStore()
const { editor } = storeToRefs(editor_store)
// import { useSettingsStore } from "@/stores/settings"
// import { useAddImage } from "@/composables/useAddImage"
// import { useAddVideo } from "@/composables/useAddVideo"
// import { useSetVideo } from "@/composables/useSetVideo"
// import { useAddImageBase64 } from "@/composables/useAddImageBase64"
// const settings = useSettingsStore()
// const { addImage } = useAddImage(editor)
// const { addVideo } = useAddVideo(editor)
// const { setVideo } = useSetVideo(editor)
// const { addImageBase64 } = useAddImageBase64(editor)
const { t } = useI18n()
</script>

<template>
  <ContextMenuRoot v-if="document.content_editable">
    <ContextMenuTrigger as-child>
      <slot />
    </ContextMenuTrigger>
    <ContextMenuPortal>
      <ContextMenuContent
        v-if="document.content_editable"
        class="min-w-[220px] z-10 font-mono bg-background ring-1 ring-primary text-foreground outline-hidden rounded p-1.5 shadow-sm"
        :side-offset="5"
      >
        <!-- <ContextMenuItem
          @click="addVideo"
          class="cursor-default text-xs flex items-center h-6 px-2 hover:bg-primary/20 outline-hidden disabled:cursor-not-allowed disabled:text-gray-400 data-highlighted:bg-primary/20"
          :value="t('verb.add')"
        >
          <span>{{ t("verb.add") }} Youtube video</span>
        </ContextMenuItem>
        <ContextMenuItem
          @click="setVideo"
          class="cursor-default text-xs flex items-center h-6 px-2 hover:bg-primary/20 outline-hidden disabled:cursor-not-allowed disabled:text-gray-400 data-highlighted:bg-primary/20"
          :value="t('verb.add')"
        >
          <span>{{ t("verb.add") }} video by url</span>
        </ContextMenuItem>
        <ContextMenuItem
          @click="addImage"
          class="cursor-default text-xs flex items-center h-6 px-2 hover:bg-primary/20 outline-hidden disabled:cursor-not-allowed disabled:text-gray-400 data-highlighted:bg-primary/20"
          :value="t('toolbar.image')"
        >
          <span>{{ t("verb.add") }} {{ t("toolbar.image") }} url</span>
        </ContextMenuItem>
        <ContextMenuItem
          v-show="settings.media_base64"
          @click="settings.toggle_media_base64"
          @select.prevent
          class="relative flex items-center justify-between text-primary hover:text-primary h-6 gap-2 p-2 pr-3 bg-primary/10 outline-hidden focus-visible:bg-primary/30 text-xs hover:bg-primary/20"
        >
          {{ t("verb.add") }} {{ t("toolbar.image") }} Base64

          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 20 20">
            <path
              fill="#888888"
              d="M6 12a2 2 0 1 1 0-4a2 2 0 0 1 0 4m12-2a4 4 0 0 0-4-4H6a4 4 0 1 0 0 8h8a4 4 0 0 0 4-4m-4-3a3 3 0 1 1 0 6H6a3 3 0 1 1 0-6z"
            />
          </svg>
        </ContextMenuItem>
        <ContextMenuItem
          as="label"
          for="img-uploader"
          v-show="!settings.media_base64"
          id="uploader"
          class="cursor-defaul relative text-xs flex items-center h-6 px-2 hover:bg-primary/20 outline-hidden disabled:cursor-not-allowed disabled:text-gray-400 data-highlighted:bg-primary/20"
        >
          <span>{{ t("verb.add") }} {{ t("toolbar.image") }} Base64</span>
          <input
            id="img-uploader"
            type="file"
            accept="image/jpeg"
            class="absolute inset-0 opacity-0"
            :aria-label="`${t('verb.add')} Base64 ${t('toolbar.image')}`"
            @change="addImageBase64"
          />
        </ContextMenuItem>
        <ContextMenuSeparator class="h-[0.0125rem] bg-secondary my-1" /> -->
        <ContextMenuLabel class="text-xs px-2 text-primary relative inline-block uppercase py-2">
          {{ t("toolbar.table") }}
        </ContextMenuLabel>
        <ContextMenuItem
          class="cursor-default text-xs flex items-center h-6 px-2 hover:bg-primary/20 outline-hidden disabled:cursor-not-allowed disabled:text-gray-400 data-highlighted:bg-primary/20"
          :value="t('toolbar.insertTable')"
          @click="
            editor.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run()
          "
        >
          {{ t("toolbar.insertTable") }}
        </ContextMenuItem>
        <ContextMenuItem
          :disabled="!editor.can().addColumnBefore()"
          class="cursor-default text-xs flex items-center h-6 px-2 hover:bg-primary/20 outline-hidden disabled:cursor-not-allowed disabled:text-gray-400 data-highlighted:bg-primary/20"
          :value="t('toolbar.addColumnBefore')"
          @click="editor.chain().focus().addColumnBefore().run()"
        >
          {{ t("toolbar.addColumnBefore") }}
        </ContextMenuItem>
        <ContextMenuItem
          :disabled="!editor.can().addColumnAfter()"
          class="cursor-default text-xs flex items-center h-6 px-2 hover:bg-primary/20 outline-hidden disabled:cursor-not-allowed disabled:text-gray-400 data-highlighted:bg-primary/20"
          :value="t('toolbar.addColumnAfter')"
          @click="editor.chain().focus().addColumnAfter().run()"
        >
          {{ t("toolbar.addColumnAfter") }}
        </ContextMenuItem>
        <ContextMenuItem
          :disabled="!editor.can().addRowBefore()"
          class="cursor-default text-xs flex items-center h-6 px-2 hover:bg-primary/20 outline-hidden disabled:cursor-not-allowed disabled:text-gray-400 data-highlighted:bg-primary/20"
          :value="t('toolbar.addRowBefore')"
          @click="editor.chain().focus().addRowBefore().run()"
        >
          {{ t("toolbar.addRowBefore") }}
        </ContextMenuItem>
        <ContextMenuItem
          :disabled="!editor.can().addRowAfter()"
          class="cursor-default text-xs flex items-center h-6 px-2 hover:bg-primary/20 outline-hidden disabled:cursor-not-allowed disabled:text-gray-400 data-highlighted:bg-primary/20"
          :value="t('toolbar.addRowAfter')"
          @click="editor.chain().focus().addRowAfter().run()"
        >
          {{ t("toolbar.addRowAfter") }}
        </ContextMenuItem>
        <ContextMenuSeparator class="h-[0.0125rem] bg-secondary my-1" />
        <ContextMenuItem
          :disabled="!editor.can().deleteTable()"
          class="cursor-default text-xs flex items-center h-6 px-2 hover:bg-primary/20 outline-hidden disabled:cursor-not-allowed disabled:text-gray-400 data-highlighted:bg-primary/20"
          :value="t('toolbar.deleteTable')"
          @click="editor.chain().focus().deleteTable().run()"
        >
          {{ t("toolbar.deleteTable") }}
        </ContextMenuItem>
        <ContextMenuItem
          :disabled="!editor.can().deleteColumn()"
          class="cursor-default text-xs flex items-center h-6 px-2 hover:bg-primary/20 outline-hidden disabled:cursor-not-allowed disabled:text-gray-400 data-highlighted:bg-primary/20"
          :value="t('toolbar.deleteColumn')"
          @click="editor.chain().focus().deleteColumn().run()"
        >
          {{ t("toolbar.deleteColumn") }}
        </ContextMenuItem>
        <ContextMenuItem
          :disabled="!editor.can().deleteRow()"
          class="cursor-default text-xs flex items-center h-6 px-2 hover:bg-primary/20 outline-hidden disabled:cursor-not-allowed disabled:text-gray-400 data-highlighted:bg-primary/20"
          :value="t('toolbar.deleteRow')"
          @click="editor.chain().focus().deleteRow().run()"
        >
          {{ t("toolbar.deleteRow") }}
        </ContextMenuItem>
        <ContextMenuSeparator class="h-[0.0125rem] bg-secondary my-1" />
        <ContextMenuItem
          class="cursor-default text-xs flex items-center h-6 px-2 hover:bg-primary/20 outline-hidden disabled:cursor-not-allowed disabled:text-gray-400 data-highlighted:bg-primary/20"
          :disabled="!editor.can().mergeCells()"
          :value="t('toolbar.mergeCells')"
          @click="editor.chain().focus().mergeCells().run()"
        >
          {{ t("toolbar.mergeCells") }}
        </ContextMenuItem>
        <ContextMenuItem
          class="cursor-default text-xs flex items-center h-6 px-2 hover:bg-primary/20 outline-hidden disabled:cursor-not-allowed disabled:text-gray-400 data-highlighted:bg-primary/20"
          :disabled="!editor.can().splitCell()"
          :value="t('toolbar.splitCell')"
          @click="editor.chain().focus().splitCell().run()"
        >
          {{ t("toolbar.splitCell") }}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
  <template v-if="!document.content_editable">
    <slot />
  </template>
</template>

<style scoped>
[data-disabled] {
  @apply hidden;
}
</style>
