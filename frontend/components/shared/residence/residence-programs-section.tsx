import React from 'react'
import { cn } from '@/lib/utils'
import { RESIDENCE_SUB_ITEMS } from '@/constants/navItems'
import Link from 'next/link'

interface Props {
	title: string
	explore: string
	t: (key: string) => string
	className?: string
}

export const ResidenceProgramsSection: React.FC<Props> = ({ title, explore, t, className }) => {
	return (
		<section className={cn('max-w-7xl mx-auto py-24 px-6 max-md:py-16 max-md:px-4', className)}>
			<h2 className="text-title text-center mb-12 max-md:mb-8">
				{title}
			</h2>
			<div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
				{RESIDENCE_SUB_ITEMS.map((item) => (
					<Link
						key={item.path}
						href={item.path}
						className={cn(
							"group relative flex flex-col justify-between overflow-hidden bg-gray-light p-8 min-h-[160px] transition-all duration-500 hover:bg-secondary/10 border border-white/5",
							"last:col-span-2 last:max-w-[calc(50%-8px)] last:mx-auto last:w-full",
							"max-md:last:col-span-1 max-md:last:max-w-full max-md:p-6"
						)}
					>
						<h3 className="text-text group-hover:text-secondary transition-colors">
							{t(item.label)}
						</h3>
						<span className="text-secondary uppercase flex items-center gap-2">
							{explore} <span className="group-hover:translate-x-2 transition-transform">→</span>
						</span>
					</Link>
				))}
			</div>
		</section>
	)
}