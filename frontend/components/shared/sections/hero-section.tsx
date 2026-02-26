import React from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface Props {
	className?: string
}

export const HeroSection: React.FC<Props> = ({ className }) => {
	const t = useTranslations('HeroSection')
	return (
		<section className={cn('bg-background relative h-[600px] mx-auto overflow-hidden', className)}>
			<Image
				alt="hero image"
				src="/generalPage/hero-section.webp"
				fill
				priority
				className="object-cover"
			/>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<h1 className="font-engravers text-7xl font-black uppercase tracking-wide text-gray-dark border-b max-xl:text-6xl max-lg:text-5xl max-md:text-4xl">
					{t('title')}
				</h1>
				<p className="font-great-vibes text-6xl leading-[68px] text-gray-dark mt-4 max-xl:text-5xl max-lg:text-4xl max-lg:mt-3 max-md:text-3xl max-md:mt-1">
					{t('subtitle')}
				</p>
			</div>
		</section>
	)
}