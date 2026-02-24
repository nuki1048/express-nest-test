'use client'

import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl'
import { ReactNode } from 'react'

interface Props {
	children: ReactNode
	locale: string
	messages: AbstractIntlMessages
}

export function Provider({ children, locale, messages }: Props) {
	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			{children}
		</NextIntlClientProvider>
	)
}
