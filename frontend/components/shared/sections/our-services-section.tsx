import { getTranslations } from 'next-intl/server'
import { cn } from '@/lib/utils'
import { Building2, IdCard, Scale, Sofa, Key } from 'lucide-react'

interface Props {
	className?: string
}

const ICONS = [
	<Building2 key="1" className="size-8" />,
	<IdCard key="2" className="size-8" />,
	<Scale key="3" className="size-8" />,
	<Sofa key="4" className="size-8" />,
	<Key key="5" className="size-8" />,
]

export const OurServicesSection = async ({ className }: Props) => {
	const t = await getTranslations('OurServices')
	const services = t.raw('services') as { title: string; description: string }[]

	return (
		<section className={cn('py-24 px-6 relative overflow-hidden bg-white max-md:py-16 max-md:px-4', className)}>
			<div className="max-w-8xl mx-auto relative z-10">
				<h2 className="text-title mb-20 text-center max-md:mb-12">
					{t('title')}
				</h2>
				<div className="flex flex-wrap justify-center gap-x-8 gap-y-16 max-md:gap-y-12">
					{services.map((service, index) => (
						<div
							key={index}
							className={cn(
								"flex flex-col items-center text-center group",
								"w-[calc(20%-32px)] max-lg:w-[calc(33.333%-32px)] max-md:w-full"
							)}
						>
							<div className="size-24 rounded-full bg-gray-dark flex items-center justify-center text-secondary mb-8 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:bg-secondary group-hover:text-white border border-secondary/20">
								{ICONS[index]}
							</div>
							<h3 className="text-secondary text-text uppercase mb-4 min-h-[40px] flex items-center justify-center">
								{service.title}
							</h3>
							<div className="w-10 h-px bg-secondary/40 mb-4 transition-all duration-500 group-hover:w-18 group-hover:bg-secondary" />
							<p className="font-didot text-base max-md:text-[14px] max-w-[220px]">
								{service.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}