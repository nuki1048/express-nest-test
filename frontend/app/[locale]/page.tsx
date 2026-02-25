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
			<h1>GeneralPage</h1>
		</div>
	)
}
