<script setup lang="ts">
import NumberFlow from '@number-flow/vue'
import { ChevronsUpDown, Circle, CircleOff, Pin, Search } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
// Compute content statistics and index
import Toc from '@/components/ui/Tiptap/toc/toc.vue'

import { useDatabaseStore } from '@/stores/database'
import { useEditorStore } from '@/stores/editor'
import { useFocusStore } from '@/stores/focus'
import { useModalStore } from '@/stores/modal'
import Tooltip from '../Tooltip.vue'

const { t } = useI18n()

const document = useEditorStore()
const database = useDatabaseStore()
const modal = useModalStore()
const focus_store = useFocusStore()
const { editor, editorTocIndex } = storeToRefs(document)
const { focus_debug_heading } = storeToRefs(focus_store)

const showContentAnalysis = shallowRef(true)
const showOnlyHeadings = shallowRef(true)

const contentAnalysis = computed(() => {
  if (!editor.value) {
    return {
      codeBlocks: 0,
      headings: [],
      totalHeadings: 0,
      wordCount: 0,
      characterCount: 0,
      taskListCount: 0,
      taskListCheckedCount: 0,
    }
  }

  const doc = editor.value.state.doc
  const headings: Array<{ level: number, text: string, pos: number }> = []
  let codeBlocks = 0
  let taskListCount = 0
  let taskListCheckedCount = 0

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
    else if (node.type.name === 'taskItem') {
      if (node.attrs.checked === true) {
        taskListCheckedCount++
      }
      taskListCount++
    }
  })

  return {
    codeBlocks,
    headings,
    taskListCount,
    taskListCheckedCount,
    totalHeadings: headings.length,
    wordCount: editor.value.storage.characterCount?.words?.() || 0,
    characterCount: editor.value.storage.characterCount?.characters?.() || 0,
  }
})
</script>

<template>
  <div v-if="database.loaded_id" class="grid overflow-hidden gap-3">
    <!-- Document Info -->
    <div class="pb-3 px-2 border-b border-secondary">
      <div class="mb-2 grid grid-cols-2">
        <span class="opacity-50">loaded_id: {{ database.loaded_id }}</span>
        <div class="flex justify-end items-center gap-2" :class="!database.document_checked ? 'grid-cols-2' : ''">
          <Tooltip
            v-if="database.document_checked" :name="database.document_checked
              ? t('message.completed')
              : t('message.unmarked')" side="top"
          >
            <Circle v-show="!database.document_checked" class="size-3" />
            <CircleOff v-show="database.document_checked" class="size-3" />
          </Tooltip>
          <Tooltip
            v-if="!database.document_checked"
            :name="database.document_fixed ? t('verb.fixed') : t('verb.unfixed')" side="top"
          >
            <Pin class="origin-center size-3" :class="[{ 'fill-current text-primary': database.document_fixed }]" />
          </Tooltip>
        </div>
      </div>
      <h3 class="text-balance text-sm">
        {{
          database.document_name?.length === 0 ? "---" : database.document_name
        }}
      </h3>
    </div>

    <!-- Content Statistics -->
    <div class="px-2 ">
      <div class="flex items-center justify-between  gap-2">
        <h3 class="text-xs font-semibold text-primary">
          Content Statistics
        </h3>
        <button class="flex items-center justify-center size-5" @click="showContentAnalysis = !showContentAnalysis">
          <ChevronsUpDown class="text-foreground size-3" />
        </button>
      </div>
      <div v-if="showContentAnalysis" class="grid grid-cols-2 mt-1 gap-2 text-xs pb-3 pt-2">
        <div>
          <span class="opacity-50">Code Blocks:</span>
          <span class="ml-1 font-mono font-bold">
            {{ contentAnalysis.codeBlocks }}
          </span>
        </div>
        <div class="flex justify-end items-center">
          <span class="opacity-50">Headings:</span>
          <span class="ml-1 font-mono font-bold">
            {{ contentAnalysis.totalHeadings }}
          </span>
        </div>
        <div>
          <span class="opacity-50">Words:</span>
          <span class="ml-1 font-mono font-bold">
            {{ contentAnalysis.wordCount }}
          </span>
        </div>
        <div class="flex justify-end items-center">
          <span class="opacity-50">Task:</span>
          <span
            v-if="contentAnalysis.taskListCount !== 0" class="ml-1 font-mono font-bold"
            :class="contentAnalysis.taskListCount === contentAnalysis.taskListCheckedCount ? 'text-primary' : ''"
          >
            <NumberFlow :value="contentAnalysis.taskListCheckedCount" />
            /
            <NumberFlow :value="contentAnalysis.taskListCount" />
          </span>
          <span v-else>---</span>
        </div>
        <div v-if="editor" class="mt-0.5 col-span-2 ">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs opacity-50">Character</span>
            <span class="font-mono text-xs">
              {{ contentAnalysis.characterCount }}
              / 50000</span>
          </div>
          <div class="w-full h-1 rounded-full bg-secondary">
            <div
              class="h-1.5 rounded-full transition-all duration-300" :class="contentAnalysis.characterCount > 40000
                ? 'bg-primary'
                : contentAnalysis.characterCount > 30000
                  ? 'opacity-60 bg-primary'
                  : 'opacity-30 bg-primary'
              " :style="{
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
    <template v-if="contentAnalysis.headings.length > 0">
      <div
        class="flex items-center justify-between px-2  gap-2 border-t pt-2 border-secondary"
        :class="showOnlyHeadings ? 'pb-0' : 'pb-3'"
      >
        <h3 class="text-xs font-semibold text-primary">
          Headings
        </h3>
        <button ref="focus_debug_heading" class="flex items-center justify-center size-5" @click="showOnlyHeadings = !showOnlyHeadings">
          <ChevronsUpDown class="text-foreground size-3" />
        </button>
      </div>
      <div v-if="showOnlyHeadings" class="showOnlyHeadings px-2 pb-3 pt-0.5 space-y-1 overflow-x-hidden scrollbar scrollbar-thumb-primary scrollbar-track-secondary overflow-y-auto max-w-72">
        <Toc :editor="editor" :items="editorTocIndex" />
      </div>
    </template>
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
