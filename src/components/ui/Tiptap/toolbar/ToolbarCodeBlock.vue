<script setup lang="ts">
import { Code } from 'lucide-vue-next'

import { storeToRefs } from 'pinia'
import { ToolbarButton } from 'reka-ui'

import { useI18n } from 'vue-i18n'
import Tooltip from '@/components/ui/Tooltip.vue'
import { useEditorStore } from '@/stores/editor'

const document = useEditorStore()
const { editor } = storeToRefs(document)
const { t } = useI18n()
</script>

<template>
  <Tooltip :name="t('toolbar.codeBlock')" shortcut="Ctrl Alt C" side="bottom">
    <ToolbarButton
      :class="{ 'is-active': editor.isActive('codeBlock') }"
      class="interactive gap-1 min-w-20!"
      :value="t('toolbar.codeBlock')"
      @click="editor.chain().focus().toggleCodeBlock().run()"
    >
      <p class="text-xs">
        Code
      </p>
      <Code />
      <span class="sr-only">{{ t("toolbar.codeBlock") }}</span>
    </ToolbarButton>
  </Tooltip>
</template>
