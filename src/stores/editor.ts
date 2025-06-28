import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEditorStore = defineStore('editor_tiptap', () => {
  const editor = ref()
  const editor_toc = ref([])
  return {
    editor,
    editor_toc,
  }
})
