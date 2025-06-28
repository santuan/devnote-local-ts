<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast, Toaster } from 'vue-sonner'

const { t } = useI18n()
const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW()
const mode = useColorMode()

watch(offlineReady, (value) => {
  if (value) {
    toast.success(t('message.offlineReady'), {
      duration: 4000,
    })
    offlineReady.value = false
  }
})

watch(needRefresh, (value) => {
  if (value) {
    toast.info(t('message.newVersionAvailable'), {
      description: t('message.clickToUpdate'),
      duration: Infinity,
      action: {
        label: t('message.updateButton'),
        onClick: () => updateServiceWorker(),
      },
    })
  }
})
</script>

<template>
  <Toaster :theme="mode === 'light' ? 'light' : 'dark'" position="bottom-right" />
</template>
