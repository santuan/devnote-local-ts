<script setup lang="ts">
import DialogCommandMenu from '@/components/ui/Dialogs/DialogCommandMenu.vue'
import DialogInfo from '@/components/ui/Dialogs/DialogInfo.vue'
import DropdownLogo from '@/components/ui/DropdownLogo.vue'
import DialogSettings from '@/components/ui/Settings/DialogSettings.vue'
import ToggleFontSize from '@/components/ui/ToggleFontSize.vue'
import ToggleTheme from '@/components/ui/ToggleTheme.vue'
import Tooltip from '@/components/ui/Tooltip.vue'

import { useDocumentStore } from '@/stores/document'
import { ArrowLeftToLine, ArrowRightToLine } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const document = useDocumentStore()

const { t } = useI18n()
</script>

<template>
  <div
    class="flex items-center justify-between mt-1  focus:ring-none focus:ring-secondary/20 outline-primary focus:ring-offset-1"
    :class="document.show_sidebar_documents ? 'ml-1 mr-0.5 pr-0.5' : ' flex-col px-1 pb-2'"
  >
    <DropdownLogo />
    <div
      class="grid grid-cols-1 gap-1 mt-1"
      :class="{
        'grid-cols-6 gap-0.5': document.show_sidebar_documents,
      }"
    >
      <DialogInfo />
      <DialogSettings />
      <DialogCommandMenu />
      <ToggleTheme />
      <ToggleFontSize />
      <div>
        <Tooltip
          shortcut="Ctrl M"
          :name="`${t('verb.close')} panel`"
          :align="document.show_sidebar_documents ? 'end' : 'center'"
          :side="document.show_sidebar_documents ? 'bottom' : 'right'"
        >
          <button
            v-show="document.show_sidebar_documents"
            class="flex items-center justify-center border interactive border-secondary bg-background hover:bg-secondary/80 size-8"
            @click="document.show_sidebar_documents = !document.show_sidebar_documents"
          >
            <ArrowLeftToLine class="size-4" />
            <span class="sr-only">{{ t("verb.close") }} panel</span>
          </button>
        </Tooltip>
      </div>
    </div>
    <Tooltip
      v-if="!document.show_sidebar_documents"
      name="Abrir menú"
      align="end"
      side="right"
      :align-offset="18"
    >
      <button
        class="absolute flex flex-col justify-end items-center group z-10 inset-1 py-2 md:py-5 bottom-2 hover:border-1! top-73"
        @click="document.show_sidebar_documents = !document.show_sidebar_documents"
      >
        <ArrowRightToLine class="mx-auto opacity-25 size-4  group-hover:opacity-90" />
        <span class="sr-only">{{ t("verb.close") }} panel</span>
      </button>
    </Tooltip>
  </div>
</template>
