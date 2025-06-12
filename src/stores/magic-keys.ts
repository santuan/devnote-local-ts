import { useMagicKeys, whenever } from '@vueuse/core'
import { defineStore, storeToRefs } from 'pinia'
// import { useFontSize } from '@/composables/useFontSize'
import { useDatabaseStore } from '@/stores/database'
import { useDocumentStore } from '@/stores/document'
import { useEditorStore } from '@/stores/editor'
import { useFocusStore } from '@/stores/focus'
import { useModalStore } from '@/stores/modal'
import { useSettingsStore } from '@/stores/settings'

export const useMagicKeysStore = defineStore('magic-keys', () => {
  const keys = useMagicKeys()
  const document = useDocumentStore()
  const settings = useSettingsStore()
  const modal = useModalStore()
  const focus = useFocusStore()
  const database = useDatabaseStore()
  const editor_store = useEditorStore()
  const { editor } = storeToRefs(editor_store)

  const magic_command_menu = keys['ctrl+alt+o']
  const magic_ctrl_m = keys['ctrl+m']
  const magic_delete_document = keys['shift+delete']
  const magic_editor_toolbar = keys['ctrl+shift+alt+t']
  const magic_focus_toolbar = keys['ctrl+shift+alt+g']
  const magic_focus_editor = keys['ctrl+shift+alt+u']
  const magic_focus_sidebar = keys['ctrl+shift+alt+ArrowLeft']
  const magic_focus_title = keys['ctrl+shift+alt+ArrowRight']
  const magic_next_document = keys['ctrl+shift+ArrowDown']
  const magic_previous_document = keys['ctrl+shift+ArrowUp']
  const magic_show_settings = keys['ctrl+shift+alt+s']
  const magic_toggle_preview = keys['ctrl+alt+p']
  const magic_task_list = keys['ctrl+shift+alt+l']
  const magic_export_db = keys['ctrl+alt+shift+e']
  const magic_import_db = keys['ctrl+alt+shift+i']
  const magic_show_fixed = keys['ctrl+alt+shift+f']
  const magic_show_completed = keys['ctrl+alt+shift+y']
  const magic_show_leva = keys['ctrl+alt+shift+d']

  whenever(magic_show_leva, () => {
    settings.leva = !settings.leva
  })

  whenever(magic_task_list, () => {
    editor.value.chain().focus().toggleTaskList().run()
  })

  whenever(magic_show_fixed, () => {
    settings.toggle_show_favorites()
  })

  whenever(magic_show_completed, () => {
    settings.toggle_show_completed()
  })

  whenever(magic_focus_sidebar, (n) => {
    if (n) {
      if (document.show_sidebar_documents === true) {
        focus.setFocusSidebar()
      }
      else {
        focus.setFocusMenu()
      }
    }
  })

  whenever(magic_focus_title, (n) => {
    if (n)
      focus.SetFocusTitle()
  })

  whenever(magic_focus_editor, (n) => {
    if (n)
      editor.value.commands.focus()
  })

  whenever(magic_focus_toolbar, (n) => {
    if (n)
      focus.setFocusToolbar()
  })

  whenever(magic_editor_toolbar, (n) => {
    if (n)
      document.show_editor_toolbar = !document.show_editor_toolbar
  })

  whenever(magic_ctrl_m, (n) => {
    if (n)
      document.show_sidebar_documents = !document.show_sidebar_documents
  })

  whenever(magic_toggle_preview, (n) => {
    if (n)
      document.toggle_editable()
  })

  whenever(magic_show_settings, (n) => {
    if (n)
      modal.show_settings = !modal.show_settings
  })

  whenever(magic_delete_document, (n) => {
    if (n) {
      if (database.loaded_id) {
        modal.show_delete_document_modal = true
      }
    }
  })

  whenever(magic_previous_document, () => {
    database.navigate_document('prev')
  })

  whenever(magic_next_document, () => {
    database.navigate_document('next')
  })

  whenever(magic_command_menu, (n) => {
    if (n)
      modal.show_commandbar = true
  })

  whenever(magic_export_db, (n) => {
    if (n)
      modal.show_export_db = !modal.show_export_db
  })

  whenever(magic_import_db, (n) => {
    if (n)
      modal.show_import_db = !modal.show_import_db
  })
})
