import { ContactUsSection, StudyingBenefits, StudyingEducation, StudyingEnglishSchools, StudyingHeroSection, StudyingSupport } from '@/components/shared'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'Metadata' })

	return {
		title: t('studying'),
	}
}

export default function StudyingInMaltaPage() {
	return (
		<div className="">
			<StudyingHeroSection />
			<StudyingBenefits />
			<StudyingEnglishSchools />
			<StudyingEducation />
			<StudyingSupport />
			<ContactUsSection />
		</div>
	)
}