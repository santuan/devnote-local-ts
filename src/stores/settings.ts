import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => {
    return {
      save_on_load: false,
      show_heading_one_preview: false,
      media_base64: false,
      show_favorites: false,
      show_completed: false,
      desktop_show_icons_sidebar_collapse: true,
      product_tour_seen: false,
      leva: false,
    }
  },
  persist: true,
  actions: {
    toggle_save_on_load() {
      this.save_on_load = !this.save_on_load
    },
    toggle_heading_one_preview() {
      this.show_heading_one_preview = !this.show_heading_one_preview
    },
    toggle_media_base64() {
      this.media_base64 = !this.media_base64
    },
    toggle_show_favorites() {
      if (this.show_completed === true) {
        this.show_favorites = true
        this.show_completed = false
      }
      else {
        this.show_favorites = !this.show_favorites
      }
    },
    toggle_show_completed() {
      if (this.show_favorites === true) {
        this.show_favorites = false
      }
      this.show_completed = !this.show_completed
    },
    toggle_product_tour_seen(value: boolean) {
      this.product_tour_seen = value
    },
    toggle_desktop_show_icons_sidebar_collapse() {
      this.desktop_show_icons_sidebar_collapse = !this.desktop_show_icons_sidebar_collapse
    },
  },
})
