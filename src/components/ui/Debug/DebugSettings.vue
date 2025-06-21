<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { BookOpenText, CircleCheckBig, CircleDashed, PencilLine } from 'lucide-vue-next'
import { useDatabaseStore } from '@/stores/database'
import { useDocumentStore } from '@/stores/document'
import ToggleFontSize from '../ToggleFontSize.vue'
import ToggleTheme from '../ToggleTheme.vue'

const database = useDatabaseStore()
const document = useDocumentStore()

const colorTheme = useStorage('theme', 'theme-foreground')
const appFontSize = useStorage('appFontSize', 'app-font-size-md')
</script>

<template>
  <div class="pb-2 px-2">
    <div class="text-foreground flex justify-between items-center border-b border-secondary pb-1 min-h-12 ">
      <p>Status</p>
      <span>{{ database.status }}</span>
    </div>
    <div class="text-foreground flex justify-between items-center border-b border-secondary py-1 min-h-12 ">
      <p class="text-muted-foreground">
        Sidebar
      </p>
      <div class="flex justify-end gap-2 items-center">
        <span class="text-secondary-foreground">{{ document.show_sidebar_documents }}</span>
        <button
          class="flex items-center justify-center border hover:bg-secondary/80 border-secondary bg-background size-8"
          @click="document.show_sidebar_documents = !document.show_sidebar_documents"
        >
          <CircleCheckBig v-if="document.show_sidebar_documents" class="size-3.5 pointer-events-none" />
          <CircleDashed v-else class="size-3.5 pointer-events-none" />
        </button>
      </div>
    </div>
    <div class="text-foreground flex justify-between items-center border-b border-secondary py-1 min-h-12 ">
      <p class="text-muted-foreground">
        Document
      </p>
      <div class="flex justify-end gap-2 items-center">
        <span class="text-secondary-foreground">{{ !document.content_editable ? 'preview' : 'editable' }}</span>
        <button
          class="flex items-center justify-center border hover:bg-secondary/80 border-secondary bg-background size-8"
          @click="document.toggle_editable()"
        >
          <BookOpenText v-if="!document.content_editable" class="pointer-events-none size-4" />
          <PencilLine v-if="document.content_editable" class="pointer-events-none size-4" />
        </button>
      </div>
    </div>
    <div class="text-foreground flex justify-between items-center border-b border-secondary py-1 min-h-12 ">
      <p class="text-muted-foreground">
        Theme
      </p>
      <div class="flex justify-end gap-2 items-center">
        <span class="text-secondary-foreground">{{ colorTheme }}</span>
        <ToggleTheme />
      </div>
    </div>
    <div class="text-foreground flex justify-between items-center py-1 min-h-12 ">
      <p class="text-muted-foreground">
        App Size
      </p>
      <div class="flex justify-end gap-2 items-center">
        <span class="text-secondary-foreground">{{ appFontSize }}</span>
        <ToggleFontSize />
      </div>
    </div>
  </div>
</template>
