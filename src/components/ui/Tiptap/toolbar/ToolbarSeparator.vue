<script setup lang="ts">
import Tooltip from '@/components/ui/Tooltip.vue'

import { useEditorStore } from '@/stores/editor'
import { Minus } from 'lucide-vue-next'

import { storeToRefs } from 'pinia'
import { ToolbarButton } from 'reka-ui'
import { useI18n } from 'vue-i18n'

const document = useEditorStore()
const { editor } = storeToRefs(document)
const { t } = useI18n()
</script>

<template>
  <Tooltip :name="t('toolbar.separator')" side="bottom">
    <ToolbarButton
      class="interactive"
      :value="t('toolbar.separator')"
      @click="editor.chain().focus().setHorizontalRule().run()"
    >
      <Minus />
      <span class="sr-only">{{ t("toolbar.separator") }}</span>
    </ToolbarButton>
  </Tooltip>
</template>
