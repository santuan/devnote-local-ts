<script setup lang="ts">
import { ChevronsUpDown, Circle, CircleOff, Pin, Search } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import slugify from '@/composables/slugify'
import { useDatabaseStore } from '@/stores/database'
import { useEditorStore } from '@/stores/editor'
import { useModalStore } from '@/stores/modal'

const { t } = useI18n()

const document = useEditorStore()
const database = useDatabaseStore()
const modal = useModalStore()
const { editor } = storeToRefs(document)
const showOnlyHeadings = shallowRef(false)
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

// Get heading level styling
function getHeadingClass(level: number) {
  const classes = {
    1: 'text-xs w-32 font-bold text-foreground',
    2: 'pl-1 text-xs w-28 font-semibold text-foreground',
    3: 'pl-2 text-xs w-28 font-semibold text-foreground',
    4: 'pl-3 text-xs w-28 font-medium text-foreground',
    5: 'pl-4 text-xs w-28 font-medium text-muted-foreground',
    6: 'pl-5 text-xs w-28 font-normal text-muted-foreground',
  }
  return (
    classes[level as keyof typeof classes] || 'text-xs text-muted-foreground'
  )
}
</script>

<template>
  <div
    v-if="database.loaded_id"
    class="grid max-w-[15rem] w-[15rem] overflow-hidden gap-3"
  >
    <!-- Document Info -->
    <div v-show="showOnlyHeadings" class="pb-3 border-b border-secondary">
      <div class="mb-2">
        <span class="opacity-50">loaded_id:</span> {{ database.loaded_id }}
      </div>
      <h3 class="mb-2">
        {{
          database.document_name?.length === 0 ? "---" : database.document_name
        }}
      </h3>
      <div
        class="grid  p-0.5 gap-0.5 bg-secondary"
        :class="!database.document_checked ? 'grid-cols-2' : ''"
      >
        <div class="flex items-center justify-center gap-2 py-2 text-xs uppercase bg-background">
          {{
            database.document_checked
              ? t("message.completed")
              : t("message.unmarked")
          }}
          <Circle v-show="!database.document_checked" class="size-5 md:size-3" />
          <CircleOff v-show="database.document_checked" class="size-5 md:size-3" />
        </div>
        <div
          v-if="!database.document_checked"
          :key="database.document_name"
          class="flex items-center justify-center gap-2 py-2 text-xs uppercase bg-background"
        >
          {{ database.document_fixed ? t("verb.fixed") : t("verb.unfixed") }}
          <Pin
            class="size-3"
            :class="database.document_fixed ? 'fill-current  text-primary' : ''"
          />
        </div>
      </div>
    </div>

    <!-- Content Statistics -->
    <div v-show="showOnlyHeadings" class="pb-3 border-b border-secondary">
      <h3 class="mb-2 text-xs font-semibold text-primary">
        Content Statistics
      </h3>
      <div class="grid gap-2 text-xs">
        <div>
          <span class="opacity-50">Code Blocks:</span>
          <span class="ml-1 font-mono font-bold">{{
            contentAnalysis.codeBlocks
          }}</span>
        </div>
        <div>
          <span class="opacity-50">Headings:</span>
          <span class="ml-1 font-mono font-bold">{{
            contentAnalysis.totalHeadings
          }}</span>
        </div>
        <div>
          <span class="opacity-50">Words:</span>
          <span class="ml-1 font-mono font-bold">{{
            contentAnalysis.wordCount
          }}</span>
        </div>
        <div v-if="editor" class="pt-3 border-y border-secondary">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs opacity-50">Character</span>
            <span class="font-mono text-xs">{{ contentAnalysis.characterCount }} / 50000</span>
          </div>
          <div class="w-full h-1 rounded-full bg-secondary">
            <div
              class="h-1.5 rounded-full transition-all duration-300"
              :class="
                contentAnalysis.characterCount > 40000
                  ? 'bg-primary'
                  : contentAnalysis.characterCount > 30000
                    ? 'opacity-60 bg-primary'
                    : 'opacity-30 bg-primary'
              "
              :style="{
                width: `${Math.min(
                  (contentAnalysis.characterCount / 50000) * 100,
                  100,
                )}%`,
              }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Document Outline -->
    <div v-if="contentAnalysis.headings.length > 0">
      <div class="flex items-center justify-between gap-2 mb-2">
        <h3 class="text-xs font-semibold text-primary">
          Headings
        </h3>
        <button class="flex items-center justify-center size-5" @click="showOnlyHeadings = !showOnlyHeadings">
          <ChevronsUpDown class="text-foreground size-3" />
        </button>
      </div>
      <div class="pb-3 space-y-1 overflow-x-hidden overflow-y-auto max-w-64 max-h-64">
        <div
          v-for="(heading, index) in contentAnalysis.headings"
          :key="index"
          class="flex items-center justify-between w-full gap-2 p-1 truncate transition-colors duration-150 rounded hover:bg-secondary/50 focus:outline-none focus:ring-1 focus:ring-primary"
          :class="[getHeadingClass(heading.level)]"
        >
          <a class="truncate" :href="`#${slugify(heading.text)}`">
            {{ heading.text }}
          </a>
          <span class="opacity-30">H{{ heading.level }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- No Document Loaded State -->
  <div v-else class="flex items-center justify-center bg-background min-h-64">
    <button
      class="flex flex-col items-center justify-center gap-3 p-3 transition-colors bg-secondary hover:bg-secondary/80"
      @click="modal.show_commandbar = true"
    >
      <Search class="opacity-50 size-9" />
      <span class="text-xs">Select document</span>
    </button>
  </div>
</template>
