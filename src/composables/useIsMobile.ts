import { onMounted, onUnmounted, ref } from 'vue'

export function useIsMobile() {
  const isMobile = ref(false)

  const updateIsMobile = () => {
    isMobile.value = window.matchMedia('(any-hover: none)').matches
  }

  onMounted(() => {
    updateIsMobile() // Set initial state
    window.matchMedia('(any-hover: none)').addEventListener('change', updateIsMobile)
  })

  onUnmounted(() => {
    window.matchMedia('(any-hover: none)').removeEventListener('change', updateIsMobile)
  })

  return { isMobile }
}
