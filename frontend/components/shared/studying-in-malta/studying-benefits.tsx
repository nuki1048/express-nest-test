import React from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Globe, LucideIcon, Shield, Sun, Wallet } from 'lucide-react'

interface Props {
	className?: string
}

const BENEFIT_ICONS: LucideIcon[] = [
	Globe,
	Shield,
	Shield,
	Wallet,
	Globe,
	Sun,
]

export const StudyingBenefits: React.FC<Props> = ({ className }) => {
	const t = useTranslations('Studying.benefits')

	const items = t.raw('items') as string[]

	return (
		<section className={cn('py-20 max-w-[1200px] mx-auto px-4 max-md:py-10', className)}>
			<p className='text-subtitle text-center mb-10'>{t('title')}</p>
			<div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-10 max-xl:gap-6 max-md:gap-4">
				{items.map((text, i) => {
					const IconComponent = BENEFIT_ICONS[i] || Globe
					return (<div key={i} className="flex items-center gap-4 p-6 border border-gray-100 transition-all duration-300 cursor-pointer hover:border-primary group">
						<div className="text-primary transition-transform duration-300 group-hover:scale-110">
							<IconComponent size={24} />
						</div>
						<p className="text-gray-800 font-medium leading-snug">{text}</p>
					</div>
					)
				})}
			</div>
		</section>
	)
}