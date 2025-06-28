<script setup lang="ts">
import { BookOpenText, PencilLine } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import Tooltip from '@/components/ui/Tooltip.vue'
import { useDocumentStore } from '@/stores/document'
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()
const document = useDocumentStore()
const { t } = useI18n()
</script>

<template>
  <div
    class="fixed md:absolute bottom-0 z-[101] md:z-30 flex items-center justify-center left-0 md:left-0 print:hidden lg:left-auto md:justify-start lg:bottom-auto lg:top-0.5 lg:right-0"
    :class="
      settings.leva === true && settings.attach === true
        ? 'lg:-translate-x-72'
        : ''
    "
  >
    <Tooltip
      :name="
        document.content_editable
          ? t('sidebar.contentPreview')
          : t('sidebar.contentEditable')
      "
      shortcut="Ctrl Alt P"
      side="top"
    >
      <button
        class="relative flex items-center justify-center ToggleEditable bg-background text-primary hover:text-primary-foreground hover:bg-primary/80 size-10"
        @click="document.toggle_editable()"
      >
        <BookOpenText
          v-if="document.content_editable"
          class="pointer-events-none size-5"
        />
        <PencilLine
          v-if="!document.content_editable"
          class="pointer-events-none size-5"
        />
        <span class="sr-only">{{
          document.content_editable
            ? t("sidebar.contentPreview")
            : t("sidebar.contentEditable")
        }}</span>
      </button>
    </Tooltip>
  </div>
</template>
