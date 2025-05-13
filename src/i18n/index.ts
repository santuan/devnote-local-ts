import { useStorage } from '@vueuse/core'
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import es from './locales/es.json'

const locale = useStorage('locale', 'es')

export const i18n = createI18n({
  legacy: false,
  locale: locale.value,
  fallbackLocale: 'en',

  messages: {
    es,
    en,
  },
})
