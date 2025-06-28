<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DropdownLanguage from '@/components/ui/Dropdown/DropdownLanguage.vue'

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-row items-start justify-between py-3 pr-3">
    <div class="space-y-0.5">
      <h3 class="text-sm font-medium text-pretty mt-0">
        {{ t("settings.language") }}
      </h3>
      <p class="text-xs text-muted-foreground text-balance">
        {{ t("settings.languageDescription") }}
      </p>
    </div>
    <div class="flex gap-2">
      <DropdownLanguage />
    </div>
  </div>
</template>
