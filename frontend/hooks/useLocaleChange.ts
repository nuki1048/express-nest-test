'use client'

import { useTransition } from 'react'
import { useRouter, usePathname } from '@/i18n/routing'
import { useSearchParams } from 'next/navigation'

export const useLocaleChange = () => {
	const [isPending, startTransition] = useTransition()
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const selectLanguage = (nextLocale: string) => {
		startTransition(() => {
			router.replace(`${pathname}?${searchParams.toString()}`, {
				locale: nextLocale,
			})
		})
	}

	return { selectLanguage, isPending }
}
