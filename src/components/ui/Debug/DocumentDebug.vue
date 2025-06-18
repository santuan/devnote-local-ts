<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useDatabaseStore } from '@/stores/database'
import { useEditorStore } from '@/stores/editor'
import { useModalStore } from '@/stores/modal'

const document = useEditorStore()
const database = useDatabaseStore()
const modal = useModalStore()
const { editor } = storeToRefs(document)

// Compute content statistics and index
const contentAnalysis = computed(() => {
  if (!editor.value) {
    return {
      codeBlocks: 0,
      headings: [],
      totalHeadings: 0,
      wordCount: 0,
      characterCount: 0,
    }
  }

  const doc = editor.value.state.doc
  const headings: Array<{ level: number, text: string, pos: number }> = []
  let codeBlocks = 0

  // Traverse the document to find headings and code blocks
  doc.descendants((node: any, pos: any) => {
    if (node.type.name === 'heading') {
      const level = node.attrs.level
      const text = node.textContent.trim()
      headings.push({ level, text: text || `Heading ${level}`, pos })
    }
    else if (node.type.name === 'codeBlock') {
      codeBlocks++
    }
  })

  return {
    codeBlocks,
    headings,
    totalHeadings: headings.length,
    wordCount: editor.value.storage.characterCount?.words?.() || 0,
    characterCount: editor.value.storage.characterCount?.characters?.() || 0,
  }
})

// Function to navigate to a specific heading
function navigateToHeading(pos: number) {
  if (editor.value) {
    editor.value.commands.focus()
    editor.value.commands.setTextSelection(pos)

    // Scroll the heading into view
    const view = editor.value.view
    const resolvedPos = view.state.doc.resolve(pos)
    const coords = view.coordsAtPos(resolvedPos.pos)

    if (coords) {
      const editorElement = view.dom.closest('.EditorContent')
      if (editorElement) {
        const scrollContainer = editorElement.querySelector('[data-reka-scroll-area-viewport]')
        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: coords.top - scrollContainer.getBoundingClientRect().top + 100,
          })
        }
      }
    }
  }
}

// Get heading level styling
function getHeadingClass(level: number) {
  const classes = {
    1: 'text-xs w-32 font-bold text-primary',
    2: 'text-xs w-32 font-semibold text-primary',
    3: 'text-xs w-32 font-semibold text-foreground',
    4: 'text-xs w-32 font-medium text-foreground',
    5: 'text-xs w-32 font-medium text-muted-foreground',
    6: 'text-xs w-32 font-normal text-muted-foreground',
  }
  return classes[level as keyof typeof classes] || 'text-xs text-muted-foreground'
}
</script>

<template>
  <div v-if="database.loaded_id" class="grid max-w-[15rem] w-[15rem] overflow-hidden gap-3">
    <!-- Document Info -->
    <div class="border-b border-secondary pb-3">
      <div><span class="opacity-50">loaded_id:</span> {{ database.loaded_id }} - {{ database.document_name?.length === 0 ? '---' : database.document_name }}</div>
      <!-- <div class="capitalize">
        - {{ database.document_checked ? t('message.completed') : t('message.unmarked') }}
      </div>
      <div v-if="!database.document_checked" :key="database.document_name">
        - {{ database.document_fixed ? t('verb.fixed') : t('verb.unfixed') }}
        <Pin class="size-4" :class="database.document_fixed ? 'fill-current  text-primary' : ''" />
      </div> -->
    </div>

    <!-- Content Statistics -->
    <div class="border-b border-secondary pb-3">
      <h3 class="text-sm font-semibold text-primary mb-2">
        Content Statistics
      </h3>
      <div class="grid gap-2 text-xs">
        <div>
          <span class="opacity-50">Code Blocks:</span>
          <span class="font-mono font-bold ml-1">{{ contentAnalysis.codeBlocks }}</span>
        </div>
        <div>
          <span class="opacity-50">Headings:</span>
          <span class="font-mono font-bold ml-1">{{ contentAnalysis.totalHeadings }}</span>
        </div>
        <div>
          <span class="opacity-50">Words:</span>
          <span class="font-mono font-bold ml-1">{{ contentAnalysis.wordCount }}</span>
        </div>
        <!-- Character Limit Progress -->
        <div v-if="editor" class="border-y   border-secondary pt-3">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs opacity-50">Character Limit</span>
            <span class="text-xs font-mono">{{ contentAnalysis.characterCount }} / 10000</span>
          </div>
          <div class="w-full bg-secondary rounded-full h-1">
            <div
              class="h-1.5 rounded-full transition-all duration-300"
              :class="contentAnalysis.characterCount > 9000 ? 'bg-primary' : contentAnalysis.characterCount > 7000 ? 'opacity-60 bg-primary' : 'opacity-30 bg-primary'"
              :style="{ width: `${Math.min((contentAnalysis.characterCount / 10000) * 100, 100)}%` }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Document Outline -->
    <div v-if="contentAnalysis.headings.length > 0">
      <h3 class="text-sm font-semibold text-primary mb-2">
        Headings
      </h3>
      <div class="max-h-48 overflow-y-auto pb-3 space-y-1">
        <button
          v-for="(heading, index) in contentAnalysis.headings"
          :key="index"
          class="inline-flex justify-between items-center hover:bg-secondary/50  truncate w-56 gap-2 p-1 rounded transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-primary"
          :class="[getHeadingClass(heading.level)]"
          @click="navigateToHeading(heading.pos)"
        >
          <span class="truncate">{{ heading.text }}</span>
          <span class="opacity-30 mr-2">H{{ heading.level }}</span>
        </button>
      </div>
    </div>
  </div>

  <!-- No Document Loaded State -->
  <div v-else class="bg-background  min-h-64 flex justify-center items-center">
    <button class="p-3 bg-secondary flex-col flex justify-center items-center gap-3 hover:bg-secondary/80 transition-colors" @click="modal.show_commandbar = true">
      <Search class="size-9 opacity-50" />
      <span class="text-xs">Select document</span>
    </button>
  </div>
</template>
