<script setup lang="ts">
import { storeToRefs } from 'pinia'
import {
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from 'reka-ui'
import { useI18n } from 'vue-i18n'
import TextGenerateEffect from '@/components/ui/Inspira/TextGenerateEffect.vue'
import { allItemsChecked } from '@/composables/queries'

import { useDatabaseStore } from '@/stores/database'
import { useSettingsStore } from '@/stores/settings'
import SearchItem from './SearchItem.vue'
import SearchItemChecked from './SearchItemChecked.vue'

const setting = useSettingsStore()

const database = useDatabaseStore()
const { t } = useI18n()

const { results } = storeToRefs(database)

// Toggle function for the fixed filter
function toggleFixedFilter() {
  setting.toggle_show_favorites()
}
</script>

<template>
  <div class="h-full @container">
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
            class="flex items-center flex-col pt-24 justify-center w-full text-center"
          >
            <p
              class="flex flex-col items-center justify-center w-64 gap-3 p-3 text-xs bg-secondary text-foreground text-pretty"
            >
              <TextGenerateEffect :words="t('sidebar.noPinDocuments')" :delay="1000" />
            </p>
          </div>
          <div
            v-if="!setting.show_completed"
            class="py-1 px-0.5 flex flex-col transition-transform justify-start items-start relative gap-1 w-full "
          >
            <SearchItem
              v-for="item in results" :key="item.id" :data="item"
            />
          </div>
          <div
            v-if="!setting.show_favorites && setting.show_completed"
            class="py-1 px-0.5 mt-2.5 flex flex-col justify-start items-start relative gap-1 w-full "
          >
            <SearchItemChecked
              v-for="item in allItemsChecked" :key="item.id" :data="item"
            />
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
