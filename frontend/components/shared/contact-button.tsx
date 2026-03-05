'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { useContacts } from '@/lib/useContacts'
import { MessageCircle } from 'lucide-react'

interface Props {
	className?: string
}

export const ContactButton: React.FC<Props> = ({ className }) => {
	const { data } = useContacts()

	if (!data?.links.whatsApp) {
		return null
	}

	return (
		<a
			href={data?.links.whatsApp}
			target="_blank"
			rel="noopener noreferrer"
			className={cn(
				'fixed bottom-10 right-10 z-50',
				'flex items-center gap-3 bg-primary text-gray-light px-8 py-4 rounded-full',
				'font-engravers font-bold text-sm tracking-widest uppercase',
				'shadow-2xl shadow-primary/40 transition-all duration-400 ease-in-out',
				'hover:bg-secondary active:scale-95 cursor-pointer',
				className
			)}
		>
			<MessageCircle size={20} className="animate-pulse" />
			<span className="max-md:hidden">let`s chat</span>
		</a>
	)
}