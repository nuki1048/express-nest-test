import { ActivitiesInfo } from '@/components/shared'
import { ACTIVITIES_DETAILS } from '@/constants/activitiesDetails'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'Metadata' })

	return {
		title: t('activities'),
	}
}

export default function ActivitiesPage() {
	return <div>
		{ACTIVITIES_DETAILS.map((item) => (
			<ActivitiesInfo key={item.id} item={item} />
		))}
	</div>
}
