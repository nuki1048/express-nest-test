import React from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { ACTIVITIES_ITEMS } from '@/constants/activitiesItems'
import { ActivitiesCard } from '..'

interface Props {
	className?: string
}

export const ActivitiesSection: React.FC<Props> = ({ className }) => {
	const t = useTranslations('Activities')

	return (
		<section className={cn(
			'w-full bg-gray-dark text-center',
			'pt-20 pb-30 max-2xl:pt-16 max-2xl:pb-24 max-md:pt-12 max-md:pb-16',
			className
		)}>
			<h3 className="text-title border-b border-primary inline-block pb-1">
				{t('title')}
			</h3>
			<div className={cn(
				'grid mx-auto mt-20 px-10 max-md:px-6',
				'grid-cols-4 gap-10',
				'max-xl:grid-cols-2 max-xl:max-w-[1000px] max-xl:gap-x-16',
				'max-md:grid-cols-1 max-md:gap-y-12 max-md:max-w-[500px] max-md:mt-6',
				'max-w-[1600px]'
			)}>
				{ACTIVITIES_ITEMS.map((item) => (
					<ActivitiesCard
						key={item.id}
						photo={item.photo}
						title={t(item.title)}
						subtitle={t(item.subtitle)}
					/>
				))}
			</div>
		</section>
	)
}