<script setup lang="ts">
import type { Documents } from '@/db'
import { breakpointsTailwind, useBreakpoints, useDateFormat } from '@vueuse/core'
import { CircleOff, Pin } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger } from 'reka-ui'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Tooltip from '@/components/ui/Tooltip.vue'
import { useLocaleTimeAgo } from '@/composables/useTimeAgoLocale'

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
const hoverState = ref(false)

const database = useDatabaseStore()
const document = useDocumentStore()
const editor_store = useEditorStore()
const modal = useModalStore()
const breakpoints = useBreakpoints(breakpointsTailwind)
const largerThanLg = breakpoints.greater('lg')
const { loaded_id } = storeToRefs(database)
const { editor } = storeToRefs(editor_store)
const { hasUnsavedChanges } = useUnsavedChanges()
const { t, locale } = useI18n()

const date_created = useDateFormat(props?.data.document_data?.date_created, 'D MMM YYYY HH:mm', { locales: locale })
const date_updated = computed(() => {
  return useLocaleTimeAgo(props?.data.date)
})

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
</script>

<template>
  <div
    class="relative flex min-w-80 items-center justify-between w-full pr-3 pl-0.5 min-h-8 gap-2 md:pr-2 hover:ring-1 hover:bg-primary/10 hover:ring-primary"
    :class="loaded_id === props.data.id ? ' ring-1 ring-primary/70' : ''
    "
  >
    <HoverCardRoot v-model:open="hoverState" :close-delay="10" :open-delay="0">
      <HoverCardTrigger
        as="div"
        class="flex hover:text-primary!  px-0.5  w-full items-center  justify-start text-sm text-left "
      >
        <button
          class="@sm:max-w-full w-full text-left opacity-70 hover:opacity-100 focus-visible:text-primary  outline-hidden focus-visible:!outline-2 focus-visible:outline-primary focus-visible:!outline-offset-4 focus-visible:outline-dotted"
          :class="loaded_id === props.data.id ? 'text-primary' : ''" @dblclick="document.toggle_editable()"
          @click="set_active_document(props.data.id)"
        >
          <template v-if="props.data.document_data?.name">
            <span class="sr-only">{{ t("verb.open") }}</span>
            <span class="line-clamp-1">
              {{
                props.data.document_data?.name
              }}
            </span>
            <span class="sr-only">document in editor</span>
          </template>
          <template v-else>
            <span class="opacity-50">{{ t("editor.untitled") }}</span>
          </template>
        </button>
      </HoverCardTrigger>
      <HoverCardPortal>
        <HoverCardContent
          class="z-10 p-2 font-mono border shadow-xs w-96 bg-background text-foreground border-primary"
          :side-offset="50" :side="'right'" :align="'center'"
        >
          <div class="flex flex-col">
            <div class="relative flex flex-col">
              <div class="mb-3 text-sm font-medium">
                {{ props.data.document_data?.name }}
              </div>
              <p class="text-xs ">
                {{ t("verb.lastUpdated") }} {{ date_updated }}
              </p>
              <p class="text-xs ">
                {{ t("verb.created") }} {{ date_created }}hs
              </p>
              <div v-if="props.data.document_data?.fixed" class="absolute  right-0 m-1 bottom-1">
                <Pin class="fill-current size-4 text-primary " />
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCardPortal>
    </HoverCardRoot>
    <Tooltip :name="t('sidebar.markAsDone')" side="right">
      <span>
        <label :for="`item-${props.data.id}`" class="">
          <input
            :id="`item-${props.data.id}`" type="checkbox" :checked="props.data.document_data?.checked" required
            class="sr-only peer" :aria-label="t('sidebar.markAsDone')" @change="toggleCheck(props.data, $event)"
          >
          <div
            class="peer-focus:outline-hidden items-center size-7 md:size-6 flex justify-center rounded-full relative z-50 mr-0.5 peer-focus:ring-1 peer-focus:ring-blue-300 dark:peer-focus:ring-primary hover:ring-primary hover:ring-2"
          >
            <CircleOff v-show="loaded_id === props.data.id" class="size-5 md:size-4 text-primary" />
            <CircleOff v-show="loaded_id !== props.data.id" class="size-5 md:size-4" />
          </div>
          <span class="sr-only">{{ t("sidebar.markAsDone") }}</span>
        </label>
      </span>
    </Tooltip>
  </div>
</template>
