import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => {
    return {
      save_on_load: false,
      show_heading_one_preview: false,
      media_base64: false,
      show_favorites: false,
      show_completed: false,
      product_tour_seen: false,
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
      this.show_favorites = !this.show_favorites
    },
    toggle_show_completed() {
      this.show_completed = !this.show_completed
    },
    toggle_product_tour_seen(value: boolean) {
      this.product_tour_seen = value
    },
  },
})
