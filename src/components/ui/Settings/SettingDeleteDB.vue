<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DialogDeleteDB from '@/components/ui/Dialogs/DialogDeleteDB.vue'

const { t } = useI18n()
</script>

<template>
  <div
    class="grid grid-cols-2 sm:flex flex-row items-center justify-between jus gap-3 mr-3 p-3 border border-destructive"
  >
    <h3 class="text-sm m-0 font-medium text-foreground text-balance">
      {{ t("settings.deleteDB") }}
    </h3>
    <div class="flex justify-end items-center">
      <DialogDeleteDB />
    </div>
  </div>
</template>
