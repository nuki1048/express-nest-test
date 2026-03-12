'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { School, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useContacts } from '@/lib/useContacts'

interface Props {
	className?: string
}

const photos = [
	{ id: 1, url: '/studyingInMalta/1.webp' },
	{ id: 2, url: '/studyingInMalta/2.webp' },
	{ id: 3, url: '/studyingInMalta/3.webp' },
	{ id: 4, url: '/studyingInMalta/4.webp' },
	{ id: 5, url: '/studyingInMalta/5.webp' },
]

export const StudyingEnglishSchools: React.FC<Props> = ({ className }) => {
	const t = useTranslations('Studying.schools')
	const { data } = useContacts()

	const courses = t.raw('courses') as string[]
	const pricingDetails = t.raw('pricing.details') as string[]

	return (
		<section className={cn('py-20 max-md:py-12 bg-white px-4 border-t border-gray-100', className)}>
			<div className="max-w-[1200px] mx-auto">
				<div className="flex flex-col md:flex-row gap-16 max-xl:gap-10 items-center">
					<div className="md:w-1/2">
						<h2 className="font-engravers text-3xl max-xl:text-2xl max-md:text-xl font-black uppercase mb-6 flex items-center gap-3">
							<School className="text-primary shrink-0" size={32} /> {t('title')}
						</h2>
						<p className="mb-8 max-xl:mb-6 leading-relaxed text-base max-xl:text-sm">
							{t('description')}
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 max-xl:gap-x-4">
							{courses.map((course, i) => (
								<div key={i} className="flex items-start gap-2 text-sm max-xl:text-xs">
									<span className="text-primary">•</span>
									{course}
								</div>
							))}
						</div>
						<p className="leading-relaxed mt-8 max-xl:mt-6 text-base max-xl:text-sm italic">
							{t('durationInfo')}
						</p>
					</div>
					<div className="md:w-1/2 w-full bg-[#f9fafb] border border-gray-200 p-10 max-xl:p-8 max-sm:p-6 relative">
						<div className="absolute top-0 left-0 w-1 h-full bg-gray-dark" />
						<h3 className="text-xs max-xl:text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2">
							{t('pricing.label')}
						</h3>
						<div className="flex items-baseline gap-2 mb-6 max-xl:mb-4">
							<span className="text-5xl max-xl:text-4xl font-black text-black">
								{t('pricing.price')}
							</span>
							<span className="text-gray-400 uppercase text-sm max-xl:text-xs tracking-widest">
								{t('pricing.period')}
							</span>
						</div>
						<ul className="space-y-3 max-xl:space-y-2 text-sm max-xl:text-xs text-gray-500 mb-8 max-xl:mb-6">
							{pricingDetails.map((detail, i) => (
								<li key={i} className="flex items-start gap-2">
									<span className="text-primary/50 text-[10px] mt-1">●</span> {detail}
								</li>
							))}
						</ul>
						<Link
							href={data?.links.whatsapp || ''}
							target='_blank'
							className="flex items-center gap-4 text-primary font-bold uppercase text-xs max-xl:text-[10px] tracking-widest transition-colors duration-300 hover:text-secondary"
						>
							<Send size={24} className="shrink-0 max-xl:w-5 max-xl:h-5" />
							<span className="leading-tight">{t('pricing.cta')}</span>
						</Link>
					</div>
				</div>
			</div>
			<div className='w-full max-w-[1300px] py-10 max-xl:py-6 px-4 mx-auto mt-15 max-xl:mt-10'>
				<div className='flex flex-wrap justify-center gap-10 max-xl:gap-6 max-md:gap-4'>
					{photos.map((photo) => (
						<div key={photo.id} className="w-[calc(20%-32px)] max-xl:w-[calc(33%-16px)] max-md:w-[calc(50%-16px)]">
							<div className="relative overflow-hidden rounded-xl bg-muted shadow-sm group aspect-3/4">
								<Image
									src={photo.url}
									alt={`Gallery image ${photo.id}`}
									fill
									className="object-cover transition-transform duration-700 group-hover:scale-110"
									sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
								/>
								<div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}