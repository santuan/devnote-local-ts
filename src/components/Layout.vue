<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import ButtonSpeechSynthesis from '@/components/ui/Button/ButtonSpeechSynthesis.vue'
import DialogExportDB from '@/components/ui/Dialogs/DialogExportDB.vue'
import DialogImportDB from '@/components/ui/Dialogs/DialogImportDB.vue'
import DialogSpeechSettings from '@/components/ui/Dialogs/DialogSpeechSettings.vue'
import Toasts from '@/components/ui/Toasts.vue'
import ToggleEditable from '@/components/ui/Toggle/ToggleEditable.vue'
import { useDatabaseStore } from '@/stores/database'

const database = useDatabaseStore()
const { containerInbound } = storeToRefs(database)
const cursor_pointer = useStorage('cursor', true)
</script>

<template>
  <main
    ref="containerInbound"
    class="appContainer"
    :class="cursor_pointer ? 'cursor_pointer' : 'cursor_initial'"
  >
    <slot />
    <ToggleEditable />
    <ButtonSpeechSynthesis />
    <Toasts />
    <DialogExportDB />
    <DialogImportDB />
    <DialogSpeechSettings />
  </main>
</template>

<style scoped>
@reference "@/assets/main.css";

.appContainer {
  @apply w-full min-h-screen font-mono bg-background text-foreground;
}
</style>
