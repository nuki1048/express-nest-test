import React from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface Props {
	className?: string
}

export const HeroSection: React.FC<Props> = ({ className }) => {
	const t = useTranslations('HeroSection')

	return (
		<section
			className={cn(
				'relative h-[700px] max-[1600px]:h-[600px] overflow-hidden bg-black',
				'w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]',
				className
			)}
		>
			<div className="absolute inset-0 w-full h-full">
				<video
					autoPlay
					loop
					muted
					playsInline
					className="h-full w-full object-cover"
				>
					<source src="/generalPage/hero-section.mp4" type="video/mp4" />
				</video>
			</div>
			<div className="absolute inset-0 bg-black/20 z-1" />
			<div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-4">
				<h1 className="font-engravers text-7xl font-black uppercase tracking-wide text-gray-dark border-b-2 border-gray-dark/20 max-xl:text-6xl max-lg:text-5xl max-md:text-4xl">
					{t('title')}
				</h1>
				<p className="font-great-vibes text-6xl leading-[68px] text-gray-dark mt-4 max-xl:text-5xl max-lg:text-4xl max-lg:mt-3 max-md:text-3xl max-md:mt-1">
					{t('subtitle')}
				</p>
			</div>
		</section>
	)
}