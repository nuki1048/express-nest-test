'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from '@/constants/navItems'
import { BurgerMenu } from './burger-menu'
import { MenuIcon } from '../ui'
import { LanguageSelector } from './language-selector'

interface Props {
	className?: string
}

export const Header: React.FC<Props> = ({ className }) => {
	const t = useTranslations('Header')
	const fullPathname = usePathname()
	const pathname = fullPathname.replace(/^\/(en|ru|de)(\/|$)/, '/') || '/'

	return (
		<header className={cn(
			'h-[90px] bg-gray-dark flex items-center transition-all duration-300',
			'max-2xl:h-[80px] max-xl:h-[75px] max-lg:h-[70px] max-md:h-[50px]',
			className
		)}>
			<nav className={cn(
				'flex items-center justify-center flex-nowrap transition-all duration-300 flex-2',
				'max-md:hidden',
				'gap-x-8 max-2xl:gap-x-6 max-xl:gap-x-4 max-[1100px]:gap-x-1 max-lg:gap-x-0'
			)}>
				{NAV_ITEMS.map((item) => {
					const isActive =
						item.path === '/'
							? pathname === '/'
							: pathname.startsWith(item.path)

					return (
						<Link
							key={item.path}
							href={item.path}
							className={cn(
								'font-sans transition-colors duration-300 hover:text-secondary uppercase whitespace-nowrap',
								'px-6 max-2xl:px-4 max-xl:px-3 max-[1100px]:px-2',
								'text-base max-xl:text-[15px] max-[1100px]:text-[13px] max-lg:text-[13px]',
								'tracking-wide max-[1100px]:tracking-tight max-lg:tracking-tighter',
								isActive ? 'text-secondary font-medium' : 'text-primary'
							)}
						>
							{t(item.label)}
						</Link>
					)
				})}
			</nav>
			<div className="mr-10 max-2xl:mr-6  max-md:hidden">
				<LanguageSelector />
			</div>
			<div className='hidden max-md:flex flex-1 gap-5 justify-end items-center'>
				<LanguageSelector />
				<BurgerMenu>
					<span className="cursor-pointer pr-3">
						<MenuIcon />
					</span>
				</BurgerMenu>
			</div>
		</header>
	)
}