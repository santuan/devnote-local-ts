<script setup lang="ts">
import type { Documents } from '@/db'
import {
  breakpointsTailwind,
  useBreakpoints,
} from '@vueuse/core'
import { Circle, CircleOff, Pin, PinOff, Trash2 } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from 'reka-ui'
import { useI18n } from 'vue-i18n'

import Tooltip from '@/components/ui/Tooltip.vue'

import { useUnsavedChanges } from '@/composables/useUnsavedChanges'
import { useDatabaseStore } from '@/stores/database'
import { useDocumentStore } from '@/stores/document'
import { useEditorStore } from '@/stores/editor'

import { useModalStore } from '@/stores/modal'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
})

const database = useDatabaseStore()
const document = useDocumentStore()
const editor_store = useEditorStore()
const modal = useModalStore()
const breakpoints = useBreakpoints(breakpointsTailwind)
const largerThanLg = breakpoints.greater('lg')
const { loaded_id } = storeToRefs(database)
const { editor } = storeToRefs(editor_store)
const { hasUnsavedChanges } = useUnsavedChanges()
const { t } = useI18n()

function set_active_document(id: string | undefined) {
  database.select_id = id
  if (hasUnsavedChanges()) {
    modal.show_alert_unsaved_changes = true
    return
  }
  database.set_document(id)
  if (!largerThanLg.value) {
    document.show_sidebar_documents = false
  }
  if (largerThanLg.value) {
    setTimeout(() => {
      editor.value.commands.focus()
    }, 100)
  }
}

function toggleCheck(item: Documents, event: Event) {
  const target = event.target as HTMLInputElement
  database.change_document_checked(item, target.checked)
}

function toggleFixed(item: any, isfixed: any) {
  database.change_document_fixed(item, isfixed)
}

function handleDelete() {
  database.select_id = props.data.id
  modal.show_delete_document_modal = true
}
</script>

<template>
  <ContextMenuRoot>
    <ContextMenuTrigger as-child>
      <div
        class="relative flex min-w-80 items-center justify-between w-full pr-3 pl-0.5 min-h-8 gap-2 md:pr-2 hover:ring-1 hover:bg-primary/10 hover:ring-primary"
        :class="loaded_id === props.data.id ? ' ring-1 ring-primary/70' : ''"
      >
        <div class="flex items-center">
          <button
            class="flex items-center justify-center w-6 h-6 py-1 mx-0 outline-hidden md:py-0 ring-primary hover:text-primary focus-visible:outlined-1 focus-visible:outline-primary focus-visible:outline-dotted focus-visible:outline-offset-2!"
            @click="toggleFixed(props.data, props.data.document_data?.fixed)"
          >
            <Pin
              class="size-4"
              :class="
                props.data.document_data?.fixed ? 'fill-current  text-primary' : ''
              "
            />
            <span class="sr-only">{{
              props.data.document_data?.fixed ? t("verb.unfixed") : t("verb.fixed")
            }}</span>
          </button>
        </div>
        <button
          class="@sm:max-w-full w-full text-left max-w-80 focus-visible:text-primary outline-hidden focus-visible:outline-2! focus-visible:outline-primary focus-visible:outline-offset-4! focus-visible:outline-dotted"
          :class="loaded_id === props.data.id ? 'text-primary' : ''"
          @dblclick="document.toggle_editable()"
          @click="set_active_document(props.data.id)"
        >
          <p class="my-1 text-sm text-left font-medium line-clamp-1">
            {{ props.data.document_data?.name }}
          </p>
        </button>
        <Tooltip :name="t('sidebar.markAsDone')" side="right">
          <span>
            <label :for="`item-${props.data.id}`" class="">
              <input
                :id="`item-${props.data.id}`"
                type="checkbox"
                :checked="props.data.document_data?.checked"
                required
                class="sr-only peer"
                :aria-label="t('sidebar.markAsDone')"
                @change="toggleCheck(props.data, $event)"
              >
              <div
                class="peer-focus:outline-hidden items-center size-7 md:size-6 flex justify-center rounded-full relative z-50 mr-0.5 peer-focus:ring-1 peer-focus:ring-blue-300 dark:peer-focus:ring-primary hover:ring-primary hover:ring-2"
              >
                <Circle
                  v-show="loaded_id === props.data.id"
                  class="size-5 md:size-4 text-primary"
                />
                <Circle
                  v-show="loaded_id !== props.data.id"
                  class="size-5 md:size-4"
                />
              </div>
              <span class="sr-only">{{ t("sidebar.markAsDone") }}</span>
            </label>
          </span>
        </Tooltip>
      </div>
    </ContextMenuTrigger>
    <ContextMenuPortal>
      <ContextMenuContent
        class="min-w-[250px] z-50 font-mono grid gap-1 bg-background ring-1 ring-primary/50 text-foreground outline-hidden rounded p-1.5 shadow-sm"
        :side-offset="5"
      >
        <ContextMenuItem
          class="cursor-default justify-between text-xs flex items-center h-7 px-2 hover:bg-primary/20 outline-hidden data-highlighted:bg-primary/20"
          @click="toggleCheck(props.data, { target: { checked: !props.data.document_data?.checked } } as unknown as Event)"
        >
          <span>{{ props.data.document_data?.checked ? t('sidebar.markAsUndone') : t('sidebar.markAsDone') }}</span>
          <CircleOff class="size-3 " />
        </ContextMenuItem>
        <ContextMenuItem
          class="cursor-default text-xs flex justify-between items-center h-7 px-2 hover:bg-primary/20 outline-hidden data-highlighted:bg-primary/20"
          @click="toggleFixed(props.data, props.data.document_data?.fixed)"
        >
          <span>{{ props.data.document_data?.fixed ? t('verb.unfixed') : t('verb.fixed') }}</span>
          <component
            :is="props.data.document_data?.fixed ? PinOff : Pin"
            class="size-3"
          />
        </ContextMenuItem>
        <ContextMenuSeparator class="h-[0.0125rem] bg-secondary my-1" />
        <ContextMenuItem
          class="cursor-default justify-between text-xs flex items-center h-7 px-2 hover:bg-primary/20 outline-hidden data-highlighted:bg-destructive/60 "
          @click="handleDelete"
        >
          <span>{{ t('verb.delete') }}</span>
          <Trash2 class="size-3" />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>
