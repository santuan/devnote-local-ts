<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { MousePointer, Pointer } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const cursor_pointer = useStorage('cursor', true)
const { t } = useI18n()

function toggleCursor() {
  cursor_pointer.value = !cursor_pointer.value
}
</script>

<template>
  <div class="flex-row items-start justify-between flex py-3 pr-3 border-t border-secondary">
    <div class="space-y-0.5">
      <h3 class="text-sm font-medium text-pretty mt-0">
        {{ t("settings.cursor") }}
      </h3>
      <p class="text-xs text-muted-foreground text-balance">
        {{ t("settings.cursorDescription") }}
      </p>
    </div>
    <button
      class="flex focus:border-primary ring-foreground items-center justify-center border border-secondary bg-background shrink-0 hover:bg-secondary/80 size-8 focus:outline-2 focus:outline-foreground focus:outline-dashed focus:outline-offset-2"
      @click="toggleCursor()"
    >
      <Pointer v-if="cursor_pointer" class="size-4" />
      <MousePointer v-else class="size-4" />
      <span class="sr-only">{{ t("settings.cursorDescription") }}</span>
    </button>
  </div>
</template>
