<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

import { Pin, Search, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import {
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxRoot,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  VisuallyHidden,
} from 'reka-ui'
import { nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import Tooltip from '@/components/ui/Tooltip.vue'
import { allItemsTodo } from '@/composables/queries'
import { useIsMobile } from '@/composables/useIsMobile'
import { useUnsavedChanges } from '@/composables/useUnsavedChanges'
import { useDatabaseStore } from '@/stores/database'
import { useDocumentStore } from '@/stores/document'
import { useEditorStore } from '@/stores/editor'
import { useFocusStore } from '@/stores/focus'
import { useModalStore } from '@/stores/modal'

const focus = useFocusStore()
const database = useDatabaseStore()
const editor_store = useEditorStore()
const document = useDocumentStore()
const modal = useModalStore()

const { hasUnsavedChanges } = useUnsavedChanges()

const breakpoints = useBreakpoints(breakpointsTailwind)
const largerThanLg = breakpoints.greater('lg')

const { editor } = storeToRefs(editor_store)
const { loaded_id } = storeToRefs(database)
const { isMobile } = useIsMobile()
const { t } = useI18n()

function close() {
  modal.show_commandbar = false
}

function select_document(id: string | undefined) {
  modal.show_commandbar = false
  if (hasUnsavedChanges()) {
    database.select_id = id
    modal.show_alert_unsaved_changes = true
  }
  else {
    database.set_document(id)
  }
}

function new_document() {
  document.clear_editor()
  document.content_editable = true
  modal.show_commandbar = false
  focusOnTitle()
}

function focusEditor() {
  document.content_editable = true
  close()
  if (largerThanLg.value === false) {
    document.show_sidebar_documents = false
  }
  nextTick(() => {
    editor.value.commands.focus()
  })
}

function show_settings() {
  close()
  setTimeout(() => {
    modal.show_settings = true
  }, 100)
}

function focusOnTitle() {
  document.content_editable = true
  close()
  setTimeout(() => {
    focus.SetFocusTitle()
  }, 100)
}

function focusOnSidebar() {
  if (!focus.focus_sidebar)
    return
  close()
  setTimeout(() => {
    focus.setFocusSidebar()
  }, 100)
}
</script>

<template>
  <DialogRoot v-model:open="modal.show_commandbar">
    <Tooltip
      :name="t('commandBar.title')"
      side="bottom"
      shortcut="ctrl + alt + o"
    >
      <DialogTrigger
        class="flex items-center justify-center border interactive border-secondary hover:bg-secondary/80 bg-background size-8"
      >
        <Search class="size-4" />
        <span class="sr-only">{{ t("commandBar.title") }}</span>
      </DialogTrigger>
    </Tooltip>
    <DialogPortal>
      <DialogOverlay class="bg-background/80 fixed inset-0 z-90" />
      <DialogContent
        class="fixed top-4 md:top-[15%] left-[50%] max-h-256 w-[90vw] max-w-2xl translate-x-[-50%] text-sm overflow-hidden border bg-background border-muted-foreground/30 focus:outline-hidden z-100"
      >
        <VisuallyHidden>
          <DialogTitle>{{ t("commandBar.title") }} </DialogTitle>
          <DialogDescription>{{ t("commandBar.description") }}</DialogDescription>
        </VisuallyHidden>

        <ComboboxRoot :open="true">
          <ComboboxInput
            :placeholder="`${t('verb.search')}&hellip;`"
            auto-focus
            class="sticky top-0 right-0 font-mono bg-background border-b border-secondary w-full px-4 py-3 text-foreground outline-hidden placeholder-muted-foreground select-all!"
            @keydown.enter.prevent
          />
          <ComboboxContent
            class="border-t border-muted-foreground/30 p-2 overflow-y-auto h-96"
            @escape-key-down="modal.show_commandbar = false"
          >
            <ComboboxEmpty class="text-center text-muted-foreground p-4">
              {{ t("sidebar.noResults") }}
            </ComboboxEmpty>
            <ComboboxGroup v-if="allItemsTodo?.length !== 0">
              <ComboboxLabel class="px-4 text-muted-foreground font-semibold mt-3 mb-3 font-mono">
                {{ t("commandBar.documents") }}
              </ComboboxLabel>
              <ComboboxItem
                v-for="item in allItemsTodo"
                :key="item.id"
                :value="item.document_data?.name || item.id || ''"
                class="cursor-default font-mono text-xs px-4 py-2 rounded-md text-foreground data-highlighted:bg-muted inline-flex justify-between w-full items-center gap-4"
                :class="item.id === loaded_id ? 'text-primary' : ''"
                @select="select_document(item.id)"
              >
                <span>{{ item.document_data?.name || item.id }}</span>
                <Pin
                  v-if="item.document_data?.fixed"
                  class="size-4 fill-current  text-primary"
                />
              </ComboboxItem>
            </ComboboxGroup>
            <ComboboxGroup class="mt-6">
              <ComboboxLabel class="px-4 text-muted-foreground font-semibold mt-3 mb-3 font-mono">
                {{ t("commandBar.actions") }}
              </ComboboxLabel>
              <ComboboxItem
                :value="t('sidebar.newDocument')"
                class="cursor-default font-mono text-xs px-4 py-2 rounded-md text-foreground data-highlighted:bg-muted inline-flex w-full items-center gap-4"
                @select="new_document()"
              >
                <span>{{ t("sidebar.newDocument") }}</span>
              </ComboboxItem>
              <ComboboxItem
                :value="`${t('verb.open')} ${t('settings.title')}`"
                class="cursor-default font-mono text-xs px-4 py-2 rounded-md data-highlighted:bg-muted inline-flex w-full items-center gap-4"
                @select="show_settings()"
              >
                <span class="text-foreground"> {{ t("verb.open") }} {{ t("settings.title") }}</span>
              </ComboboxItem>
            </ComboboxGroup>
            <ComboboxGroup v-if="!isMobile">
              <ComboboxLabel class="px-4 text-muted-foreground font-semibold mt-3 mb-3 font-mono">
                {{ t("verb.focus") }}
              </ComboboxLabel>
              <ComboboxItem
                :value="t('commandBar.focusSidebar')"
                class="cursor-default justify-between font-mono text-xs px-4 py-2 rounded-md data-highlighted:bg-muted inline-flex w-full items-center gap-4"
                @select="focusOnSidebar()"
              >
                <span class="text-foreground">{{ t("commandBar.focusSidebar") }}</span>
                <span
                  class="inline-flex bg-primary text-primary-foreground px-1 rounded p-0.5 text-xs!"
                >
                  <kbd>Ctrl Shift Alt &larr;</kbd>
                </span>
              </ComboboxItem>
              <ComboboxItem
                :value="t('commandBar.focusTitle')"
                class="cursor-default justify-between font-mono text-xs px-4 py-2 rounded-md data-highlighted:bg-muted inline-flex w-full items-center gap-4"
                @select="focusOnTitle()"
              >
                <span class="text-foreground">{{ t("commandBar.focusTitle") }}</span>
                <span
                  class="inline-flex bg-primary text-primary-foreground px-1 rounded p-0.5 text-xs!"
                >
                  <kbd>Ctrl Shift Alt &rarr;</kbd>
                </span>
              </ComboboxItem>
              <ComboboxItem
                v-if="!isMobile"
                :value="t('commandBar.focusEditor')"
                class="cursor-default justify-between font-mono text-xs px-4 py-2 rounded-md text-foreground data-highlighted:bg-muted inline-flex w-full items-center gap-4"
                @select="focusEditor()"
              >
                <span>{{ t("commandBar.focusEditor") }}</span>
                <span
                  class="inline-flex bg-primary text-primary-foreground px-1 rounded p-0.5 text-xs!"
                >
                  <kbd>Ctrl Shift Alt U</kbd>
                </span>
              </ComboboxItem>
            </ComboboxGroup>
          </ComboboxContent>
        </ComboboxRoot>
        <button
          class="absolute top-0 size-6 flex justify-center items-center m-3 right-0 z-999 text-foreground"
          @click="close"
        >
          <X class="size-4" />
        </button>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
