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
  <div class="pb-2">
    <div class="text-foreground flex justify-between items-center border-b border-background py-1 min-h-8">
      <p>Status</p>
      <span>{{ database.status }}</span>
    </div>
    <div class="text-foreground flex justify-between items-center border-b border-background py-1 min-h-8">
      <p>Sidebar</p>
      <button
        class="flex items-center justify-center border hover:bg-secondary/80 border-secondary bg-background size-8"
        @click="document.show_sidebar_documents = !document.show_sidebar_documents"
      >
        <CircleCheckBig v-if="document.show_sidebar_documents" class="size-3.5 pointer-events-none" />
        <CircleDashed v-else class="size-3.5 pointer-events-none" />
      </button>
    </div>
    <div class="text-foreground flex justify-between items-center border-b border-background py-1 min-h-8">
      <p>Document {{ !document.content_editable ? 'Preview' : 'Editable' }}</p>
      <button class="flex items-center justify-center border hover:bg-secondary/80 border-secondary bg-background size-8" @click="document.toggle_editable()">
        <BookOpenText
          v-if="!document.content_editable"
          class="pointer-events-none size-4"
        />
        <PencilLine
          v-if="document.content_editable"
          class="pointer-events-none size-4"
        />
      </button>
    </div>
    <div class="text-foreground flex justify-between items-center border-b border-background py-1 min-h-8">
      <div class="flex flex-col  gap-1">
        <p class="text-primary">
          Theme
        </p>
        <span class="text-secondary-foreground">{{ colorTheme }}</span>
      </div>
      <ToggleTheme />
    </div>
    <div class="text-foreground flex justify-between items-center border-b border-background py-1 min-h-8">
      <div class="grid gap-1">
        <p>App Size</p>
        <span class="text-secondary-foreground">{{ appFontSize }}</span>
      </div>
      <ToggleFontSize />
    </div>
  </div>
</template>
