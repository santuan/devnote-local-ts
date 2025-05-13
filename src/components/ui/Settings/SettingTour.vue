<script setup lang="ts">
import Driver from '@/composables/driver.ts'

import { useDocumentStore } from '@/stores/document'
import { useModalStore } from '@/stores/modal'
import { useSettingsStore } from '@/stores/settings'
import { Plane } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const setting = useSettingsStore()
const document = useDocumentStore()
const modal = useModalStore()
const { content_editable } = storeToRefs(document)
const { show_settings } = storeToRefs(modal)

const { t } = useI18n()

function toggleTour() {
  setting.toggle_product_tour_seen(false)
  show_settings.value = false
  content_editable.value = true
  setTimeout(() => {
    Driver()
  }, 300)
}
</script>

<template>
  <div class="flex-row items-start justify-between flex gap-3 pt-2 py-3 pr-3 border-t border-secondary">
    <div class="space-y-0.5">
      <h3 class="text-sm font-medium text-pretty mt-0">
        Tour
      </h3>
      <p class="text-xs text-muted-foreground text-balance">
        {{ t("settings.tourDescription") }}
      </p>
    </div>
    <button
      class="flex focus:border-primary ring-foreground focus:outline-2 focus:outline-foreground focus:outline-dashed focus:outline-offset-2 items-center justify-center border border-secondary bg-background shrink-0 hover:bg-secondary/80 size-8"
      @click="toggleTour()"
    >
      <Plane class="size-5" />
      <span class="sr-only">{{ t("settings.tourDescription") }}</span>
    </button>
  </div>
</template>
