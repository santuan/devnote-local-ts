<script setup lang="ts">
import Tooltip from '@/components/ui/Tooltip.vue'
import { db } from '@/db'
import { useDatabaseStore } from '@/stores/database'
import { Pin } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const database = useDatabaseStore()
const { t } = useI18n()
const { select_id } = storeToRefs(database)

async function update_document() {
  try {
    const result = await db.documents.get(select_id.value)
    database.change_document_fixed(result, result?.document_data?.fixed)
    return result
  }
  catch {

  }
}
</script>

<template>
  <Tooltip :name="!database.document_fixed ? t('verb.unfixed') : t('verb.fixed')" side="bottom">
    <button
      class="flex items-center justify-center hover:border interactive border-secondary ToggleFixed bg-background hover:bg-secondary/80 size-9"
      @click="update_document()"
    >
      <Pin class="origin-center size-4" :class="database.document_fixed ? 'fill-current text-primary' : ''" />
      <span class="sr-only">{{ !database.document_fixed ? t('verb.unfixed') : t('verb.fixed') }}</span>
    </button>
  </Tooltip>
</template>
