<script setup lang="ts">
import Tooltip from '@/components/ui/Tooltip.vue'

import { useEditorStore } from '@/stores/editor'
import { Quote } from 'lucide-vue-next'

import { storeToRefs } from 'pinia'
import { ToolbarButton } from 'reka-ui'
import { useI18n } from 'vue-i18n'

const document = useEditorStore()
const { editor } = storeToRefs(document)
const { t } = useI18n()
</script>

<template>
  <Tooltip :name="t('toolbar.quote')" side="bottom">
    <ToolbarButton
      :class="{ 'is-active': editor.isActive('blockquote') }"
      class="interactive"
      :value="t('toolbar.quote')"
      @click="editor.chain().focus().toggleBlockquote().run()"
    >
      <Quote />
      <span class="sr-only">{{ t("toolbar.quote") }}</span>
    </ToolbarButton>
  </Tooltip>
</template>
