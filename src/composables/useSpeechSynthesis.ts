import { useStorage } from '@vueuse/core'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useSpeechSynthesis() {
  const { locale } = useI18n()
  const isSupported = ref(false)
  const isPlaying = ref(false)
  const isPaused = ref(false)
  const voices = ref<SpeechSynthesisVoice[]>([])

  // Persistent settings
  // Ensure default values are numbers
  const selectedVoiceURI = useStorage('speech-voice-uri', '')
  const rate = useStorage('speech-rate', 1)
  const pitch = useStorage('speech-pitch', 1)
  const volume = useStorage('speech-volume', 1)

  const selectedVoice = ref<SpeechSynthesisVoice | null>(null)

  let utterance: SpeechSynthesisUtterance | null = null

  const status = computed(() => {
    if (isPlaying.value && !isPaused.value)
      return 'playing'
    if (isPlaying.value && isPaused.value)
      return 'paused'
    return 'stopped'
  })

  const loadVoices = () => {
    voices.value = speechSynthesis.getVoices()

    // Try to restore previously selected voice
    if (selectedVoiceURI.value) {
      const savedVoice = voices.value.find(
        voice => voice.voiceURI === selectedVoiceURI.value,
      )
      if (savedVoice) {
        selectedVoice.value = savedVoice
        return
      }
    }

    // Try to find a voice that matches the current locale
    const currentLocale = locale.value

    const matchingVoice = voices.value.find(
      voice =>
        voice.lang.startsWith(currentLocale)
        || voice.lang.startsWith(currentLocale.split('-')[0]),
    )

    if (matchingVoice) {
      selectedVoice.value = matchingVoice
      selectedVoiceURI.value = matchingVoice.voiceURI
    }
    else if (voices.value.length > 0) {
      selectedVoice.value = voices.value[0]
      selectedVoiceURI.value = voices.value[0].voiceURI
    }
  }

  const setVoice = (voice: SpeechSynthesisVoice) => {
    selectedVoice.value = voice
    selectedVoiceURI.value = voice.voiceURI
  }

  const speak = (text: string) => {
    if (!isSupported.value || !text.trim())
      return

    // Stop any current speech
    stop()

    // Clean the text (remove HTML tags and extra whitespace)
    const cleanText = text
      .replace(/<[^>]*>/g, ' ') // Remove HTML tags
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim()

    if (!cleanText)
      return
    console.log(cleanText)

    utterance = new SpeechSynthesisUtterance(cleanText)

    if (selectedVoice.value) {
      utterance.voice = selectedVoice.value
    }

    // --- IMPORTANT FIX HERE ---
    // Ensure rate, pitch, and volume are finite numbers.
    // Use Number() to convert, and isFinite() to check.
    // Provide a fallback default if they are not valid numbers.
    utterance.rate = Number.isFinite(rate.value) ? rate.value : 1
    utterance.pitch = Number.isFinite(pitch.value) ? pitch.value : 1
    utterance.volume = Number.isFinite(volume.value) ? volume.value : 1
    // --- END IMPORTANT FIX ---

    utterance.onstart = () => {
      isPlaying.value = true
      isPaused.value = false
    }

    utterance.onend = () => {
      isPlaying.value = false
      isPaused.value = false
    }

    utterance.onerror = (event) => {
      console.error('SpeechSynthesisUtterance error:', event) // Log the error for debugging
      isPlaying.value = false
      isPaused.value = false
    }

    speechSynthesis.speak(utterance)
  }

  const pause = () => {
    if (isSupported.value && isPlaying.value && !isPaused.value) {
      speechSynthesis.pause()
      isPaused.value = true
    }
  }

  const resume = () => {
    if (isSupported.value && isPlaying.value && isPaused.value) {
      speechSynthesis.resume()
      isPaused.value = false
    }
  }

  const stop = () => {
    if (isSupported.value) {
      speechSynthesis.cancel()
      isPlaying.value = false
      isPaused.value = false
    }
  }

  const toggle = (text: string) => {
    if (status.value === 'playing') {
      pause()
    }
    else if (status.value === 'paused') {
      resume()
    }
    else {
      speak(text)
    }
  }

  onMounted(() => {
    isSupported.value = 'speechSynthesis' in window

    if (isSupported.value) {
      // Load voices immediately if available
      loadVoices()

      // Load voices when they become available (some browsers load them asynchronously)
      speechSynthesis.onvoiceschanged = loadVoices
    }
  })

  onUnmounted(() => {
    stop()
  })

  return {
    isSupported,
    isPlaying,
    isPaused,
    status,
    voices,
    selectedVoice,
    rate,
    pitch,
    volume,
    speak,
    pause,
    resume,
    stop,
    toggle,
    setVoice,
  }
}
