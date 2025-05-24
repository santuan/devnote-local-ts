<script setup lang="ts">
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
  <Tooltip :name="t('toolbar.code')" shortcut="Ctrl E" side="bottom">
    <ToolbarButton
      :disabled="!editor.can().chain().focus().toggleCode().run()"
      :class="{ 'is-active': editor.isActive('code') }"
      class="font-mono interactive text-base!"
      :value="t('toolbar.code')"
      @click="editor.chain().focus().toggleCode().run()"
    >
      <span
        class="flex items-center justify-center text-xs rounded size-5 bg-secondary/30 text-inherit"
      >
        M
      </span>
      <span class="sr-only">{{ t("toolbar.code") }}</span>
    </ToolbarButton>
  </Tooltip>
</template>
