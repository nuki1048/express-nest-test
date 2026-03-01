'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from '@/constants/navItems'
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, Skeleton } from '../ui'
import { useContacts } from '@/lib/useContacts'

export const BurgerMenu: React.FC<React.PropsWithChildren> = ({ children }) => {
	const t = useTranslations('Header')
	const fullPathname = usePathname()
	const pathname = fullPathname.replace(/^\/(en|ru|de)(\/|$)/, '/') || '/'
	const { data: contacts, isLoading } = useContacts()

	return (
		<Sheet>
			<SheetTrigger asChild>{children}</SheetTrigger>
			<SheetContent
				side="right"
				className="bg-background border-none flex flex-col items-center h-full p-0 py-10"
			>
				<SheetTitle className="hidden">Mobile Menu</SheetTitle>
				<div className="flex-1 w-full" />
				<nav className="flex flex-col items-center gap-y-6">
					{NAV_ITEMS.map((item) => {
						const isActive =
							item.path === '/'
								? pathname === '/'
								: pathname.startsWith(item.path)

						return (
							<SheetClose asChild key={item.path}>
								<Link
									href={item.path}
									className={cn(
										'font-sans text-lg transition-colors duration-300 hover:text-secondary tracking-wide uppercase whitespace-nowrap',
										isActive ? 'text-secondary' : 'text-primary'
									)}
								>
									{t(item.label)}
								</Link>
							</SheetClose>
						)
					})}
				</nav>
				<div className="flex-1 flex items-end justify-center w-full">
					<div className="flex gap-x-6">
						{isLoading ? (
							<>
								<Skeleton className="w-[130px] h-[36px] rounded-3xl bg-muted" />
								<Skeleton className="w-[130px] h-[36px] rounded-3xl bg-muted" />
							</>
						) : (
							<>
								{contacts?.links.airbnb && (
									<Link
										href={contacts.links.airbnb}
										target='_blank'
										className='bg-primary text-background text-center w-[130px] py-2 rounded-3xl transition-colors duration-400 cursor text-[14px]'
									>
										AIRBNB
									</Link>
								)}
								{contacts?.links.booking && (
									<Link
										href={contacts.links.booking}
										target='_blank'
										className='bg-primary text-background text-center w-[130px] py-2 rounded-3xl transition-colors duration-400 cursor text-[14px]'
									>
										BOOKING
									</Link>
								)}
							</>
						)}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
}