'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from '@/constants/navItems'
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '../ui'

export const BurgerMenu: React.FC<React.PropsWithChildren> = ({ children }) => {
	const t = useTranslations('Header')
	const fullPathname = usePathname()
	const pathname = fullPathname.replace(/^\/(en|ru|de)(\/|$)/, '/') || '/'

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
						<Link href={"https://www.airbnb.com.ua"}
							target='_blank'
							className='bg-primary text-background text-center w-[150px] py-2 rounded-3xl transition-colors duration-400 cursor hover:bg-secondary'>AIRBNB</Link>
						<Link href={"https://www.booking.com"}
							target='_blank'
							className='bg-primary text-background text-center w-[150px] py-2 rounded-3xl transition-colors duration-400 cursor hover:bg-secondary'>BOOKING</Link>
					</div>
				</div>

			</SheetContent>
		</Sheet>
	)
}