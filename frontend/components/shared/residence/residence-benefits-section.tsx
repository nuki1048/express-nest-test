import React from 'react'
import { cn } from '@/lib/utils'

interface Props {
	title: string
	benefits: string[]
	className?: string
}

export const ResidenceBenefitsSection: React.FC<Props> = ({ title, benefits, className }) => {
	return (
		<section className={cn('bg-gray-dark py-24 px-6 max-md:py-16 max-md:px-4', className)}>
			<div className="max-w-7xl mx-auto">
				<h2 className="text-subtitle text-primary tracking-widest text-center mb-16 max-md:mb-10 max-md:text-2xl">
					{title}
				</h2>
				<div className="grid grid-cols-3 gap-8 max-xl:grid-cols-2 max-md:grid-cols-1 max-md:gap-4">
					{benefits.map((benefit, index) => (
						<div
							key={index}
							className={cn(
								"flex items-center gap-4 p-6 bg-white shadow-sm border border-gray-100 transition-colors duration-500 hover:border-secondary group",
								"max-md:p-4"
							)}>
							<div className="w-2 h-2 rounded-full bg-secondary shrink-0" />
							<p className="text-gray-700 font-medium uppercase text-[13px] tracking-wide leading-snug max-md:text-[12px]">
								{benefit}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}