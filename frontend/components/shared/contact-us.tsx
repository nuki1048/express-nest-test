import React from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { ContactUsForm } from './contact-us-form'

interface Props {
	className?: string
}

export const ContactUs: React.FC<Props> = ({ className }) => {
	const t = useTranslations('ContactUs')

	return (
		<div className={cn('relative min-h-[850px] flex items-center py-20 overflow-hidden max-xl:min-h-0 max-xl:py-12', className)}>
			<div className="absolute inset-0 -z-10">
				<Image
					src="/generalPage/contact-us.avif"
					alt="Decorative background"
					fill
					className="object-cover object-center"
					priority
				/>
			</div>
			<div className="container mx-auto px-4">
				<div className="flex flex-row items-center justify-between gap-12 max-xl:flex-col max-xl:text-center">
					<div className="w-1/2 flex justify-start max-xl:w-full max-xl:justify-center max-xl:order-2">
						<ContactUsForm />
					</div>
					<div className="w-1/2 flex flex-col items-center text-center max-xl:w-full max-xl:items-center max-xl:text-center max-xl:order-1">
						<p className="text-subtitle">
							{t('subtitle')}
						</p>
						<div className="relative inline-block">
							<h1 className="text-title border-b border-primary inline-block pb-1 mx-auto">
								{t('title')}
							</h1>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}