import React from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface Props {
	className?: string
}

export const IntroSection: React.FC<Props> = ({ className }) => {
	const t = useTranslations('IntroSection')

	return (
		<section className={cn(
			'w-full bg-gray-dark py-20 max-2xl:py-16 max-xl:py-12 max-lg:py-10 max-md:py-8',
			className
		)}>
			<div className={cn(
				'max-w-[1400px] mx-auto px-10 max-md:px-6',
				'flex flex-row justify-center items-center gap-10',
				'max-x:gap-8 max-lg:gap-6 max-md:flex-col'
			)}>
				<div className="flex-1 flex flex-col justify-center items-center text-center">
					<div>
						<h2 className="text-title border-b border-black inline-block pb-1">
							{t('title')}
						</h2>
						<p className="text-subtitle mt-4 max-xl:mt-2">
							{t('subtitle')}
						</p>
					</div>
					<div className={cn(
						'mt-10 max-xl:mt-8 max-lg:mt-6 max-md:mt-4',
						'text-text flex flex-col gap-4 max-md:gap-2',
						'max-w-[500px] max-2xl:max-w-[450px] max-xl:max-w-[400px] max-lg:max-w-[350px]'
					)}>
						<p className="font-bold text-center">
							{t('description.highlight')}
						</p>
						<p className="text-center">
							{t('description.mainText')}
						</p>
						<p className="text-center italic">
							{t('description.footer')}
						</p>
					</div>
				</div>
				<div className="flex-1 w-full flex justify-center">
					<div className={cn(
						'relative aspect-3/4 w-full shadow-sm',
						'max-w-[500px] max-2xl:max-w-[450px] max-xl:max-w-[400px] max-lg:max-w-[350px] max-md:max-w-[300px]'
					)}>
						<Image
							src="/generalPage/intro-section.webp"
							alt="Holiday rental interior"
							fill
							priority
							className="object-cover"
						/>
					</div>
				</div>
			</div>
		</section>
	)
}