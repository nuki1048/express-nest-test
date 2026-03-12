import React from 'react'
import { cn } from '@/lib/utils'

interface Props {
	title: string
	description: string
	className?: string
}

export const ResidenceHeroSection: React.FC<Props> = ({ title, description, className }) => {
	return (
		<section className={cn("relative py-24 px-4 bg-gray-light max-md:py-15", className)}>
			<div className="max-w-[1200px] mx-auto text-center">
				<h1 className="text-title border-b border-primary inline-block pb-1">
					{title}
				</h1>
				<p className="text-subtitle mt-10">
					{description}
				</p>
			</div>
		</section>
	)
}