<script setup lang="ts">
import DialogLinkUrl from '@/components/ui/Dialogs/DialogLinkUrl.vue'

import Tooltip from '@/components/ui/Tooltip.vue'
import { useSetLink } from '@/composables/useSetLink'
import { useEditorStore } from '@/stores/editor'
import { Link2, Unlink2 } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { ToolbarButton } from 'reka-ui'
import { useI18n } from 'vue-i18n'

const document = useEditorStore()
const { editor } = storeToRefs(document)
const { t } = useI18n()

const { setLink } = useSetLink(editor)

function handleLinkSubmit(url: string) {
  setLink(url)
}
</script>

<template>
  <Tooltip :name="t('toolbar.link')" side="bottom">
    <ToolbarButton
      :class="{ 'is-active': editor.isActive('link') }"
      class="interactive"
      :value="t('toolbar.link')"
      @click="setLink()"
    >
      <Link2 class="-rotate-45" />
      <span class="sr-only">{{ t("toolbar.link") }}</span>
    </ToolbarButton>
  </Tooltip>
  <Tooltip :name="t('toolbar.unlink')" side="bottom">
    <ToolbarButton
      :disabled="!editor.isActive('link')"
      class="interactive"
      :value="t('toolbar.unlink')"
      @click="editor.chain().focus().unsetLink().run()"
    >
      <Unlink2 class="-rotate-45" />
      <span class="sr-only">{{ t("toolbar.unlink") }}</span>
    </ToolbarButton>
  </Tooltip>
  <DialogLinkUrl @submit="handleLinkSubmit" />
</template>
