<script setup lang="ts">
import { PanelLeftClose, PanelLeftDashed } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()
const { t } = useI18n()
</script>

<template>
  <div
    class="flex flex-row items-start justify-between gap-3 pt-2 py-3 pr-3 border-t border-secondary"
  >
    <div class="space-y-0.5">
      <h3 class="text-sm font-medium text-pretty mt-0">
        {{ t("settings.showIcons") }}
      </h3>
      <p class="text-xs text-muted-foreground text-balance">
        {{ t("settings.showIconsDescription") }}
      </p>
    </div>
    <button
      class="flex focus:border-primary ring-foreground items-center justify-center border border-secondary bg-background shrink-0 hover:bg-secondary/80 size-8 focus:outline-2 focus:outline-foreground focus:outline-dashed focus:outline-offset-2"
      :class="
        settings.desktop_show_icons_sidebar_collapse
          ? 'hover:bg-primary! bg-primary hover:text-primary-foreground text-primary-foreground'
          : 'text-foreground'
      "
      @click="settings.toggle_desktop_show_icons_sidebar_collapse()"
    >
      <PanelLeftDashed v-if="!settings.desktop_show_icons_sidebar_collapse" class="size-5" />
      <PanelLeftClose v-else class="size-5  " />
      <span class="sr-only">{{ t("settings.showHeadingDescription") }}</span>
    </button>
  </div>
</template>
