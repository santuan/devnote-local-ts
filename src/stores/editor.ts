import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEditorStore = defineStore('editor_tiptap', () => {
  const editor = ref()
  return {
    editor,
  }
})
