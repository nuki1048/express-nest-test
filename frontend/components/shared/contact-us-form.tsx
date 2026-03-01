'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { cn } from '@/lib/utils'
import { ContactSchema } from '@/constants/contact-us-form.schema'
import { useContactStore } from '@/store/contact-us'
import { TypeContactForm } from '@/types/contact-form.types'
import { useContactForm } from '@/hooks/use-contact-form'
import { Loader2 } from 'lucide-react'

export const ContactUsForm = () => {
	const t = useTranslations('ContactUs.ContactForm')
	const { formData, setField } = useContactStore()

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<TypeContactForm>({
		resolver: zodResolver(ContactSchema),
		mode: 'onTouched',
		defaultValues: formData,
	})

	const { sendContact, isPending } = useContactForm(reset)

	const onSubmit = (data: TypeContactForm) => {
		sendContact(data)
	}

	const labelWrapperStyle = "min-h-[22px] flex items-center gap-2 pl-2 mb-1"
	const inputStyles = "w-full bg-white rounded-2xl py-3.5 px-6 outline-none transition-shadow text-base max-md:py-3 max-md:px-4"

	return (
		<div className="bg-bg-form p-10 rounded-[40px] w-full max-w-[820px] text-black shadow-sm max-md:p-6 max-sm:rounded-[30px]">
			<h2 className="font-engravers text-3xl font-bold mb-6 uppercase tracking-widest text-left max-md:text-2xl max-md:text-center">
				{t('title')}
			</h2>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-md:space-y-3">
				<div className="grid grid-cols-2 gap-x-6 gap-y-3 max-md:grid-cols-1 max-md:gap-y-1">
					<div className="flex flex-col">
						<div className={labelWrapperStyle}>
							{errors.firstName && (
								<span className="text-red-500 text-xs leading-none">{t('errors.firstName')}</span>
							)}
						</div>
						<input
							{...register('firstName')}
							disabled={isPending}
							onChange={(e) => {
								register('firstName').onChange(e)
								setField('firstName', e.target.value)
							}}
							placeholder={t('firstName')}
							className={cn(inputStyles, errors.firstName && "ring-2 ring-red-500/50")}
						/>
					</div>
					<div className="flex flex-col">
						<div className={labelWrapperStyle}>
							{errors.lastName && (
								<span className="text-red-500 text-xs leading-none">{t('errors.lastName')}</span>
							)}
						</div>
						<input
							{...register('lastName')}
							disabled={isPending}
							onChange={(e) => {
								register('lastName').onChange(e)
								setField('lastName', e.target.value)
							}}
							placeholder={t('lastName')}
							className={cn(inputStyles, errors.lastName && "ring-2 ring-red-500/50")}
						/>
					</div>
					<div className="flex flex-col">
						<div className={labelWrapperStyle}>
							<span className="text-black text-xs">*</span>
							{errors.email?.message && (
								<span className="text-red-500 text-xs leading-none">
									{t(`errors.${errors.email.message}`)}
								</span>
							)}
						</div>
						<input
							{...register('email')}
							disabled={isPending}
							onChange={(e) => {
								register('email').onChange(e)
								setField('email', e.target.value)
							}}
							placeholder={t('email')}
							className={cn(inputStyles, errors.email && "ring-2 ring-red-500/50")}
						/>
					</div>
					<div className="flex flex-col">
						<div className={labelWrapperStyle}>
							{errors.phone && (
								<span className="text-red-500 text-xs leading-none">{t('errors.phone')}</span>
							)}
						</div>
						<Controller
							name="phone"
							control={control}
							render={({ field: { onChange, value, ...field } }) => (
								<PhoneInput
									{...field}
									value={value as string | undefined}
									disabled={isPending}
									onChange={(val) => {
										const isJustCode = val && val.length <= 4
										const finalValue = isJustCode ? "" : (val || "")
										onChange(finalValue)
										setField('phone', finalValue)
									}}
									international
									defaultCountry="MT"
									placeholder={t('phone')}
									className={cn(
										inputStyles,
										"flex",
										errors.phone && "ring-2 ring-red-500/50"
									)}
								/>
							)}
						/>
					</div>
				</div>
				<div className="flex flex-col">
					<div className={labelWrapperStyle}>
						<span className="text-black text-xs">*</span>
						{errors.message?.message && (
							<span className="text-red-500 text-xs leading-none">
								{t(`errors.${errors.message.message}`)}
							</span>
						)}
					</div>
					<textarea
						{...register('message')}
						disabled={isPending}
						onChange={(e) => {
							register('message').onChange(e)
							setField('message', e.target.value)
						}}
						placeholder={t('message')}
						rows={5}
						className={cn(
							inputStyles,
							"rounded-2xl resize-none max-md:rows-4",
							errors.message && "ring-2 ring-red-500/50"
						)}
					/>
				</div>
				<div className="flex justify-center pt-6 max-md:pt-4">
					<button
						type="submit"
						disabled={isPending}
						className={cn(
							"bg-[#3DB9E0] text-white font-bold uppercase py-4 px-16 rounded-full transition-all cursor-pointer",
							"hover:bg-[#2fa3c9] hover:shadow-lg active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed",
							"text-lg tracking-widest font-engravers shadow-md max-md:py-3 max-md:px-10 max-md:text-base"
						)}
					>
						{isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : t('button')}
					</button>
				</div>
			</form>
		</div>
	)
}