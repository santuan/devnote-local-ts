<script setup lang="ts">
import { Settings2, X } from 'lucide-vue-next'

import { storeToRefs } from 'pinia'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'
import { useI18n } from 'vue-i18n'
import Tooltip from '@/components/ui/Tooltip.vue'

import { useIsMobile } from '@/composables/useIsMobile'

import { useModalStore } from '@/stores/modal'
import SettingCursor from './SettingCursor.vue'
import SettingDeleteDB from './SettingDeleteDB.vue'
import SettingDesktopShowIcons from './SettingDesktopShowIcons.vue'
import SettingLanguage from './SettingLanguage.vue'
import SettingMainTitle from './SettingMainTitle.vue'
import SettingTour from './SettingTour.vue'

const { t } = useI18n()

const modal = useModalStore()
const { isMobile } = useIsMobile()
const { show_settings } = storeToRefs(modal)
</script>

<template>
  <DialogRoot v-model:open="show_settings">
    <Tooltip
      :name="t('settings.title')"
      side="bottom"
      shortcut="Ctrl shift alt s"
    >
      <DialogTrigger
        class="flex items-center justify-center border interactive border-secondary hover:bg-secondary/80 bg-background size-8"
      >
        <Settings2 class="size-4" />
        <span class="sr-only">{{ t("settings.titleDescription") }}</span>
      </DialogTrigger>
    </Tooltip>
    <DialogPortal>
      <DialogOverlay class="bg-background/80 fixed inset-0 z-[900]" />
      <DialogContent
        class="font-mono fixed inset-0 h-screen w-full mx-auto bg-background rounded py-4 px-2 md:p-4 focus:outline-hidden z-[901]"
      >
        <div class="relative md:mt-6 max-w-3xl mx-auto">
          <DialogTitle class="text-foreground px-3 m-0 text-[17px] font-semibold">
            {{ t("settings.title") }}
          </DialogTitle>
          <DialogDescription class="mt-1 text-sm px-3  text-muted-foreground">
            {{ t("settings.titleDescription") }}
            <span>{{ isMobile ? "touch" : t("settings.mouseKeyboard") }}.</span>
          </DialogDescription>
          <DialogClose
            class="absolute inline-flex items-center justify-center appearance-none top-0 text-foreground hover:bg-secondary/80 right-0 size-7 focus:shadow-sm focus:outline-hidden focus-visible:ring-1 focus-visible:ring-primary focus-visible:text-primary"
            aria-label="Close"
          >
            <X />
          </DialogClose>
        </div>
        <div
          class="w-full border h-auto mt-2 md:mt-6 max-w-3xl mx-auto overflow-y-auto border-secondary focus-within:ring-primary/70 focus-within:ring-1 max-h-[80vh] sm:max-h-[75vh] focus:ring-primary! focus:ring-2! outline-hidden"
          style="--scrollbar-size: 10px"
        >
          <article class="max-w-full py-3 pl-3 mx-auto text-foreground">
            <div class="grid gap-1">
              <h4 class="mt-2 mb-0 text-xs text-primary">
                {{ t("settings.perspective") }}
              </h4>
              <SettingLanguage />
              <SettingTour v-if="!isMobile" />
              <SettingCursor v-if="!isMobile" />
              <SettingMainTitle />
              <SettingDesktopShowIcons v-if="!isMobile" />
              <h4 class="mt-2 mb-0 text-xs text-primary">
                {{ t("settings.database") }}
              </h4>
              <SettingDeleteDB />
            </div>
          </article>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
