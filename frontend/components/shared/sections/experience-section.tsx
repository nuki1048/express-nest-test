import React from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface Props {
	className?: string
}

export const ExperienceSection: React.FC<Props> = ({ className }) => {
	const t = useTranslations('ExperienceSection')
	return (
		<section className={cn('w-full bg-brown text-center py-13 max-2xl:py-12 max-md:py-6', className)}>
			<h3 className="text-title border-b border-primary inline-block pb-1 max-w-[80%] mx-auto">
				{t('title')}
			</h3>
			<p className="text-subtitle mt-4 max-xl:mt-2">
				{t('subtitle')}
			</p>
		</section>
	)
}