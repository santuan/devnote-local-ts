<script setup lang="ts">
import { Globe } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { ToolbarButton } from 'reka-ui'
import DialogIframeUrl from '@/components/ui/Dialogs/DialogIframeUrl.vue'
import Tooltip from '@/components/ui/Tooltip.vue'
import { useEditorStore } from '@/stores/editor'
import { useModalStore } from '@/stores/modal'

const document = useEditorStore()
const modal = useModalStore()
const { editor } = storeToRefs(document)

function showIframeDialog() {
  modal.show_iframe_url_dialog = true
}

function handleIframeSubmit(url: string) {
  editor.value.chain().focus().setIframe({ src: url }).run()
}
</script>

<template>
  <Tooltip name="Web Frame" side="bottom">
    <ToolbarButton
      class="flex interactive items-center justify-center border outline-hidden size-8 focus-visible:border-primary border-secondary"
      :disabled="!editor.can().chain().focus().setIframe().run()"
      value="WebFrame"
      @click="showIframeDialog()"
    >
      <Globe class="size-4" />
      <span class="sr-only">WebFrame</span>
    </ToolbarButton>
  </Tooltip>
  <DialogIframeUrl @submit="handleIframeSubmit" />
</template>
