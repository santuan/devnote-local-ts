<script setup lang="ts">
import Tooltip from '@/components/ui/Tooltip.vue'
import { useDocumentStore } from '@/stores/document'
import { Eye } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const document = useDocumentStore()
const { t } = useI18n()
</script>

<template>
  <Tooltip :name="t('sidebar.contentPreview')" side="bottom">
    <button
      class="interactive"
      :value="t('sidebar.contentPreview')"
      @click="document.toggle_editable()"
    >
      <Eye />
      <span class="sr-only">{{ t("sidebar.contentPreview") }}</span>
    </button>
  </Tooltip>
</template>
