import { ContactUsSection, OurServicesSection, ResidenceBenefitsSection, ResidenceCtaSection, ResidenceHeroSection, ResidenceProgramsSection } from '@/components/shared'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'Metadata' })

	return {
		title: t('residence'),
	}
}

export default async function ResidencePage() {
	const t = await getTranslations('Residence.Main')
	const h = await getTranslations('Header')
	const benefits = t.raw('benefits') as string[]

	return (
		<div className="min-h-screen font-sans">
			<ResidenceHeroSection title={t('title')}
				description={t('description')} />
			<ResidenceBenefitsSection
				title={t('benefits_title')}
				benefits={benefits}
			/>
			<ResidenceProgramsSection
				title={t('available_programmes')}
				explore={t('explore_programme')}
				t={h}
			/>
			<ResidenceCtaSection footer={t('footer_text')} cta={t('cta_text')} />
			<OurServicesSection />
			<ContactUsSection />
		</div>
	)
}
