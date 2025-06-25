<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { BookOpenText, CircleCheckBig, CircleDashed, Heading1, MousePointer, PanelLeftClose, PanelLeftDashed, PencilLine, Pointer } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import DropdownLanguage from '@/components/ui/DropdownLanguage.vue'
import { useDatabaseStore } from '@/stores/database'
import { useDocumentStore } from '@/stores/document'
import { useSettingsStore } from '@/stores/settings'
import ToggleFontSize from '../ToggleFontSize.vue'

import ToggleTheme from '../ToggleTheme.vue'

const settings = useSettingsStore()
const { t } = useI18n()
const database = useDatabaseStore()
const document = useDocumentStore()

const colorTheme = useStorage('theme', 'theme-foreground')
const appFontSize = useStorage('appFontSize', 'app-font-size-md')

const cursor_pointer = useStorage('cursor', true)

function toggleCursor() {
  cursor_pointer.value = !cursor_pointer.value
}
</script>

<template>
  <div class="pb-2 px-2">
    <div class="text-foreground flex justify-between items-center border-b border-secondary pb-1 min-h-12 ">
      <p>Status</p>
      <span>{{ database.status }}</span>
    </div>
    <div class="text-foreground flex justify-between items-center border-b border-secondary py-1 min-h-12 ">
      <p class="text-muted-foreground">
        sidebar
      </p>
      <div class="flex justify-end gap-2 items-center">
        <span class="text-secondary-foreground">{{ document.show_sidebar_documents }}</span>
        <button
          class="flex items-center justify-center border hover:bg-secondary/80 border-secondary bg-background size-8"
          @click="document.show_sidebar_documents = !document.show_sidebar_documents"
        >
          <CircleCheckBig v-if="document.show_sidebar_documents" class="size-3.5 pointer-events-none" />
          <CircleDashed v-else class="size-3.5 pointer-events-none" />
        </button>
      </div>
    </div>
    <div class="text-foreground flex justify-between items-center border-b border-secondary py-1 min-h-12 ">
      <p class="text-muted-foreground">
        content_editable
      </p>
      <div class="flex justify-end gap-2 items-center">
        <span class="text-secondary-foreground">{{ document.content_editable }}</span>
        <button
          class="flex items-center justify-center border hover:bg-secondary/80 border-secondary bg-background size-8"
          @click="document.toggle_editable()"
        >
          <BookOpenText v-if="!document.content_editable" class="pointer-events-none size-4" />
          <PencilLine v-if="document.content_editable" class="pointer-events-none size-4" />
        </button>
      </div>
    </div>
    <div class="text-foreground flex justify-between items-center border-b border-secondary py-1 min-h-12 ">
      <p class="text-muted-foreground">
        theme
      </p>
      <div class="flex justify-end gap-2 items-center">
        <span class="text-secondary-foreground">{{ colorTheme }}</span>
        <ToggleTheme />
      </div>
    </div>
    <div class="text-foreground flex justify-between items-center border-b border-secondary py-1 min-h-12">
      <p class="text-muted-foreground">
        app_font_size
      </p>
      <div class="flex justify-end gap-2 items-center">
        <span class="text-secondary-foreground">{{ appFontSize }}</span>
        <ToggleFontSize />
      </div>
    </div>
    <div class="text-foreground flex justify-between items-center border-b border-secondary py-1 min-h-12">
      <p class="text-muted-foreground">
        dropdown_language
      </p>
      <div class="flex justify-end gap-2 items-center">
        <DropdownLanguage />
      </div>
    </div>
    <div class="text-foreground flex justify-between items-center border-b border-secondary py-1 min-h-12">
      <p class="text-muted-foreground">
        show_heading_one_preview
      </p>
      <div class="flex justify-end gap-2 items-center">
        <button
          class="flex focus:border-primary ring-foreground items-center justify-center border border-secondary bg-background shrink-0 hover:bg-secondary/80 size-8 focus:outline-2 focus:outline-foreground focus:outline-dashed focus:outline-offset-2"
          :class="
            settings.show_heading_one_preview
              ? 'hover:bg-primary! bg-primary hover:text-primary-foreground text-primary-foreground'
              : 'text-foreground'
          "
          @click="settings.toggle_heading_one_preview()"
        >
          <Heading1 class="size-5" />
          <span class="sr-only">{{ t("settings.showHeadingDescription") }}</span>
        </button>
      </div>
    </div>
    <div class="text-foreground flex justify-between items-center border-b border-secondary py-1 min-h-12">
      <p class="text-muted-foreground">
        desktop_show_icons
      </p>
      <div class="flex justify-end gap-2 items-center">
        <button
          class="flex focus:border-primary ring-foreground items-center justify-center border border-secondary bg-background shrink-0 hover:bg-secondary/80 size-8 focus:outline-2 focus:outline-foreground focus:outline-dashed focus:outline-offset-2"
          :class="
            settings.desktop_show_icons_sidebar_collapse
              ? 'hover:bg-primary! bg-primary hover:text-primary-foreground text-primary-foreground'
              : 'text-foreground'
          "
          @click="settings.toggle_desktop_show_icons_sidebar_collapse()"
        >
          <PanelLeftDashed v-if="!settings.desktop_show_icons_sidebar_collapse" class="size-5" />
          <PanelLeftClose v-else class="size-5  " />
          <span class="sr-only">{{ t("settings.showHeadingDescription") }}</span>
        </button>
      </div>
    </div>
    <div class="text-foreground flex justify-between items-center border-b border-secondary py-1 min-h-12">
      <p class="text-muted-foreground">
        cursor
      </p>
      <div class="flex justify-end gap-2 items-center">
        <button
          class="flex focus:border-primary ring-foreground items-center justify-center border border-secondary bg-background shrink-0 hover:bg-secondary/80 size-8 focus:outline-2 focus:outline-foreground focus:outline-dashed focus:outline-offset-2"
          @click="toggleCursor()"
        >
          <Pointer v-if="cursor_pointer" class="size-4" />
          <MousePointer v-else class="size-4" />
          <span class="sr-only">{{ t("settings.cursorDescription") }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
