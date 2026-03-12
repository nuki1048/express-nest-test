import React from 'react'
import { cn } from '@/lib/utils'
import { getTranslations } from 'next-intl/server'

interface Props {
	className?: string
}

export const StudyingHeroSection: React.FC<Props> = async ({ className }) => {
	const t = await getTranslations('Studying')
	return (
		<section className={cn("relative py-24 px-4 bg-gray-light max-md:py-15", className)}>
			<div className="max-w-[1200px] mx-auto text-center">
				<h1 className="text-title border-b border-primary inline-block pb-1">
					{t('hero.title')}
				</h1>
				<p className="text-subtitle mt-4 max-xl:mt-2">
					{t('hero.subtitle')}
				</p>
			</div>
		</section>
	)
}