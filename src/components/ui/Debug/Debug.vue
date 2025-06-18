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
  <div class="pb-2">
    <div class="text-foreground flex justify-between items-center border-b border-background py-2">
      <p>Status</p>
      <span>{{ database.status }}</span>
    </div>
    <div class="text-foreground flex justify-between items-center border-b border-background py-2">
      <p>Sidebar</p>
      <button
        class="size-6 border border-secondary flex justify-center items-center outline-none hover:border-2 hover:border-primary"
        @click="document.show_sidebar_documents = !document.show_sidebar_documents"
      >
        <CircleCheckBig v-if="document.show_sidebar_documents" class="size-3.5 pointer-events-none" />
        <CircleDashed v-else class="size-3.5 pointer-events-none" />
      </button>
    </div>
    <div class="text-foreground flex justify-between items-center border-b border-background py-2">
      <p>Sidebar.isCollapsed</p>
      <button
        class="size-6 border border-secondary flex justify-center items-center outline-none hover:border-2 hover:border-primary"
        :class="props.panelRef.isCollapsed ? 'bg-primary text-primary-foreground' : ''"
        @click="props.panelRef.collapse()"
      >
        <CircleCheckBig v-if="props.panelRef.isCollapsed" class="size-3.5 pointer-events-none" />
        <CircleDashed v-else class="size-3.5 pointer-events-none" />
      </button>
    </div>
    <div class="text-foreground flex justify-between items-center border-b border-background py-2">
      <p>Sidebar.isExpanded</p>
      <button
        class="size-6 border border-secondary flex justify-center items-center outline-none hover:border-2 hover:border-primary"
        :class="props.panelRef.isExpanded ? 'bg-primary text-primary-foreground' : ''"
        @click="props.panelRef.resize(50)"
      >
        <CircleCheckBig v-if="props.panelRef.isExpanded" class="size-3.5 pointer-events-none" />
        <CircleDashed v-else class="size-3.5 pointer-events-none" />
      </button>
    </div>
    <div class="text-foreground flex justify-between items-center border-b border-background py-2">
      <p>Document view</p>
      <button @click="document.toggle_editable()">
        {{ !document.content_editable ? 'Preview' : 'Editable' }}
      </button>
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
  </div>
</template>
