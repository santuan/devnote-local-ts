import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import { useDocumentStore } from '@/stores/document'

export const useFocusStore = defineStore('focus', () => {
  const focus_title_textarea = shallowRef<HTMLElement | null>(null)
  const focus_sidebar = shallowRef<HTMLElement | null>(null)
  const focus_documents = shallowRef<HTMLElement | null>(null)
  const focus_toolbar = shallowRef<HTMLElement | null>(null)
  const focus_menu = shallowRef<HTMLElement | null>(null)
  const focus_debug = shallowRef<HTMLElement | null>(null)
  const document = useDocumentStore()

  function SetFocusTitle() {
    document.content_editable = true
    if (focus_title_textarea.value instanceof HTMLElement) {
      focus_title_textarea.value.focus()
    }
  }

  function setFocusMenu() {
    if (focus_menu.value instanceof HTMLElement) {
      focus_menu.value.focus()
    }
  }
  function setFocusDebug() {
    if (focus_debug.value instanceof HTMLElement) {
      focus_debug.value.focus()
    }
  }

  function setFocusSidebar() {
    if (focus_sidebar.value instanceof HTMLElement) {
      focus_sidebar.value.focus()
    }
  }

  function setFocusDocumentsLists() {
    if (focus_documents.value instanceof HTMLElement) {
      focus_documents.value.focus()
    }
  }

  function setFocusToolbar() {
    document.show_editor_toolbar = true
    if (focus_toolbar.value instanceof HTMLElement) {
      focus_toolbar.value.focus()
    }
  }

  return {
    SetFocusTitle,
    setFocusSidebar,
    setFocusDocumentsLists,
    setFocusToolbar,
    setFocusMenu,
    setFocusDebug,
    focus_title_textarea,
    focus_sidebar,
    focus_documents,
    focus_toolbar,
    focus_menu,
    focus_debug,
  }
})
