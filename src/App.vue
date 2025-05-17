<script setup lang="ts">
import Document from '@/components/Document.vue'
import Sidebar from '@/components/Sidebar.vue'
import PullToRefresh from '@/components/ui/PullToRefresh.vue'
import Toasts from '@/components/ui/Toasts.vue'
import { useToggleColorTheme } from '@/composables/useToggleColorTheme'
import { useDatabaseStore } from '@/stores/database'
import { useStorage } from '@vueuse/core'
import { onMounted } from 'vue'
import DialogExportDB from './components/ui/Dialogs/DialogExportDB.vue'
import DialogImportDB from './components/ui/Dialogs/DialogImportDB.vue'
import ToggleEditable from './components/ui/ToggleEditable.vue'

const database = useDatabaseStore()

const colorTheme = useStorage('theme', 'theme-foreground')
const cursor_pointer = useStorage('cursor', true)

onMounted(() => {
  database.init_database()
  useToggleColorTheme(colorTheme.value)
})
</script>

<template>
  <main
    class="w-full min-h-screen font-mono bg-background text-foreground"
    :class="cursor_pointer ? 'cursor_pointer' : 'cursor_initial'"
  >
    <PullToRefresh>
      <div class="flex w-full print:h-auto! print:overflow-y-auto! h-screen overflow-y-hidden">
        <Sidebar />
        <ToggleEditable />
        <Document />
      </div>
    </PullToRefresh>
  </main>

  <Toasts />
  <DialogExportDB />
  <DialogImportDB />
</template>
