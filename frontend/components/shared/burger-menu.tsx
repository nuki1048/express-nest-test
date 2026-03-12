'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { NAV_ITEMS, RESIDENCE_SUB_ITEMS } from '@/constants/navItems'
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetClose,
	SheetTitle,
	Skeleton,
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '../ui'
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
				className="bg-background border-none flex flex-col items-center h-full p-0 py-10 w-full"
			>
				<SheetTitle className="hidden">Mobile Menu</SheetTitle>
				<div className="flex-1 w-full" />
				<nav className="flex flex-col items-center w-full px-6">
					<Accordion type="single" collapsible className="w-full flex flex-col items-center">
						{NAV_ITEMS.map((item) => {
							const isActive = item.path === '/'
								? pathname === '/'
								: pathname.startsWith(item.path)

							if (item.label === 'residence') {
								return (
									<AccordionItem value="residence" key={item.path} className="border-none w-full max-w-[300px]">
										<AccordionTrigger className={cn(
											"font-sans text-lg tracking-wide uppercase py-4 hover:no-underline transition-colors justify-center gap-3 items-center",
											isActive ? "text-secondary" : "text-primary"
										)}>
											{t(item.label)}
										</AccordionTrigger>
										<AccordionContent className="flex flex-col items-center gap-y-5 pb-6 animate-in fade-in slide-in-from-top-1">
											<SheetClose asChild>
												<Link
													href={item.path}
													className={cn(
														"font-sans text-[12px] uppercase tracking-[0.15em] transition-colors text-center leading-relaxed",
														pathname === item.path ? "text-secondary font-bold" : "text-primary/70"
													)}
												>
													{t('all_residence_programs')}
												</Link>
											</SheetClose>
											{RESIDENCE_SUB_ITEMS.map((sub) => (
												<SheetClose asChild key={sub.path}>
													<Link
														href={sub.path}
														className={cn(
															"font-sans text-[12px] uppercase tracking-[0.15em] transition-colors text-center leading-relaxed",
															pathname === sub.path ? "text-secondary font-bold" : "text-primary/70"
														)}
													>
														{t(sub.label)}
													</Link>
												</SheetClose>
											))}
										</AccordionContent>
									</AccordionItem>
								)
							}
							return (
								<div key={item.path} className="w-full max-w-[300px] flex justify-center py-4">
									<SheetClose asChild>
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
								</div>
							)
						})}
					</Accordion>
				</nav>
				<div className="flex-1 flex items-end justify-center w-full pb-6">
					<div className="flex flex-col gap-4">
						{isLoading ? (
							<>
								<Skeleton className="w-[200px] h-[45px] rounded-3xl bg-muted" />
								<Skeleton className="w-[200px] h-[45px] rounded-3xl bg-muted" />
							</>
						) : (
							<div className="flex flex-col gap-4">
								{contacts?.links.airbnb && (
									<Link
										href={contacts.links.airbnb}
										target='_blank'
										className='bg-primary text-background text-center w-[200px] py-3 rounded-3xl transition-colors duration-400 font-bold text-[14px]'
									>
										AIRBNB
									</Link>
								)}
								{contacts?.links.booking && (
									<Link
										href={contacts.links.booking}
										target='_blank'
										className='bg-primary text-background text-center w-[200px] py-3 rounded-3xl transition-colors duration-400 font-bold text-[14px]'
									>
										BOOKING
									</Link>
								)}
							</div>
						)}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
}