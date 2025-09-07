/* eslint-disable no-console */
import { useState, useEffect } from 'react'
import axios from 'axios'

const useTranslate = (text, targetLang = 'vi') => {
  const [translatedText, setTranslatedText] = useState(text)

  useEffect(() => {
    if (!text || targetLang === 'en') return

    const cacheKey = `${text}_${targetLang}`
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      setTranslatedText(cached)
      return
    }

    const translate = async () => {
      try {
        const response = await axios.get(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
        )
        const translated = response.data.responseData.translatedText
        setTranslatedText(translated)
        localStorage.setItem(cacheKey, translated)
      } catch (error) {
        console.error('Translation error:', error)
        setTranslatedText(text)
      }
    }

    translate()
  }, [text, targetLang])

  return translatedText
}

export default useTranslate