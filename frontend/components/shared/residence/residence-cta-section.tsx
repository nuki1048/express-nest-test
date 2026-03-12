import React from 'react'
import { cn } from '@/lib/utils'

interface Props {
	footer: string
	cta: string
	className?: string
}

export const ResidenceCtaSection: React.FC<Props> = ({ footer, cta, className }) => {
	return (
		<section className={cn('bg-gray-dark py-20 px-6 text-center border-t border-white/10', className)}>
			<div className="max-w-3xl mx-auto">
				<p className="text-text mb-8">
					{footer}
				</p>
				<p className="text-text italic">
					{cta}
				</p>
			</div>
		</section>
	)
}