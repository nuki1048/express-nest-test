import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import { ArrowLeftCircle } from 'lucide-react'
import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'

export const metadata: Metadata = {
	title: '404',
	...NO_INDEX_PAGE,
}

export default async function NotFoundPage() {
	const locale = await getLocale()
	const t = await getTranslations({ locale, namespace: 'NotFound' })

	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			<p className='text-6xl font-bold text-primary'>404</p>
			<h1 className='text-4xl md:text-6xl font-bold text-center'>
				{t('heading')}
			</h1>
			<p className='mt-10 text-xl md:text-2xl text-center'>
				{t('description')}
			</p>

			<Link
				className='flex flex-row gap-2 mt-6 items-center text-lg'
				href={`/${locale}`}
			>
				<ArrowLeftCircle />
				{t('backHome')}
			</Link>
		</div>
	)
}
