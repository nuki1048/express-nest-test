import { Provider } from '@/providers/Provider'
import { getMessages } from 'next-intl/server'
import '../globals.css'
import { Header } from '@/components/shared'

export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const messages = await getMessages()

	return (
		<Provider locale={locale} messages={messages}>
			<Header/>
			<main>{children}</main>
		</Provider>
	)
}
