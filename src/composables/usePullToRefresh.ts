import { useModalStore } from '@/stores/modal'
import { onMounted, onUnmounted, ref } from 'vue'
import { toast } from 'vue-sonner'

export function usePullToRefresh(elementRef: any) {
  const modal = useModalStore()

  const startY = ref(0)
  const distance = ref(0)
  const threshold = 150
  const isRefreshing = ref(false)
  const isPulling = ref(false)

  function isEditorElement(target: any) {
    return target.closest('.is-editable') !== null
  }

  function isTouchInTopArea(clientY: number) {
    return clientY <= 150
  }

  function handleTouchStart(e: any) {
    // Check if touch is in editor or outside top area
    if (isEditorElement(e.target) || !isTouchInTopArea(e.touches[0].clientY)) {
      return
    }

    // Only enable pull to refresh at the top of the page
    if (window.scrollY !== 0)
      return

    startY.value = e.touches[0].clientY
    isPulling.value = true
  }

  function handleTouchMove(e: any) {
    if (!isPulling.value)
      return

    const currentY = e.touches[0].clientY
    distance.value = currentY - startY.value

    // Only allow pulling down
    if (distance.value < 0) {
      distance.value = 0
      return
    }

    // Add resistance to the pull
    distance.value = distance.value ** 1.2

    // Prevent default scrolling when pulling
    if (distance.value > 0) {
      e.preventDefault()
    }
  }

  async function handleTouchEnd() {
    if (!isPulling.value)
      return

    if (distance.value >= threshold && !isRefreshing.value) {
      isRefreshing.value = true

      // Perform refresh action
      try {
        modal.show_commandbar = true
      }
      catch {
        toast.error('Can\'t open command bar')
      }

      isRefreshing.value = false
    }

    // Reset values
    distance.value = 0
    isPulling.value = false
  }

  onMounted(() => {
    const element = elementRef.value
    if (!element)
      return

    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd)
  })

  onUnmounted(() => {
    const element = elementRef.value
    if (!element)
      return

    element.removeEventListener('touchstart', handleTouchStart)
    element.removeEventListener('touchmove', handleTouchMove)
    element.removeEventListener('touchend', handleTouchEnd)
  })

  return {
    distance,
    isRefreshing,
    isPulling,
  }
}
