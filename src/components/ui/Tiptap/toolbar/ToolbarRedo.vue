<script setup lang="ts">
import Tooltip from '@/components/ui/Tooltip.vue'

import { useEditorStore } from '@/stores/editor'

import { Redo2 } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { ToolbarButton } from 'reka-ui'
import { useI18n } from 'vue-i18n'

const document = useEditorStore()
const { editor } = storeToRefs(document)
const { t } = useI18n()
</script>

<template>
  <Tooltip :name="t('toolbar.redo')" side="bottom">
    <ToolbarButton
      class="flex items-center interactive justify-center border outline-hidden size-8 focus-visible:border-primary border-secondary"
      :disabled="!editor.can().chain().focus().redo().run()"
      :value="t('toolbar.redo')"
      @click="editor.chain().focus().redo().run()"
    >
      <Redo2 class="size-4" />
      <span class="sr-only">{{ t("toolbar.redo") }}</span>
    </ToolbarButton>
  </Tooltip>
</template>
