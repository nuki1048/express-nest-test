import { BlogList } from '@/components/shared'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'Metadata' })

	return {
		title: t('blog'),
	}
}

export default function BlogPage() {
	return (
		<section className="py-20 px-4 max-w-[1440px] mx-auto max-md:py-10 max-sm:px-4">
			<BlogList />
		</section>
	)
}
