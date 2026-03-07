<script setup lang='ts'>
import { Volume2 } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { Toggle } from 'reka-ui'
import Tooltip from '@/components/ui/Tooltip.vue'
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()
const { speech } = storeToRefs(settings)
</script>

<template>
  <Toggle
    v-model="speech"
    aria-label="Toggle speech"
    class="flex items-center data-[state=on]:text-primary-foreground data-[state=on]:bg-primary justify-center border hover:bg-secondary/80 border-secondary bg-background size-8"
  >
    <Tooltip
      name="Toggle speech"
      side="bottom"
      shortcut="Ctrl Shift Alt P"
    >
      <Volume2 class="size-4 outline-0" />
    </Tooltip>
  </Toggle>
</template>

<style scoped>
@reference "@/assets/main.css";

.interactive[data-state="open"] {
  @apply text-primary;
}

.interactive[data-state="open"] .AArrowDown {
  @apply flex!;
}

.interactive[data-state="closed"] .AArrowDown {
  @apply hidden!;
}

.interactive[data-state="open"] .AArrowUp {
  @apply hidden!;
}

.interactive[data-state="closed"] .AArrowUp {
  @apply flex!;
}
</style>
