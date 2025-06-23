<script setup lang="ts">
import { ArrowLeftToLine } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import DialogCommandMenu from '@/components/ui/Dialogs/DialogCommandMenu.vue'
import DialogInfo from '@/components/ui/Dialogs/DialogInfo.vue'
import DialogSettings from '@/components/ui/Dialogs/DialogSettings.vue'
import DropdownLogo from '@/components/ui/DropdownLogo.vue'
import ToggleFontSize from '@/components/ui/ToggleFontSize.vue'

import ToggleTheme from '@/components/ui/ToggleTheme.vue'
import Tooltip from '@/components/ui/Tooltip.vue'
import { useIsMobile } from '@/composables/useIsMobile'
import { useDocumentStore } from '@/stores/document'
import ToggleLeva from '../ui/ToggleLeva.vue'

const { isMobile } = useIsMobile()

const document = useDocumentStore()

const { t } = useI18n()
</script>

<template>
  <div
    class="flex items-center justify-between ml-1 mr-0.5 pr-0.5 mt-1 focus:ring-none focus:ring-secondary/20 outline-primary focus:ring-offset-1"
  >
    <DropdownLogo />
    <div
      class="gap-0.5 grid"
      :class="isMobile ? 'grid-cols-6' : 'grid-cols-7'"
    >
      <DialogInfo />
      <DialogSettings />
      <DialogCommandMenu />
      <ToggleFontSize />
      <ToggleTheme />
      <ToggleLeva v-if="!isMobile" />
      <Tooltip
        shortcut="Ctrl M"
        :name="`${t('verb.close')} panel`"
        :align="'end'"
        :side="'bottom'"
      >
        <button
          class="flex sticky right-0 items-center justify-center border  border-secondary bg-secondary text-primary  size-8"
          @click="document.show_sidebar_documents = !document.show_sidebar_documents"
        >
          <ArrowLeftToLine class="size-4" />
          <span class="sr-only">{{ t("verb.close") }} panel</span>
        </button>
      </Tooltip>
    </div>
  </div>
</template>
