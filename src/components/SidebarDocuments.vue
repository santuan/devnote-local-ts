<script setup lang="ts">
import NumberFlow from '@number-flow/vue'
import { Pin } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import {
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from 'reka-ui'
import { useI18n } from 'vue-i18n'
import ButtonCreateDocument from '@/components/ui/ButtonCreateDocument.vue'
import TextGenerateEffect from '@/components/ui/Inspira/TextGenerateEffect.vue'
import { allItemsChecked } from '@/composables/queries'

import { useDatabaseStore } from '@/stores/database'
import { useFocusStore } from '@/stores/focus'
import { useModalStore } from '@/stores/modal'
import { useSettingsStore } from '@/stores/settings'
import SearchItem from './SearchItem.vue'
import SearchItemChecked from './SearchItemChecked.vue'
import SelectSort from './ui/SelectSort.vue'
import Tooltip from './ui/Tooltip.vue'

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
</script>

<template>
  <div class="h-full @container">
    <ButtonCreateDocument />
    <div
      class="flex pr-2 py-1.5 gap-0.5 mt-0 w-full focus-within:border-primary border-t border-secondary outline-none justify-start items-center"
    >
      <Tooltip :name="t('sidebar.showPinned')" side="top" shortcut="ctrl + alt + shift + F">
        <button ref="focus_documents" class="p-2 size-8" title="Show only fixed items" @click="toggleFixedFilter()">
          <Pin
            class="origin-center size-4"
            :class="[{ 'fill-current text-primary': setting.show_favorites }]"
          />
        </button>
      </Tooltip>
      <Tooltip :name="t('settings.editDBname')" side="top" shortcut="ctrl + alt + shift + E">
        <button
          class="text-xs outline-hidden w-36 text-primary flex justify-start items-center gap-1 hover:outline-1 hover:outline-primary hover:outline-offset-4 focus-visible:outline-offset-4 focus-visible:outline-dotted focus-visible:outline-1 focus-visible:outline-primary"
          @click="modal.show_export_db = true"
        >
          <NumberFlow
            class="flex items-center justify-center h-5 px-1 font-mono font-bold rounded bg-primary text-primary-foreground min-w-6"
            :value="results ? results?.length : 0"
          />
          <span
            v-show="!file_name"
            class="truncate text-left min-w-28 max-w-28"
          >{{ t("commandBar.documents") }}</span>
          <span class="truncate text-left min-w-28 max-w-28">{{
            file_name
          }}</span>
        </button>
      </Tooltip>
      <SelectSort />
    </div>
    <div class="overflow-y-auto SidebarDocuments overflow-x-hidden h-[calc(100dvh-8rem)]">
      <ScrollAreaRoot class="w-full h-full overflow-hidden" style="--scrollbar-size: 10px">
        <ScrollAreaViewport class="w-full h-full outline-primary/70">
          <div
            v-if="results?.length + allItemsChecked?.length === 0"
            class="flex flex-col items-center justify-start w-full text-center mt-14"
          >
            <p v-if="!setting.show_favorites" class="text-xs w-44 text-muted-foreground text-pretty">
              <TextGenerateEffect :words="t('sidebar.noResultsDescription')" :delay="50" />
            </p>
          </div>
          <div
            v-if="setting.show_favorites && results?.length === 0"
            class="flex items-center justify-center w-full text-center"
          >
            <p
              class="flex flex-col items-center justify-center w-64 gap-3 p-3 text-xs bg-secondary text-foreground text-pretty"
            >
              <TextGenerateEffect :words="t('sidebar.noPinDocuments')" :delay="150" />
            </p>
          </div>
          <div
            v-if="results"
            class="py-1 px-0.5 flex flex-col justify-start items-start relative gap-1 w-full min-h-12"
          >
            <SearchItem
              v-for="item in results" :key="item.id" :data="item"
            />
            <template v-if="!setting.show_favorites">
              <SearchItemChecked
                v-for="item in allItemsChecked" :key="item.id" :data="item"
              />
            </template>
          </div>
        </ScrollAreaViewport>
        <ScrollAreaScrollbar
          class="flex select-none touch-none p-0.5 bg-secondary hover:bg-background data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
          orientation="vertical"
        >
          <ScrollAreaThumb
            class="flex-1 bg-primary rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"
          />
        </ScrollAreaScrollbar>
      </ScrollAreaRoot>
      <button
        v-if="setting.show_favorites"
        class="fixed bottom-0 left-0 h-10 p-2 mt-2 text-xs border-primary w-80 bg-secondary text-secondary-foreground"
        @click="toggleFixedFilter()"
      >
        {{ t('verb.showAll') }}
      </button>
    </div>
  </div>
</template>
