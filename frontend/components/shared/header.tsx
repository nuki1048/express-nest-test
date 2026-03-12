'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { NAV_ITEMS, RESIDENCE_SUB_ITEMS } from '@/constants/navItems'
import { LanguageSelector } from './language-selector'
import { BurgerMenu } from './burger-menu'
import { MenuIcon } from '../ui'
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

export const Header: React.FC = () => {
	const t = useTranslations('Header')
	const fullPathname = usePathname()
	const pathname = fullPathname.replace(/^\/(en|ru|it)(\/|$)/, '/') || '/'
	const router = useRouter()

	return (
		<>
			<header className={cn(
				'fixed top-0 left-0 z-100 w-full bg-gray-dark flex items-center transition-all duration-300 px-10 max-2xl:px-6',
				'h-[90px] max-2xl:h-[80px] max-xl:h-[75px] max-lg:h-[70px] max-md:h-[50px]'
			)}>
				<div className="flex-1 max-md:hidden" />
				<div className="max-md:hidden flex justify-center">
					<NavigationMenu className="max-w-full italic-none" viewport={false}>
						<NavigationMenuList className="gap-x-8 max-2xl:gap-x-6 max-xl:gap-x-4 max-[1100px]:gap-x-1 max-lg:gap-x-0">
							{NAV_ITEMS.map((item) => {
								const isActive = item.path === '/'
									? pathname === '/'
									: pathname.startsWith(item.path)

								if (item.label === 'residence') {
									return (
										<NavigationMenuItem key={item.path} className="relative">
											<NavigationMenuTrigger
												onClick={() => router.push(item.path)}
												data-active={isActive}
												className={cn(
													"bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent",
													"font-sans uppercase whitespace-nowrap transition-colors duration-300 cursor-pointer outline-none",
													"px-6 max-2xl:px-4 max-xl:px-3 max-[1100px]:px-2",
													"text-base max-xl:text-[15px] max-[1100px]:text-[13px] max-lg:text-[13px]",
													"tracking-wide max-[1100px]:tracking-tight max-lg:tracking-tighter",
													isActive ? "text-secondary font-medium" : "text-primary hover:text-secondary"
												)}
											>
												{t(item.label)}
											</NavigationMenuTrigger>
											<NavigationMenuContent className="absolute left-0 top-full flex flex-col">
												<ul className="bg-gray-dark p-2 w-[450px] max-2xl:w-[400px] max-xl:w-[350px] shadow-2xl animate-in fade-in slide-in-from-top-2 rounded-md list-none border border-white/5">
													{RESIDENCE_SUB_ITEMS.map((sub) => {
														const isSubActive = pathname === sub.path
														return (
															<li key={sub.path} className="mb-1 last:mb-0">
																<NavigationMenuLink asChild active={isSubActive}>
																	<Link
																		href={sub.path}
																		className={cn(
																			"block p-4 max-xl:p-3 transition-all duration-300 hover:bg-white/5 font-sans uppercase tracking-widest",
																			"text-[13px] max-2xl:text-[12px] max-xl:text-[11px] leading-relaxed",
																			isSubActive ? "text-secondary font-bold" : "text-primary hover:text-secondary"
																		)}
																	>
																		{t(sub.label)}
																	</Link>
																</NavigationMenuLink>
															</li>
														)
													})}
												</ul>
											</NavigationMenuContent>
										</NavigationMenuItem>
									)
								}
								return (
									<NavigationMenuItem key={item.path}>
										<NavigationMenuLink
											asChild
											active={isActive}
											className={cn(
												"font-sans uppercase whitespace-nowrap transition-colors duration-300",
												"px-6 max-2xl:px-4 max-xl:px-3 max-[1100px]:px-2",
												"text-base max-xl:text-[15px] max-[1100px]:text-[13px] max-lg:text-[13px]",
												"tracking-wide max-[1100px]:tracking-tight max-lg:tracking-tighter",
												"bg-transparent hover:bg-transparent focus:bg-transparent data-active:bg-transparent",
												isActive ? "text-secondary font-medium" : "text-primary hover:text-secondary"
											)}
										>
											<Link href={item.path}>
												{t(item.label)}
											</Link>
										</NavigationMenuLink>
									</NavigationMenuItem>
								)
							})}
						</NavigationMenuList>
					</NavigationMenu>
				</div>
				<div className="flex-1 flex justify-end items-center gap-6">
					<div className="max-md:hidden">
						<LanguageSelector />
					</div>
					<div className='hidden max-md:flex gap-5 items-center'>
						<LanguageSelector />
						<BurgerMenu>
							<span className="cursor-pointer">
								<MenuIcon />
							</span>
						</BurgerMenu>
					</div>
				</div>
			</header>
			<div className="h-[90px] max-2xl:h-[80px] max-xl:h-[75px] max-lg:h-[70px] max-md:h-[50px]" />
		</>
	)
}