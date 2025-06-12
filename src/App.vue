<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import Toasts from '@/components/ui/Toasts.vue'
import { useIsMobile } from '@/composables/useIsMobile'
import { useToggleColorTheme } from '@/composables/useToggleColorTheme'
import { useDatabaseStore } from '@/stores/database'
import AppDesktop from './components/AppDesktop.vue'
import AppMobile from './components/AppMobile.vue'
import DialogExportDB from './components/ui/Dialogs/DialogExportDB.vue'
import DialogImportDB from './components/ui/Dialogs/DialogImportDB.vue'
import ToggleEditable from './components/ui/ToggleEditable.vue'

const { isMobile } = useIsMobile()

const database = useDatabaseStore()
const { containerInbound } = storeToRefs(database)

const colorTheme = useStorage('theme', 'theme-foreground')
const cursor_pointer = useStorage('cursor', true)

onMounted(() => {
  database.init_database()
  useToggleColorTheme(colorTheme.value)
})
</script>

<template>
  <main
    ref="containerInbound"
    class="w-full min-h-screen font-mono bg-background text-foreground"
    :class="cursor_pointer ? 'cursor_pointer' : 'cursor_initial'"
  >
    <AppDesktop v-if="!isMobile" />
    <AppMobile v-else />
  </main>
  <ToggleEditable />
  <Toasts />
  <DialogExportDB />
  <DialogImportDB />
</template>
