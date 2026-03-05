import React from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

interface ActivityImage {
	src: string
	className: string
}

interface ActivityItem {
	id: string
	translationKey: string
	reversed: boolean
	images: ActivityImage[]
	paragraphs: string[]
}

interface Props {
	item: ActivityItem
}

export const ActivitiesInfo: React.FC<Props> = ({ item }) => {
	const t = useTranslations(`Activities.${item.translationKey}`)

	return (
		<section id={item.id} className="w-full mb-20 max-md:mb-12">
			<div className='w-full bg-gray-light text-center py-13 mb-20 max-md:mb-10 max-md:py-6'>
				<h2 className="text-title border-b border-primary inline-block pb-1 max-w-[80%] mx-auto">
					{t('title')}
				</h2>
			</div>
			<div className={cn(
				"max-w-[1400px] mx-auto px-10 flex gap-20 items-center",
				item.reversed ? "flex-row-reverse" : "flex-row",
				"max-lg:flex-col max-lg:items-center max-lg:gap-12",
				"max-md:px-6"
			)}>
				<div className={cn(
					"flex-1 w-full grid grid-cols-2 gap-4",
					"h-[650px] max-2xl:h-[550px] max-xl:h-[450px]",
					"max-lg:min-h-[500px] max-lg:max-w-[600px]",
					"max-md:min-h-[400px] max-md:max-w-[450px]",
					"max-[480px]:min-h-[350px] max-[480px]:max-w-full"
				)}>
					{item.images.map((img, idx) => (
						<div
							key={idx}
							className={cn(
								"relative overflow-hidden shadow-md w-full h-full",
								img.className
							)}
						>
							<Image
								src={img.src}
								alt={item.id}
								fill
								priority={idx === 0}
								className="object-cover transition-transform duration-700 hover:scale-105"
								sizes="(max-width: 1024px) 100vw, 50vw"
							/>
						</div>
					))}
				</div>
				<div className="flex-1 flex flex-col pt-4 max-lg:pt-0 max-lg:max-w-[600px] max-lg:text-center">
					<div className="font-didot text-xl font-medium space-y-6 max-2xl:text-lg max-md:text-base max-md:space-y-2">
						{item.paragraphs.map((pKey) => (
							<p key={pKey} className="leading-relaxed">
								{t.rich(`details.${pKey}`, {
									bold: (chunks) => <strong className="font-bold text-primary">{chunks}</strong>
								})}
							</p>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}