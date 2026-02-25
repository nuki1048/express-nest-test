import { Provider } from '@/providers/Provider'
import { getMessages } from 'next-intl/server'
import '../globals.css'
import { Footer, Header } from '@/components/shared'

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
			<div className="flex flex-col min-h-screen">
				<Header />
				<main className="flex-1">
					{children}
				</main>
				<Footer />
			</div>
		</Provider>
	)
}