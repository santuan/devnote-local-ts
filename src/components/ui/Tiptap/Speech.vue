<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { Check, ChevronDown, Volume, X } from 'lucide-vue-next'
import {
  ComboboxAnchor,
  ComboboxCancel,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxViewport,
} from 'reka-ui'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import SiriWave from '@/components/ui/Audio/SiriWave.vue'
import Tooltip from '@/components/ui/Tooltip.vue'
import { useSettingsStore } from '@/stores/settings'

const props = withDefaults(defineProps<Props>(), {
  editor: null,
  pitch: 1,
  rate: 1,
  volume: 1,
})

const emit = defineEmits<{
  error: [message: string]
  speaking: [text: string]
  end: []
}>()

const { t } = useI18n()
const settings = useSettingsStore()

interface Props {
  editor?: Editor | null
  pitch?: number
  rate?: number
  volume?: number
}

const isSpeaking = ref(false)
const availableVoices = ref<SpeechSynthesisVoice[]>([])
const selectedVoice = ref<SpeechSynthesisVoice | null>(null)
const selectedVoiceName = ref(settings.speech_voice_name || '')
const selectedLang = ref(settings.speech_voice_lang || 'en-US')

let synth: SpeechSynthesis | null = null
let utterance: SpeechSynthesisUtterance | null = null

const isSpeechSynthesisSupported
  = typeof window !== 'undefined' && 'speechSynthesis' in window

const languageGroups = computed(() => {
  const groups = new Map<string, SpeechSynthesisVoice[]>()

  availableVoices.value.forEach((voice) => {
    if (!groups.has(voice.lang)) {
      groups.set(voice.lang, [])
    }
    groups.get(voice.lang)?.push(voice)
  })

  return Array.from(groups.entries(), ([lang, voices]) => ({
    lang,
    voices,
    name: getLanguageName(lang),
  }))
    .sort((a, b) => a.name.localeCompare(b.name))
})

function getLanguageName(langCode: string): string {
  try {
    const displayNames = new Intl.DisplayNames(['es'], { type: 'language' })
    return displayNames.of(langCode.split('-')[0]) || langCode
  }
  catch {
    return langCode
  }
}

function loadVoices() {
  if (!synth)
    return

  availableVoices.value = synth.getVoices()

  if (availableVoices.value.length > 0 && !selectedVoice.value) {
    // Try to restore from store first
    if (settings.speech_voice_name) {
      const savedVoice = availableVoices.value.find(
        v => v.name === settings.speech_voice_name,
      )
      if (savedVoice) {
        selectedVoice.value = savedVoice
        selectedVoiceName.value = savedVoice.name
        selectedLang.value = savedVoice.lang
        return
      }
    }

    // Select default voice for browser's language or first available
    const browserLang = navigator.language
    const defaultVoice
      = availableVoices.value.find(v => v.lang === browserLang)
        || availableVoices.value.find(v =>
          v.lang.startsWith(browserLang.split('-')[0]),
        )
        || availableVoices.value[0]

    if (defaultVoice) {
      selectedVoice.value = defaultVoice
      selectedVoiceName.value = defaultVoice.name
      selectedLang.value = defaultVoice.lang
    }
  }
}

onMounted(() => {
  if (isSpeechSynthesisSupported) {
    synth = window.speechSynthesis

    // Load voices (some browsers load them asynchronously)
    loadVoices()

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices
    }
  }
})

onUnmounted(() => {
  if (synth && synth.speaking) {
    synth.cancel()
  }
})

function speak(text: string) {
  if (!synth) {
    emit('error', 'Speech synthesis not supported')
    return
  }

  if (synth.speaking) {
    synth.cancel()
  }

  utterance = new SpeechSynthesisUtterance(text)

  if (selectedVoice.value) {
    utterance.voice = selectedVoice.value
  }

  utterance.pitch = props.pitch
  utterance.rate = props.rate
  utterance.volume = props.volume

  utterance.onstart = () => {
    isSpeaking.value = true
    emit('speaking', text)
  }

  utterance.onend = () => {
    isSpeaking.value = false
    emit('end')
  }

  utterance.onerror = (event) => {
    isSpeaking.value = false
    emit('error', event.error)
  }

  synth.speak(utterance)
}

function stopSpeaking() {
  if (synth) {
    synth.cancel()
  }
  isSpeaking.value = false
}

function speakEditorContent() {
  if (props.editor) {
    const text = props.editor.getText()
    if (text.trim()) {
      speak(text)
    }
  }
}

function setVoice(voice: SpeechSynthesisVoice) {
  selectedVoice.value = voice
  selectedVoiceName.value = voice.name
  selectedLang.value = voice.lang

  // Save to store
  settings.speech_voice_name = voice.name
  settings.speech_voice_lang = voice.lang
}

function onVoiceSelect(voiceName: string) {
  const voice = availableVoices.value.find(v => v.name === voiceName)
  if (voice) {
    setVoice(voice)
  }
}

// Watch for changes and save to store
watch(selectedVoiceName, (newValue) => {
  if (newValue) {
    settings.speech_voice_name = newValue
  }
})

watch(selectedLang, (newValue) => {
  if (newValue) {
    settings.speech_voice_lang = newValue
  }
})

defineExpose({
  speak,
  stopSpeaking,
  speakEditorContent,
  isSpeaking,
})
</script>

<template>
  <div v-if="editor" class="speech-component">
    <Transition mode="out-in">
      <div
        v-if="editor?.getText().trim()"
        class="mt-3 py-3 h-20 rounded flex justify-center items-center"
      >
        <SiriWave :active="isSpeaking" />
      </div>
      <div v-else class="h-20 flex justify-center items-center text-primary/20 mt-3 text-center">
        No hay texto para leer.
      </div>
    </Transition>
    <div class="mb-3 px-3">
      <h3 class="text-xs font-semibold text-primary mb-2">
        {{ t("toolbar.selectVoice") }}
      </h3>
      <div class="flex mb-3">
        <ComboboxRoot
          v-model="selectedVoiceName"
          class="relative w-80"
          @update:model-value="onVoiceSelect"
        >
          <ComboboxAnchor class="flex items-center gap-2">
            <ComboboxTrigger
              class="langSelector px-3"
              :disabled="isSpeaking || availableVoices.length === 0"
              tabindex="0"
            >
              <Tooltip
                :name="
                  selectedVoice
                    ? selectedVoice.name
                    : t('toolbar.selectVoiceTooltip')
                "
                :side="'top'"
                :align="'center'"
              >
                <span class="truncate max-w-[245px] text-left">
                  {{ selectedVoice ? selectedVoice.name : selectedLang }}
                </span>
                <span class="sr-only">Select speech language and voice</span>
              </Tooltip>
              <ChevronDown class="size-4 shrink-0" />
            </ComboboxTrigger>
          </ComboboxAnchor>
          <ComboboxPortal>
            <ComboboxContent
              :align="'start'"
              :side="'bottom'"
              :side-offset="0"
              position="popper"
              class="z-10 w-full mt-0 text-foreground font-mono min-w-[360px] bg-background overflow-hidden text-xs shadow-sm border border-secondary"
            >
              <div class="flex justify-center items-center border-b border-secondary pr-1">
                <ComboboxInput
                  class="p-2 py-3 bg-background w-full outline-none"
                  :placeholder="t('toolbar.searchVoices')"
                />
                <ComboboxCancel class="size-8 flex justify-center shrink-0 items-center rounded-full">
                  <X class="size-4" />
                </ComboboxCancel>
              </div>
              <ComboboxViewport class="max-h-72 overflow-y-auto">
                <ComboboxEmpty class="text-center p-3 bg-secondary">
                  {{ t("toolbar.noVoicesFound") }}
                </ComboboxEmpty>
                <ComboboxGroup
                  v-for="group in languageGroups"
                  :key="group.lang"
                >
                  <ComboboxLabel
                    class="px-2 py-3 font-semibold text-foreground/70 uppercase"
                  >
                    {{ group.name }} ({{ group.lang }})
                  </ComboboxLabel>
                  <ComboboxItem
                    v-for="voice in group.voices"
                    :key="voice.name"
                    :value="voice.name"
                    class="p-2 pl-2 relative hover:bg-secondary-foreground/10 outline-hidden focus:ring-1 focus:ring-primary focus:bg-primary/20 focus:ring-inset cursor-pointer"
                    :class="{
                      'bg-primary/20': selectedVoice?.name === voice.name,
                    }"
                  >
                    <div class="flex flex-col">
                      <span class="font-medium">{{ voice.name }}</span>
                      <span
                        v-if="voice.localService"
                        class="text-[10px] text-foreground/50"
                      >
                        {{ t("toolbar.local") }}
                      </span>
                    </div>
                    <ComboboxItemIndicator class="absolute right-0 top-0 m-2">
                      <Check class="size-4" />
                    </ComboboxItemIndicator>
                  </ComboboxItem>
                  <ComboboxSeparator
                    class="border-y border-secondary-foreground/10"
                  />
                </ComboboxGroup>
              </ComboboxViewport>
            </ComboboxContent>
          </ComboboxPortal>
        </ComboboxRoot>
      </div>
      <button
        v-if="!isSpeaking"
        :disabled="isSpeaking || !isSpeechSynthesisSupported || !selectedVoice"
        class="btn w-full px-3 py-2 flex items-center justify-center btn-secondary gap-2"
        :class="
          !editor?.getText().trim() ? ' opacity-50! pointer-events-none' : ''
        "
        @click="speakEditorContent"
      >
        <Volume class="size-4" />
        {{ t("toolbar.speakDocument") }}
      </button>

      <button
        v-if="isSpeaking"
        class="btn btn-primary w-full px-3 py-2"
        @click="stopSpeaking"
      >
        ⏹ {{ t("toolbar.stopSpeaking") }}
      </button>

      <span v-if="isSpeaking" class="sr-only">{{
        t("toolbar.stopSpeaking")
      }}</span>

      <div v-if="!isSpeechSynthesisSupported" class="warning">
        <p>⚠️ Speech synthesis not supported in this browser</p>
      </div>
      <div v-else-if="availableVoices.length === 0" class="warning">
        <p>⏳ Loading voices...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/main.css";

.langSelector {
  @apply flex items-center text-xs truncate justify-between bg-background px-2 w-full;
  @apply w-full hover:z-10 min-h-[2.1rem] border border-secondary hover:border-primary focus-within:border-primary focus-visible:border-red-600;
}

.btn {
  @apply border border-secondary hover:border-primary focus-within:border-primary outline-hidden h-[2.1rem] text-sm flex justify-center items-center;
}

.btn-primary {
  @apply bg-primary text-primary-foreground hover:bg-primary/90;
}

.btn-secondary {
  @apply bg-secondary text-foreground hover:bg-secondary/80;
}
</style>
