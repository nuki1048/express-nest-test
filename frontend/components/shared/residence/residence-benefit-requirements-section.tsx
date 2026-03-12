import React from 'react'
import { cn } from '@/lib/utils'

interface Props {
	benefitsTitle: string
	benefits: string[]
	requirementsTitle: string
	requirements: string[]
	requiremenetsFooter: string
	className?: string
}

export const ResidenceBenefitRequirementsSection: React.FC<Props> = ({
	benefitsTitle,
	benefits,
	requirementsTitle,
	requirements,
	requiremenetsFooter,
	className,
}) => {
	const hasBenefits = benefits && benefits.length > 0
	const hasRequirements = requirements && requirements.length > 0
	const isOnlyBenefits = hasBenefits && !hasRequirements

	if (!hasBenefits && !hasRequirements) return null

	return (
		<section className={cn('py-24 px-6 max-w-7xl mx-auto max-md:py-16 max-md:px-4', className)}>
			<div className={cn(
				'w-full',
				hasRequirements ? 'grid grid-cols-2 gap-16 items-center max-lg:grid-cols-1' : 'block'
			)}>
				{hasBenefits && (
					<div className={cn('w-full space-y-12', isOnlyBenefits && 'text-center')}>
						{benefitsTitle && (
							<h2 className={cn(
								'text-title uppercase tracking-widest',
								hasRequirements ? 'text-left border-b border-gray-dark/10 pb-4' : 'text-center mb-16'
							)}>
								{benefitsTitle}
							</h2>
						)}
						<div className={cn(
							'grid gap-4 w-full',
							isOnlyBenefits
								? 'grid-cols-3 max-xl:grid-cols-2 max-md:grid-cols-1'
								: 'grid-cols-1'
						)}>
							{benefits.map((benefit, index) => (
								<div
									key={index}
									className="flex items-start gap-5 p-8 bg-white border border-gray-100 shadow-sm hover:border-secondary transition-all duration-500"
								>
									<span className="text-secondary font-bold text-2xl leading-none shrink-0 w-8">
										0{index + 1}
									</span>
									<p className="text-gray-700 text-left text-[14px] uppercase font-medium leading-relaxed tracking-wide">
										{benefit}
									</p>
								</div>
							))}
						</div>
					</div>
				)}
				{hasRequirements && (
					<div className="bg-gray-dark p-10 md:p-16 text-white rounded-sm lg:sticky lg:top-32 max-md:p-8 max-lg:mt-12">
						{requirementsTitle && (
							<h2 className="text-3xl text-secondary uppercase tracking-widest mb-10 border-b border-white/10 pb-4 max-md:text-2xl max-md:mb-8">
								{requirementsTitle}
							</h2>
						)}
						<ul className="space-y-6 max-md:space-y-4">
							{requirements.map((req, index) => (
								<li key={index} className="flex items-center gap-4">
									<div className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
									<p className="text-primary/80">{req}</p>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
			{requiremenetsFooter && (
				<div className="text-text italic text-center mt-16 mx-auto">
					{requiremenetsFooter}
				</div>
			)}
		</section>
	)
}