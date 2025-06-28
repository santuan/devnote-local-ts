<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ToggleFontSize from '@/components/ui/Toggle/ToggleFontSize.vue'

const { t } = useI18n()
</script>

<template>
  <div
    class="relative flex flex-row items-start justify-between py-3 pr-3 border-t border-secondary"
  >
    <div class="space-y-0.5">
      <h3 class="text-sm font-medium text-pretty mt-0">
        {{ t("settings.fontsize") }}
      </h3>
      <p class="text-xs text-muted-foreground text-balance">
        {{ t("settings.fontsizeDescription") }}
      </p>
    </div>
    <div class="flex gap-2">
      <ToggleFontSize />
    </div>
  </div>
</template>
