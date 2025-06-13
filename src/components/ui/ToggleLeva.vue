<script setup lang='ts'>
import { Bug } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { Toggle } from 'reka-ui'
import Tooltip from '@/components/ui/Tooltip.vue'

import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()
const { leva } = storeToRefs(settings)
</script>

<template>
  <Toggle
    v-model="leva"
    aria-label="Toggle debug"
    class="flex items-center data-[state=on]:text-primary-foreground data-[state=on]:bg-primary justify-center border hover:bg-secondary/80 border-secondary bg-background size-8"
  >
    <Tooltip
      name="Toggle debug"
      side="right"
      shortcut="Ctrl Shift Alt D"
    >
      <Bug class="size-4 outline-0" />
    </Tooltip>
  </Toggle>
</template>

<style scoped>
@reference "@/assets/main.css";

.interactive[data-state="open"] {
  @apply text-primary;
}

.interactive[data-state="open"] .AArrowDown {
  @apply !flex;
}

.interactive[data-state="closed"] .AArrowDown {
  @apply !hidden;
}

.interactive[data-state="open"] .AArrowUp {
  @apply !hidden;
}

.interactive[data-state="closed"] .AArrowUp {
  @apply !flex;
}
</style>
