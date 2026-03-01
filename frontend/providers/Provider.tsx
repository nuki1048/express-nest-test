'use client'

import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl'
import { ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

interface Props {
	children: ReactNode
	locale: string
	messages: AbstractIntlMessages
}

export function Provider({ children, locale, messages }: Props) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false,
					},
				},
			})
	)

	return (
		<QueryClientProvider client={queryClient}>
			<NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
				{children}
			</NextIntlClientProvider>
			<Toaster
				position="top-center"
				reverseOrder={false}
			/>
		</QueryClientProvider>
	)
}