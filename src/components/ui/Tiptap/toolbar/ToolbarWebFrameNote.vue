<script setup lang="ts">
import { Terminal } from 'lucide-vue-next'
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
import DialogIframeUrl from '@/components/ui/Dialogs/DialogIframeUrl.vue'
import Tooltip from '@/components/ui/Tooltip.vue'
import { useEditorStore } from '@/stores/editor'

const { t } = useI18n()
const document = useEditorStore()
const { editor } = storeToRefs(document)

const iframeOptions = [
  {
    label: 'Devnote Stackblitz Playground',
    src: 'https://stackblitz.com/github/santuan/devnote-local-ts?embed=1&theme=dark&preset=node&file=src/App.vue',
  },
  {
    label: 'Devnote Bolt Playground',
    src: 'https://bolt.new/github.com/santuan/devnote-local-ts',
  },
]

function insertIframe(src: string) {
  editor.value.chain().focus().setIframe({ src }).run()
}
</script>

<template>
  <Tooltip :name="t('verb.addIframe')" side="bottom">
    <DropdownMenuRoot>
      <DropdownMenuTrigger as-child>
        <ToolbarButton
          class="flex interactive items-center justify-center border outline-hidden size-8 focus-visible:border-primary border-secondary"
          :disabled="!editor.can().chain().focus().setIframe().run()"
          value="WebFrame"
        >
          <Terminal class="size-4" />
          <span class="sr-only">{{ t('verb.addIframe') }}</span>
        </ToolbarButton>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          side="bottom" align="start"
          class="z-50 grid w-64 font-mono  bg-secondary border border-primary"
        >
          <DropdownMenuItem
            v-for="option in iframeOptions"
            :key="option.src"
            class="flex items-center justify-between gap-2 p-2 pr-3 bg-background text-xs text-foreground outline-hidden focus-visible:bg-primary/30 hover:bg-primary/20"
            @click="insertIframe(option.src)"
          >
            {{ option.label }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  </Tooltip>

  <DialogIframeUrl />
</template>
