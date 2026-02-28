import React from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { DASHBOARD_PAGES } from '@/config/pages-url.config'

interface Props {
	title: string
	photo: string
	subtitle: string
	className?: string
}

export const ActivitiesCard: React.FC<Props> = ({ title, photo, subtitle, className }) => {
	return (
		<div className={cn(
			'grid grid-rows-[120px_auto_1fr_auto] max-2xl:grid-rows-[100px_auto_1fr_auto] max-lg:grid-rows-[90px_auto_1fr_auto] max-md:grid-rows-[auto_auto_1fr_auto] gap-y-0 h-full w-full',
			'max-w-[380px] mx-auto',
			className
		)}>
			<div className="flex items-center justify-center text-center px-4 max-md:py-6">
				<h3 className='font-engravers text-[20px] max-2xl:text-[18px] max-xl:text-2xl max-lg:text-[18px] max-sm:text-[15px] font-black uppercase tracking-wider leading-tight'>
					{title}
				</h3>
			</div>
			<div className='relative aspect-3/4 w-full shadow-md overflow-hidden'>
				<Image
					src={photo}
					alt={title}
					fill
					sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
					className="object-cover transition-transform duration-500 hover:scale-105"
				/>
			</div>
			<div className="mt-8 max-2xl:mt-6 px-4">
				<p className='font-didot font-bold text-center text-[18px] max-2xl:text-[14px] max-xl:text-xl max-lg:text-[16px] leading-relaxed line-clamp-4'>
					{subtitle}
				</p>
			</div>
			<div className='mt-8 max-2xl:mt-6 mb-4 flex justify-center'>
				<Link
					href={DASHBOARD_PAGES.ACTIVITIES}
					className="bg-gray-light text-primary py-3 px-8 font-engravers text-sm font-black uppercase tracking-[0.2em] shadow-md hover:text-secondary transition-all"
				>
					Read more
				</Link>
			</div>
		</div>
	)
}