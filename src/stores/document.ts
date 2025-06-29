import { defineStore, storeToRefs } from 'pinia'
import { shallowRef } from 'vue'
import { useDatabaseStore } from '@/stores/database'
import { useEditorStore } from '@/stores/editor'

export const useDocumentStore = defineStore('document', () => {
  const database = useDatabaseStore()
  const editor_store = useEditorStore()
  const { editor } = storeToRefs(editor_store)

  const show_sidebar_documents = shallowRef(true)
  const show_editor_toolbar = shallowRef(true)
  const content_editable = shallowRef(true)
  const sidebar_splitter_ref = shallowRef()
  const resize = shallowRef(0)

  function toggle_editable() {
    editor.value?.setEditable(!editor.value?.options?.editable)
    content_editable.value = editor.value?.options?.editable
  }

  function clear_editor() {
    database.loaded_id = ''
    database.document_name = ''
    database.document_body = ''
  }

  return {
    content_editable,
    show_editor_toolbar,
    show_sidebar_documents,
    toggle_editable,
    clear_editor,
    sidebar_splitter_ref,
    resize,
  }
})
