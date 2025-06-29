<script setup lang="ts">
import { ChevronDown, Pause, Play, Volume2, VolumeX } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Tooltip from '@/components/ui/Tooltip.vue'
import { useSpeechSynthesis } from '@/composables/useSpeechSynthesis'
import { useDatabaseStore } from '@/stores/database'
import { useDocumentStore } from '@/stores/document'
import { useModalStore } from '@/stores/modal'
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()
const document = useDocumentStore()
const database = useDatabaseStore()
const modal = useModalStore()
const { t } = useI18n()

const {
  isSupported,
  isPlaying,
  // isPaused,
  status,
  toggle,
  stop,
} = useSpeechSynthesis()

// Get the document content for speech
const documentContent = computed(() => {
  let content = ''

  // Add document title if available
  if (database.document_name) {
    content += `${database.document_name}. `
  }

  // Add document body
  if (database.document_body) {
    content += database.document_body
  }

  return content
})

const buttonIcon = computed(() => {
  if (status.value === 'playing')
    return Pause
  if (status.value === 'paused')
    return Play
  return Volume2
})

const tooltipText = computed(() => {
  if (status.value === 'playing')
    return t('speech.pause')
  if (status.value === 'paused')
    return t('speech.resume')
  return t('speech.readAloud')
})

function handleClick() {
  if (status.value === 'stopped') {
    toggle(documentContent.value)
  }
  else {
    toggle('')
  }
}

function handleStop() {
  stop()
}

function openSpeechSettings() {
  modal.show_speech_settings = true
}
</script>

<template>
  <div
    v-if="isSupported && !document.content_editable && database.loaded_id"
    class="fixed md:absolute bottom-0 z-[102] md:z-30 flex items-center justify-center left-12 md:left-12 print:hidden lg:left-auto md:justify-start lg:bottom-auto lg:top-0.5 lg:right-12 border border-secondary"
    :class="
      settings.leva === true && settings.attach === true
        ? 'lg:-translate-x-72'
        : ''
    "
  >
    <div class="flex items-center gap-1">
      <Tooltip
        :name="tooltipText"
        side="top"
      >
        <button
          class="relative flex items-center justify-center bg-background text-primary hover:text-primary-foreground hover:bg-primary/80 size-10"
          :class="{ 'bg-primary text-primary-foreground': isPlaying }"
          @click="handleClick"
        >
          <component :is="buttonIcon" class="pointer-events-none size-5" />
          <span class="sr-only">{{ tooltipText }}</span>
        </button>
      </Tooltip>

      <Tooltip
        v-if="isPlaying"
        :name="t('speech.stop')"
        side="top"
      >
        <button
          class="relative flex items-center justify-center bg-background text-primary hover:text-primary-foreground hover:bg-primary/80 size-10"
          @click="handleStop"
        >
          <VolumeX class="pointer-events-none size-5" />
          <span class="sr-only">{{ t('speech.stop') }}</span>
        </button>
      </Tooltip>
      <Tooltip
        :name="t('speech.settings')"
        side="top"
      >
        <button
          class="relative flex items-center justify-center bg-background text-primary hover:text-primary-foreground hover:bg-primary/80 size-10"
          @click="openSpeechSettings"
        >
          <!-- <Settings class="pointer-events-none size-4" /> -->
          <ChevronDown class="pointer-events-none size-4" />
          <span class="sr-only">{{ t('speech.settings') }}</span>
        </button>
      </Tooltip>
    </div>
  </div>
</template>
