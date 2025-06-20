<script setup lang="ts">
import { motion } from 'motion-v'
import DialogCommandMenu from '@/components/ui/Dialogs/DialogCommandMenu.vue'
import DialogInfo from '@/components/ui/Dialogs/DialogInfo.vue'
import DialogSettings from '@/components/ui/Dialogs/DialogSettings.vue'
import ToggleFontSize from '@/components/ui/ToggleFontSize.vue'
import ToggleLeva from '@/components/ui/ToggleLeva.vue'
import ToggleTheme from '@/components/ui/ToggleTheme.vue'

const props = defineProps({
  isCollapsed: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <motion.div
    v-if="props?.isCollapsed" class="fixed! top-11! left-1! flex flex-col gap-1 z-[81]!" :initial="{
      x: -10,
      opacity: 0,
      transition: {
        default: { type: 'spring' },
        opacity: { ease: 'linear' },
      },
    }" :animate="{
      x: 0,
      opacity: 1,
      transition: {
        default: { type: 'spring' },
        opacity: { ease: 'linear' },
      },
    }"
  >
    <DialogInfo />
    <DialogSettings />
    <DialogCommandMenu />
    <ToggleFontSize />
    <ToggleTheme />
    <ToggleLeva />
  </motion.div>
</template>
