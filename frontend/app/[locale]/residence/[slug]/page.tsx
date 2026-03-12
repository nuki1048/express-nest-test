import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { ContactUsSection, OurServicesSection, ResidenceBenefitRequirementsSection, ResidenceHeroSection } from '@/components/shared'

interface Props {
	params: Promise<{ slug: string; locale: string }>
}

export async function generateStaticParams() {
	return [
		{ slug: 'mprp' },
		{ slug: 'nomad' },
		{ slug: 'grp' },
		{ slug: 'trp' },
		{ slug: 'citizenship' },
	]
}

export default async function ResidenceProgramPage({ params }: Props) {
	const { slug } = await params

	const validSlugs = ['mprp', 'nomad', 'grp', 'trp', 'citizenship']
	if (!validSlugs.includes(slug)) {
		notFound()
	}

	const t = await getTranslations(`Residence.${slug}`)

	const benefits = t.has('benefits') ? t.raw('benefits') as string[] : []
	const requirements = t.has('requirements') ? t.raw('requirements') as string[] : []
	const footer = t.has('requirements_footer') ? t('requirements_footer') : ''

	return (
		<div className="min-h-screen">
			<ResidenceHeroSection title={t('title')}
				description={t('description')} />
			<ResidenceBenefitRequirementsSection
				benefitsTitle={t.has('benefits_title') ? t('benefits_title') : ''}
				benefits={benefits}
				requirementsTitle={t.has('requirements_title') ? t('requirements_title') : ''}
				requirements={requirements}
				requiremenetsFooter={footer}
			/>
			<OurServicesSection />
			<ContactUsSection />
		</div>
	)
}