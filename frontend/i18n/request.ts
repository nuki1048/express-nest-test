import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

// Создаем тип на основе списка локалей из routing
type Locale = (typeof routing.locales)[number]

export default getRequestConfig(async ({ requestLocale }) => {
	let locale = await requestLocale

	// Проверяем, входит ли полученная локаль в наш список, используя приведение к типу Locale
	if (!locale || !routing.locales.includes(locale as Locale)) {
		locale = routing.defaultLocale
	}

	return {
		locale,
		messages: (await import(`../messages/${locale}.json`)).default,
	}
})
