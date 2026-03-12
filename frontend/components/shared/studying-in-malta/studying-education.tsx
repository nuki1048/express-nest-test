import React from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { GraduationCap } from 'lucide-react'

interface Props {
	className?: string
}

export const StudyingEducation: React.FC<Props> = ({ className }) => {
	const t = useTranslations('Studying.education')

	return (
		<section className={cn('py-20 max-xl:py-16 max-md:py-12 px-4 bg-gray-50', className)}>
			<div className="max-w-[1200px] mx-auto grid grid-cols-2 max-md:grid-cols-1 items-center gap-16 max-xl:gap-10 max-lg:gap-8">
				<div className="flex flex-col">
					<h2 className="font-engravers text-2xl max-xl:text-xl max-md:text-lg font-black uppercase mb-6 max-xl:mb-4 flex items-center gap-3">
						<GraduationCap className="text-primary shrink-0" size={28} />
						{t('higher.title')}
					</h2>
					<p className="leading-[1.8] mb-6 max-xl:mb-4 text-base max-xl:text-sm font-medium">
						{t('higher.subtitle')}
					</p>
					<p className="leading-[1.8] text-base max-xl:text-sm">
						{t('higher.description')}
					</p>
				</div>
				<div className="bg-white border-l-4 border-gray-dark p-8 max-xl:p-6 shadow-sm h-fit">
					<h3 className="font-bold uppercase tracking-widest mb-4 max-xl:mb-3 text-sm max-xl:text-xs">
						{t('residence.title')}
					</h3>
					<p className="leading-relaxed mb-4 max-xl:mb-3 text-base max-xl:text-sm">
						{t.rich('residence.description', {
							bold: (chunks) => <strong className="font-bold">{chunks}</strong>
						})}
					</p>
					<p className="leading-relaxed text-base max-xl:text-sm">
						{t('residence.workInfo')}
					</p>
				</div>
			</div>
		</section>
	)
}