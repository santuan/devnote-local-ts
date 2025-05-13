import { defineStore } from 'pinia'
import { shallowRef } from 'vue'

export const useModalStore = defineStore('modal', () => {
  const show_info = shallowRef(false)
  const show_export_db = shallowRef(false)
  const show_import_db = shallowRef(false)
  const show_alert_unsaved_changes = shallowRef(false)
  const show_settings = shallowRef(false)
  const show_commandbar = shallowRef(false)
  const show_delete_db_modal = shallowRef(false)
  const show_delete_document_modal = shallowRef(false)
  const show_video_url_dialog = shallowRef(false)
  const show_image_url_dialog = shallowRef(false)
  const show_youtube_url_dialog = shallowRef(false)
  const show_link_url_dialog = shallowRef(false)
  const show_iframe_url_dialog = shallowRef(false)
  const editing_iframe_pos = shallowRef<null | number>(null)
  return {
    show_info,
    show_export_db,
    show_import_db,
    show_alert_unsaved_changes,
    show_settings,
    show_commandbar,
    show_delete_db_modal,
    show_delete_document_modal,
    show_video_url_dialog,
    show_image_url_dialog,
    show_youtube_url_dialog,
    show_link_url_dialog,
    show_iframe_url_dialog,
    editing_iframe_pos,
  }
})
