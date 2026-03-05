import { ActivitiesSection, ContactButton, ContactUsSection, ExperienceSection, HeroSection, IntroSection, PhotosSection } from '@/components/shared'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'Metadata' })

	return {
		title: t('general'),
	}
}

export default function GeneralPage() {
	return (
		<div>
			<HeroSection />
			<IntroSection />
			<ExperienceSection />
			<ActivitiesSection />
			<ContactUsSection />
			<PhotosSection />
			<ContactButton />
		</div>
	)
}
