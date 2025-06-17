<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useDatabaseStore } from '@/stores/database'
import { useEditorStore } from '@/stores/editor'
import { useModalStore } from '@/stores/modal'

const document = useEditorStore()
const modal = useModalStore()
const { editor } = storeToRefs(document)
const database = useDatabaseStore()
const { t } = useI18n()
</script>

<template>
  <div v-if="database.loaded_id" class="grid gap-2">
    <div><span class="opacity-50">{{ t('tour.documentTitle') }}:</span><br> {{ database.document_name?.length === 0 ? '---' : database.document_name }}</div>
    <div><span class="opacity-50">id:</span> {{ database.loaded_id }}</div>
    <div class="capitalize">
      {{ database.document_checked ? t('message.completed') : t('message.unmarked') }}
    </div>
    <div v-if="!database.document_checked">
      {{ database.document_fixed ? t('verb.fixed') : t('verb.unfixed') }}
    </div>
    <div v-if="editor" class="flex items-center justify-between w-full">
      <span>{{ editor.storage.characterCount.characters() }} / 10000</span>
      <span>{{ editor.storage.characterCount.words() }} words</span>
    </div>
  </div>
  <div v-else class="bg-background min-h-64 flex justify-center items-center">
    <button class="p-3 bg-secondary" @click="modal.show_commandbar = true">
      <Search class="size-6" />
    </button>
  </div>
</template>
