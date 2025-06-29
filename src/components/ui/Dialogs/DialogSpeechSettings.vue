<script setup lang="ts">
import { Volume2, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  // SliderRange,
  // SliderRoot,
  // SliderThumb,
  // SliderTrack,
} from 'reka-ui'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSpeechSynthesis } from '@/composables/useSpeechSynthesis'
import { useModalStore } from '@/stores/modal'

const modal = useModalStore()
const { t } = useI18n()

const {
  voices,
  selectedVoice,
  // rate,
  // pitch,
  // volume,
  setVoice,
  // speak,
  stop,
} = useSpeechSynthesis()

const { show_speech_settings } = storeToRefs(modal)

const groupedVoices = computed(() => {
  const groups: Record<string, SpeechSynthesisVoice[]> = {}

  voices.value.forEach((voice) => {
    const lang = voice.lang.split('-')[0] // Get language code without region
    if (!groups[lang]) {
      groups[lang] = []
    }
    groups[lang].push(voice)
  })

  return groups
})

// function testVoice() {
//   const testText = t('speech.testText')
//   speak(testText)
// }

function handleVoiceChange(voice: SpeechSynthesisVoice) {
  stop() // Stop any current speech
  setVoice(voice)
}
</script>

<template>
  <DialogRoot v-model:open="show_speech_settings">
    <DialogPortal>
      <DialogOverlay class="bg-background/80 fixed inset-0 z-[900]" />
      <DialogContent
        class="font-mono fixed top-6 translate-y-0 sm:top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-3xl translate-x-[-50%] sm:translate-y-[-50%] rounded-[6px] bg-background p-6 shadow-sm focus:outline-hidden z-[901] border border-secondary"
      >
        <DialogTitle class="text-foreground m-0 text-[17px] font-medium flex items-center gap-2">
          <Volume2 class="size-5" />
          {{ t('speech.settings') }}
        </DialogTitle>
        <DialogDescription class="text-foreground/60 mt-3 mb-5 text-[15px] leading-normal">
          {{ t('speech.settingsDescription') }}
        </DialogDescription>

        <div class="space-y-6">
          <!-- Voice Selection -->
          <div class="space-y-3">
            <!-- eslint-disable-next-line vue-a11y/label-has-for -->
            <label class="text-sm font-medium text-foreground">
              {{ t('speech.voice') }}
            </label>
            <div class="max-h-96 overflow-y-auto border border-secondary rounded px-2 space-y-2">
              <div v-for="(voiceGroup, lang) in groupedVoices" :key="lang" class="space-y-1">
                <div class="text-xs sticky top-0 bg-background py-3 px-2 font-semibold text-primary uppercase tracking-wide">
                  {{ lang }}
                </div>
                <div class="space-y-1">
                  <!-- eslint-disable-next-line vue-a11y/label-has-for -->
                  <label
                    v-for="voice in voiceGroup"
                    :key="voice.voiceURI"
                    class="flex items-center space-x-2 cursor-pointer hover:bg-secondary/50 p-1 rounded"
                  >
                    <input
                      type="radio"
                      :checked="selectedVoice?.voiceURI === voice.voiceURI"
                      class="text-primary focus:ring-primary"
                      @change="handleVoiceChange(voice)"
                    >
                    <span class="text-sm text-foreground">
                      {{ voice.name }}
                      <span class="text-xs text-foreground">({{ voice.lang }})</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- <div class="space-y-3">
            <label class="text-sm font-medium text-foreground flex items-center justify-between">
              {{ t('speech.rate') }}
              <span class="text-xs text-muted-foreground">{{ rate.toFixed(1) }}x</span>
            </label>
            <SliderRoot
              v-model="rate"
              :min="0.5"
              :max="2"
              :step="0.1"
              class="relative flex items-center select-none touch-none w-full h-5"
            >
              <SliderTrack class="bg-secondary relative grow rounded-full h-[3px]">
                <SliderRange class="absolute h-full rounded-full bg-primary" />
              </SliderTrack>
              <SliderThumb
                class="block w-5 h-5 bg-primary rounded-full hover:bg-primary/90 focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2"
              />
            </SliderRoot>
          </div>

          <div class="space-y-3">
            <label class="text-sm font-medium text-foreground flex items-center justify-between">
              {{ t('speech.pitch') }}
              <span class="text-xs text-muted-foreground">{{ pitch.toFixed(1) }}</span>
            </label>
            <SliderRoot
              v-model="pitch"
              :min="0.5"
              :max="2"
              :step="0.1"
              class="relative flex items-center select-none touch-none w-full h-5"
            >
              <SliderTrack class="bg-secondary relative grow rounded-full h-[3px]">
                <SliderRange class="absolute h-full rounded-full bg-primary" />
              </SliderTrack>
              <SliderThumb
                class="block w-5 h-5 bg-primary rounded-full hover:bg-primary/90 focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2"
              />
            </SliderRoot>
          </div>

          <div class="space-y-3">
            <label class="text-sm font-medium text-foreground flex items-center justify-between">
              {{ t('speech.volume') }}
              <span class="text-xs text-muted-foreground">{{ Math.round(volume * 100) }}%</span>
            </label>
            <SliderRoot
              v-model="volume"
              :min="0"
              :max="1"
              :step="0.1"
              class="relative flex items-center select-none touch-none w-full h-5"
            >
              <SliderTrack class="bg-secondary relative grow rounded-full h-[3px]">
                <SliderRange class="absolute h-full rounded-full bg-primary" />
              </SliderTrack>
              <SliderThumb
                class="block w-5 h-5 bg-primary rounded-full hover:bg-primary/90 focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2"
              />
            </SliderRoot>
          </div> -->

          <!-- <div class="flex justify-center pt-4">
            <button
              class="bg-primary text-primary-foreground hover:bg-primary/80 text-sm inline-flex h-9 items-center justify-center rounded px-4 font-semibold leading-none hover:outline-hidden focus:outline-2 focus:outline-foreground focus:outline-dashed focus:outline-offset-2"
              @click="testVoice"
            >
              {{ t('speech.testVoice') }}
            </button>
          </div> -->
        </div>

        <DialogClose
          class="text-foreground hover:bg-secondary/80 hover:text-foreground absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center focus:outline-hidden focus-visible:ring-1 focus-visible:ring-primary focus-visible:text-primary"
        >
          <X class="size-4" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
