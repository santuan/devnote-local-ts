import { computed, ref } from 'vue'

type PanelId = 'leva' | 'speech'

const activePanel = ref<PanelId | null>(null)

export function useFloatingPanels() {
  const isActivePanel = computed(() => (panel: PanelId) => {
    return activePanel.value === panel
  })

  const setActivePanel = (panel: PanelId) => {
    activePanel.value = panel
  }

  const clearActivePanel = () => {
    activePanel.value = null
  }

  return {
    isActivePanel,
    setActivePanel,
    clearActivePanel,
  }
}
