<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { CircleCheckBig, CircleDashed } from 'lucide-vue-next'
import { useDatabaseStore } from '@/stores/database'
import { useDocumentStore } from '@/stores/document'
import ToggleFontSize from '../ToggleFontSize.vue'
import ToggleTheme from '../ToggleTheme.vue'

const props = defineProps({
  panelRef: {
    type: Object,
    default: () => ({}),
  },
})
const database = useDatabaseStore()
const document = useDocumentStore()

const colorTheme = useStorage('theme', 'theme-foreground')
const appFontSize = useStorage('appFontSize', 'app-font-size-md')
</script>

<template>
  <div class="text-foreground flex justify-between items-center border-b border-background">
    <p>Sidebar</p>
    <span>
      <CircleCheckBig v-if="document.show_sidebar_documents" class="size-3.5" />
      <CircleDashed v-else class="size-3.5" />
    </span>
  </div>
  <div class="text-foreground flex justify-between items-center border-b border-background py-2">
    <p>Sidebar.isCollapsed</p>
    <span>
      <CircleCheckBig v-if="props.panelRef.isCollapsed" class="size-3.5" />
      <CircleDashed v-else class="size-3.5" />
    </span>
  </div>
  <div class="text-foreground flex justify-between items-center border-b border-background py-2">
    <p>Sidebar.isExpanded</p>
    <span>
      <CircleCheckBig v-if="props.panelRef.isExpanded" class="size-3.5" />
      <CircleDashed v-else class="size-3.5" />
    </span>
  </div>
  <div class="text-foreground flex justify-between items-center border-b border-background py-2">
    <p>Loaded id</p>
    <span>{{ database.loaded_id?.length === 0 ? '-' : database.loaded_id }}</span>
  </div>
  <div class="text-foreground flex justify-between items-center border-b border-background py-2">
    <p>Document view</p>
    <span>{{ !document.content_editable ? 'Preview' : 'Editable' }}</span>
  </div>
  <div class="text-foreground flex justify-between items-center border-b border-background py-2">
    <p>Status</p>
    <span>{{ database.status }}</span>
  </div>
  <div class="text-foreground flex justify-between items-center border-b border-background py-2">
    <div class="flex flex-col  gap-1">
      <p class="text-primary">
        Theme
      </p>
      <span class="text-secondary-foreground">{{ colorTheme }}</span>
    </div>
    <ToggleTheme />
  </div>
  <div class="text-foreground flex justify-between items-center border-b border-background py-2">
    <div class="grid gap-1">
      <p>App Size</p>
      <span class="text-secondary-foreground">{{ appFontSize }}</span>
    </div>
    <ToggleFontSize />
  </div>
</template>
