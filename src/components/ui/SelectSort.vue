<script setup lang='ts'>
import { useStorage } from '@vueuse/core'

import { Check, ChevronDown } from 'lucide-vue-next'
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { useI18n } from 'vue-i18n'

const sortOption = useStorage('sortItemsBy', 'name_asc')
const { t, locale } = useI18n()
</script>

<template>
  <SelectRoot :key="locale" v-model="sortOption">
    <SelectTrigger
      class="SelectTrigger flex items-center justify-between ml-2 w-28 h-8.5 px-1 text-xs border min-w-24 border-secondary shrink-0 bg-background text-secondary-foreground"
      :aria-label="`${t('sidebar.sort.sort')} documents list`"
    >
      <SelectValue :placeholder="t('sidebar.sort.placeholder')" />
      <ChevronDown class="h-3.5 w-3.5" />
      <span class="sr-only">{{ t('sidebar.sort.sort') }}</span>
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        class="min-w-[160px] bg-background  z-100 font-mono border border-secondary"
        position="popper"
        :side-offset="5"
        align="end"
      >
        <SelectViewport class="">
          <SelectLabel class="p-2 text-xs font-medium text-primary">
            {{ t('sidebar.sort.sort') }}
          </SelectLabel>
          <SelectGroup class="p-1">
            <SelectItem
              class="text-xs leading-none text-foreground flex items-center h-8 px-1 py-2 pr-12 relative select-none data-disabled:text-foreground/30 data-disabled:pointer-events-none data-highlighted:outline-hidden data-highlighted:bg-secondary/50 data-highlighted:text-foreground"
              value="name_asc"
            >
              <SelectItemIndicator class="absolute text-primary right-0 w-[25px] inline-flex items-center justify-center">
                <Check class="size-4" />
              </SelectItemIndicator>
              <SelectItemText>{{ t('sidebar.sort.name') }} AZ</SelectItemText>
            </SelectItem>
            <SelectItem
              class="text-xs leading-none text-foreground flex items-center h-8 px-1 py-2 pr-12 relative select-none data-disabled:text-foreground/30 data-disabled:pointer-events-none data-highlighted:outline-hidden data-highlighted:bg-secondary/50 data-highlighted:text-foreground"
              value="name_desc"
            >
              <SelectItemIndicator class="absolute text-primary right-0 w-[25px] inline-flex items-center justify-center">
                <Check class="size-4" />
              </SelectItemIndicator>
              <SelectItemText>{{ t('sidebar.sort.name') }} ZA</SelectItemText>
            </SelectItem>
            <SelectItem
              class="text-xs leading-none text-foreground flex items-center h-8 px-1 py-2 pr-12 relative select-none data-disabled:text-foreground/30 data-disabled:pointer-events-none data-highlighted:outline-hidden data-highlighted:bg-secondary/50 data-highlighted:text-foreground"
              value="date_asc"
            >
              <SelectItemIndicator class="absolute text-primary right-0 w-[25px] inline-flex items-center justify-center">
                <Check class="size-4" />
              </SelectItemIndicator>
              <SelectItemText>{{ t('sidebar.sort.date') }} AZ</SelectItemText>
            </SelectItem>
            <SelectItem
              class="text-xs leading-none text-foreground flex items-center h-8 px-1 py-2 pr-12 relative select-none data-disabled:text-foreground/30 data-disabled:pointer-events-none data-highlighted:outline-hidden data-highlighted:bg-secondary/50 data-highlighted:text-foreground"
              value="date_desc"
            >
              <SelectItemIndicator class="absolute text-primary right-0 w-[25px] inline-flex items-center justify-center">
                <Check class="size-4" />
              </SelectItemIndicator>
              <SelectItemText>{{ t('sidebar.sort.date') }} ZA</SelectItemText>
            </SelectItem>
          </SelectGroup>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<style scoped>
@reference "@/assets/main.css";

.SelectTrigger span[data-placeholder="select"],
.SelectTrigger span[data-placeholder="seleccionar"],
.SelectTrigger span[data-placeholder="auswählen"],
.SelectTrigger span[data-placeholder="sélectionner"],
.SelectTrigger span[data-placeholder="выбирать"],
.SelectTrigger span[data-placeholder="選択する"] {
    @apply text-foreground/25
}
</style>
