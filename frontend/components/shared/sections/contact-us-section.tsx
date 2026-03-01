import React from 'react'
import { cn } from '@/lib/utils'
import { ContactUs } from '..'

interface Props {
	className?: string
}

export const ContactUsSection: React.FC<Props> = ({ className }) => {
	return (
		<section className={cn('', className)}>
			<ContactUs />
		</section>
	)
}