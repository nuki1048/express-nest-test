import { SITE_NAME } from '@/constants/seo.constants'
import { getLocale } from 'next-intl/server'
import { ReactNode } from 'react'
import './globals.css'

export const metadata = {
	title: {
		default: SITE_NAME,
		template: `%s | ${SITE_NAME}`,
	},
}

export default async function RootLayout({
	children,
}: {
	children: ReactNode
}) {
	const locale = await getLocale()

	return (
		<html lang={locale}>
			<body>{children}</body>
		</html>
	)
}
