'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { AtSign, Smartphone, TreePalm } from 'lucide-react'
import { useContacts } from '@/lib/useContacts'
import { Skeleton } from '../ui'

interface Props {
	className?: string
}

export const Footer: React.FC<Props> = ({ className }) => {
	const { data: contacts, isLoading } = useContacts()
	const formatPhone = (phone: string) => phone.replace(/[^0-9+]/g, '')
	return (
		<footer className={cn('w-full bg-brown', className)}>
			<div className={cn(
				'container mx-auto flex flex-row items-center justify-between py-10 transition-all duration-300',
				'h-72 max-2xl:h-64 max-xl:h-60 max-lg:h-52 max-md:h-auto max-md:flex-col max-md:gap-y-10'
			)}>
				<div className="flex-1 flex justify-center">
					<Link href='/'>
						<div className="relative w-[300px] max-2xl:w-[250px] max-xl:w-[200px] max-lg:w-[160px]">
							<Image
								alt='logo'
								src='/logo.png'
								width={300}
								height={150}
								className="object-contain w-full h-auto"
							/>
						</div>
					</Link>
				</div>
				<div className="flex-1 h-full flex flex-col justify-end items-center max-md:justify-center">
					<div className="flex gap-x-6 max-xl:gap-x-4 max-lg:gap-x-2">
						{isLoading ? (
							<>
								<Skeleton className="w-[150px] h-[40px] rounded-3xl max-xl:w-[130px] max-lg:w-[110px]" />
								<Skeleton className="w-[150px] h-[40px] rounded-3xl max-xl:w-[130px] max-lg:w-[110px]" />
							</>
						) : (
							<>
								{contacts?.links.airbnb && (
									<Link
										href={contacts.links.airbnb}
										target="_blank"
										className={cn(
											'bg-primary text-background text-center rounded-3xl transition-colors duration-400 hover:bg-secondary uppercase',
											'w-[150px] py-2 max-xl:w-[130px] max-xl:text-sm max-lg:w-[110px] max-lg:text-[10px]'
										)}
									>
										AIRBNB
									</Link>
								)}
								{contacts?.links.booking && (
									<Link
										href={contacts.links.booking}
										target="_blank"
										className={cn(
											'bg-primary text-background text-center rounded-3xl transition-colors duration-400 hover:bg-secondary uppercase',
											'w-[150px] py-2 max-xl:w-[130px] max-xl:text-sm max-lg:w-[110px] max-lg:text-[10px]'
										)}
									>
										BOOKING
									</Link>
								)}
							</>
						)}
					</div>
				</div>
				<div className='flex-1 flex flex-col gap-3 justify-center items-center'>
					<div className="w-fit">
						<div className='flex flex-row gap-4 items-center mb-3'>
							<AtSign className="w-10 h-10 max-2xl:w-9 max-2xl:h-9 max-xl:w-8 max-xl:h-8 max-lg:w-7 max-lg:h-7" strokeWidth={1.5} />
							{isLoading ? (
								<Skeleton className="w-32 h-5" />
							) : (
								<a href={`mailto:${contacts?.email}`} className="leading-tight hover:text-secondary transition-colors text-[18px] max-xl:text-[16px] max-lg:text-[14px]">
									{contacts?.email}
								</a>
							)}
						</div>
						<div className='flex flex-row gap-4 items-center mb-3'>
							<Smartphone className="w-10 h-10 max-2xl:w-9 max-2xl:h-9 max-xl:w-8 max-xl:h-8 max-lg:w-7 max-lg:h-7" strokeWidth={1.5} />
							<div className="flex flex-col">
								{isLoading ? (
									<div className="flex flex-col gap-1">
										<Skeleton className="w-36 h-10" />
									</div>
								) : (
									contacts?.phoneNumbers.map((phone, index) => (
										<a
											key={index}
											href={`tel:${formatPhone(phone)}`}
											className="hover:text-secondary transition-colors text-[18px] max-xl:text-[16px] max-lg:text-[14px]"
										>
											{phone}
										</a>
									))
								)}
							</div>
						</div>
						<div className='flex flex-row gap-4 items-center'>
							<TreePalm className="w-10 h-10 max-2xl:w-9 max-2xl:h-9 max-xl:w-8 max-xl:h-8 max-lg:w-7 max-lg:h-7" strokeWidth={1.5} />
							{isLoading ? (
								<Skeleton className="w-48 h-10" />
							) : (
								<a
									href={contacts?.address.url}
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-secondary transition-colors text-[18px] max-xl:text-[16px] max-lg:text-[14px] leading-tight whitespace-pre-line w-48"
								>
									{contacts?.address.label}
								</a>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="w-full h-[194px] max-lg:h-[140px] max-md:h-[100px] overflow-hidden relative">
				<video autoPlay loop muted playsInline className="w-full h-full object-cover">
					<source src="https://video.wixstatic.com/video/11062b_d9f4ac8a7019428d9cf5cefd98892d37/1080p/mp4/file.mp4" type="video/mp4" />
				</video>
			</div>
		</footer>
	)
}