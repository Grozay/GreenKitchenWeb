import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'
import en from '~/i18n/locales/en.js'
import vi from '~/i18n/locales/vi.js'

const resources = {
  en: { translation: en },
  vi: { translation: vi }
}

const savedLanguage = localStorage.getItem('currentLanguage') || 'vi' // Lấy từ key Redux

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage, // Lấy từ localStorage
    supportedLngs: ['en', 'vi'],
    interpolation: { escapeValue: false },
    fallbackLng: 'vi',
    backend: {
      loadPath: 'https://api.mymemory.translated.net/get?q={{key}}&langpair=en|{{lng}}',
      parse: (data) => {
        const response = JSON.parse(data)
        return response.responseData.translatedText || '{{key}}'
      },
      requestOptions: { cache: 'default' }
    }
  })

export default i18n