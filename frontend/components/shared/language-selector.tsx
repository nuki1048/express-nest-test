'use client'

import { useLocale } from 'next-intl'
import { useLocaleChange } from '@/hooks/useLocaleChange'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from '@/components/ui/select'

const LANGUAGES = [
	{ value: 'en', label: 'En' },
	{ value: 'ru', label: 'Ru' },
	{ value: 'it', label: 'It' },
]

export const LanguageSelector = () => {
	const locale = useLocale()
	const { selectLanguage, isPending } = useLocaleChange()

	const filteredLanguages = LANGUAGES.filter((lang) => lang.value !== locale)

	return (
		<div className="flex items-center h-[40px] max-lg:h-[30px]">
			<Select
				value={locale}
				onValueChange={selectLanguage}
				disabled={isPending}
			>
				<SelectTrigger
					className="w-[60px] h-[40px] bg-gray-light border-none text-primary uppercase font-sans focus:ring-0 focus:ring-offset-0 transition-colors hover:text-secondary p-0 flex items-center justify-center cursor-pointer [&>svg]:hidden max-lg:w-[50px] max-lg:h-[30px] max-lg:text-[12px]"
				>
					<span className="block w-full text-center leading-none">
						{locale}
					</span>
				</SelectTrigger>

				<SelectContent
					position="popper"
					sideOffset={-10}
					className="bg-gray-light text-primary z-100 border-none min-w-0 w-(--radix-select-trigger-width) p-0 rounded-t-none"
				>
					{filteredLanguages.map((lang) => (
						<SelectItem
							key={lang.value}
							value={lang.value}
							className="uppercase cursor-pointer focus:bg-secondary focus:text-white flex justify-center px-1 max-lg:text-[12px]"
						>
							{lang.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}