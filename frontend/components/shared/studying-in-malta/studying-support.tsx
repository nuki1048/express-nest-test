import React from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface Props {
	className?: string
}

export const StudyingSupport: React.FC<Props> = ({ className }) => {
	const t = useTranslations('Studying.support')

	return (
		<section className={cn('py-24 bg-brown text-primary px-4 text-center max-xl:py-20 max-md:py-10', className)}>
			<div className="max-w-3xl mx-auto">
				<p className="text-text">
					{t('description')}
				</p>
			</div>
		</section>
	)
}