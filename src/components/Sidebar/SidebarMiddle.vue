<script setup lang="ts">
import NumberFlow from '@number-flow/vue'
import { Circle, CircleOff, Pin } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import ButtonCreateDocument from '@/components/ui/Button/ButtonCreateDocument.vue'

import SelectSort from '@/components/ui/Select/SelectSort.vue'
import Tooltip from '@/components/ui/Tooltip.vue'
import { useDatabaseStore } from '@/stores/database'
import { useFocusStore } from '@/stores/focus'

import { useModalStore } from '@/stores/modal'
import { useSettingsStore } from '@/stores/settings'

const setting = useSettingsStore()
const modal = useModalStore()
const focus = useFocusStore()
const database = useDatabaseStore()
const { t } = useI18n()
const { focus_documents } = storeToRefs(focus)

const { file_name, results } = storeToRefs(database)

// Toggle function for the fixed filter
function toggleFixedFilter() {
  setting.toggle_show_favorites()
}

// Toggle function for the fixed filter
function toggleShowCompleted() {
  setting.toggle_show_completed()
  setting.show_favorites = false
}
</script>

<template>
  <div>
    <ButtonCreateDocument />
    <div class="flex items-center justify-between w-full px-1 py-1 text-xs">
      <div class="w-full pl-1 !border-0 !outline-0 !ring-0 flex justify-between items-center gap-1">
        <span>{{ t("commandBar.documents") }}
          <span v-if="setting.show_completed">{{ t("message.completed") }}</span>
          <span v-if="!setting.show_completed">{{ t("message.unmarked") }}</span>
        </span>
        <Tooltip :name="`${t('verb.toggle')} ${t('message.completed')} / ${t('message.unmarked')}`" side="top" shortcut="ctrl + alt + shift + Y">
          <button
            ref="focus_documents"
            class="h-8 items-center gap-3 p-2 outline-1 outline-secondary! hover:outline-primary! focus-visible:outline-primary! capitalize text-xs justify-center flex"
            @click="toggleShowCompleted()"
          >
            <div class="gap-2 flex justify-center items-center">
              <Circle class="size-4 " :class="!setting.show_completed ? 'text-primary' : ' opacity-50 '" />
              <CircleOff class="size-4 " :class="setting.show_completed ? 'text-primary ' : ' opacity-50 '" />
            </div>
          </button>
        </Tooltip>
      </div>
    </div>
    <div
      v-if="!setting.show_completed"
      class="flex pr-2 py-1.5 gap-0.5 mt-0 w-full focus-within:border-primary border-t border-secondary outline-none justify-start items-center"
    >
      <Tooltip :name="t('sidebar.showPinned')" side="top" shortcut="ctrl + alt + shift + F">
        <button class="p-2 size-8" title="Show only fixed items" @click="toggleFixedFilter()">
          <Pin class="origin-center size-4" :class="[{ 'fill-current text-primary': setting.show_favorites }]" />
        </button>
      </Tooltip>
      <Tooltip :name="t('settings.editDBname')" side="top" shortcut="ctrl + alt + shift + E">
        <button
          class="text-xs outline-hidden mr-auto w-36 text-primary flex justify-start items-center gap-1 hover:outline-1 hover:outline-primary hover:outline-offset-4 focus-visible:outline-offset-4 focus-visible:outline-dotted focus-visible:outline-1 focus-visible:outline-primary"
          @click="modal.show_export_db = true"
        >
          <NumberFlow
            class="flex items-center justify-center h-5 px-1 font-mono font-bold rounded bg-primary text-primary-foreground min-w-6"
            :value="results ? results?.length : 0"
          />
          <span v-show="!file_name" class="truncate text-left min-w-28 max-w-28">{{ t("commandBar.documents") }}</span>
          <span class="truncate text-left min-w-28 max-w-28">{{
            file_name
          }}</span>
        </button>
      </Tooltip>
      <SelectSort />
    </div>
  </div>
</template>
