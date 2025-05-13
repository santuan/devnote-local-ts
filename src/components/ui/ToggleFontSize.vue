<script setup lang='ts'>
import CornerBottomRight from '@/assets/corner-bottom-right.vue'
import Tooltip from '@/components/ui/Tooltip.vue'
import { useDocumentStore } from '@/stores/document'
import { useStorage } from '@vueuse/core'
import { AArrowDown, AArrowUp, Check } from 'lucide-vue-next'
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const document_store = useDocumentStore()
const appFontSize = useStorage('appFontSize', 'app-font-size-md')
const { t } = useI18n()

function toggleFontSize(size: any) {
  document.body.classList.remove(appFontSize.value)
  document.body.classList.add(size)
  appFontSize.value = size
}

onMounted(() => {
  toggleFontSize(appFontSize.value)
})
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger class="interactive relative group">
      <Tooltip
        :name="t('settings.fontsize')"
        side="bottom"
      >
        <span
          class="flex items-center justify-center  border hover:bg-secondary/80 border-secondary bg-background size-8"
        >
          <AArrowDown class="AArrowDown size-5" />
          <AArrowUp class="AArrowUp size-5" />
          <span class="sr-only"> {{ t("settings.fontsizeDescription") }}</span>
        </span>
        <CornerBottomRight />
      </Tooltip>
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        :side="document_store.show_sidebar_documents ? 'bottom' : 'left'"
        :align="document_store.show_sidebar_documents ? 'end' : 'center'"
        class="z-10 grid w-48 text-xs bg-background border font-mono text-foreground border-primary"
        :side-offset="5"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem
            class="p-2 flex justify-start gap-1 w-full outline-hidden hover:bg-secondary-foreground/10 focus:ring-1 focus:ring-primary focus:bg-primary/20 focus:ring-inset"
            :class="appFontSize === 'app-font-size-xs' ? 'text-primary' : ''"
            @click="toggleFontSize('app-font-size-xs')"
          >
            <span>{{ t("settings.fontsizexs") }} </span>
            <span class="opacity-50 scale-90">.75rem</span>
            <Check v-show="appFontSize === 'app-font-size-xs' ? 'text-primary' : ''" class="size-4 ml-auto" />
          </DropdownMenuItem>
          <DropdownMenuItem
            class="p-2 flex justify-start gap-1 w-full outline-hidden hover:bg-secondary-foreground/10 focus:ring-1 focus:ring-primary focus:bg-primary/20 focus:ring-inset"
            :class="appFontSize === 'app-font-size-sm' ? 'text-primary' : ''"
            @click="toggleFontSize('app-font-size-sm')"
          >
            <span>{{ t("settings.fontsizesm") }} </span>
            <span class="opacity-50 scale-90">.875rem</span>
            <Check v-show="appFontSize === 'app-font-size-sm' ? 'text-primary' : ''" class="size-4 ml-auto" />
          </DropdownMenuItem>
          <DropdownMenuItem
            class="p-2 flex justify-start gap-1 w-full outline-hidden hover:bg-secondary-foreground/10 focus:ring-1 focus:ring-primary focus:bg-primary/20 focus:ring-inset"
            :class="appFontSize === 'app-font-size-md' ? 'text-primary' : ''"
            @click="toggleFontSize('app-font-size-md')"
          >
            <span>{{ t("settings.fontsizemd") }} </span>
            <span class="opacity-50 scale-90"> 1rem</span>
            <Check v-show="appFontSize === 'app-font-size-md' ? 'text-primary' : ''" class="size-4 ml-auto" />
          </DropdownMenuItem>
          <DropdownMenuItem
            class="p-2 flex justify-start gap-1 w-full outline-hidden hover:bg-secondary-foreground/10 focus:ring-1 focus:ring-primary focus:bg-primary/20 focus:ring-inset"
            :class="appFontSize === 'app-font-size-lg' ? 'text-primary' : ''"
            @click="toggleFontSize('app-font-size-lg')"
          >
            <span>{{ t("settings.fontsizelg") }} </span>
            <span class="opacity-50 scale-90">1.125rem</span>
            <Check v-show="appFontSize === 'app-font-size-lg' ? 'text-primary' : ''" class="size-4 ml-auto" />
          </DropdownMenuItem>
          <DropdownMenuItem
            class="p-2 flex justify-start gap-1 w-full outline-hidden hover:bg-secondary-foreground/10 focus:ring-1 focus:ring-primary focus:bg-primary/20 focus:ring-inset"
            :class="appFontSize === 'app-font-size-xl' ? 'text-primary' : ''"
            @click="toggleFontSize('app-font-size-xl')"
          >
            <span>{{ t("settings.fontsizexl") }} </span>
            <span class="opacity-50 scale-90">1.25rem</span>
            <Check v-show="appFontSize === 'app-font-size-xl' ? 'text-primary' : ''" class="size-4 ml-auto" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<style scoped>
@reference "@/assets/main.css";

.interactive[data-state="open"] {
  @apply text-primary;
}

.interactive[data-state="open"] .AArrowDown {
  @apply !flex;
}

.interactive[data-state="closed"] .AArrowDown {
  @apply !hidden;
}

.interactive[data-state="open"] .AArrowUp {
  @apply !hidden;
}

.interactive[data-state="closed"] .AArrowUp {
  @apply !flex;
}
</style>
