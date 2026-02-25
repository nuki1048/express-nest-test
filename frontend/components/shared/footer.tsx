import React from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { AtSign, Smartphone, TreePalm } from 'lucide-react'

interface Props {
	className?: string
}

export const Footer: React.FC<Props> = ({ className }) => {
	return (
		<footer className={cn('w-full bg-brown', className)}>
			<div className={cn(
				'container mx-auto flex flex-row items-center justify-between py-10 transition-all duration-300',
				'h-72 max-2xl:h-64 max-xl:h-60 max-lg:h-52 max-md:h-auto max-md:flex-col max-md:gap-y-10'
			)}>
				<div className="flex-1 flex justify-start max-md:justify-center">
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
						<Link
							href={"https://www.airbnb.com.ua"}
							target='_blank'
							className={cn(
								'bg-primary text-background text-center rounded-3xl transition-colors duration-400 hover:bg-secondary uppercase',
								'w-[150px] py-2 max-xl:w-[130px] max-xl:text-sm max-lg:w-[110px] max-lg:text-[10px]'
							)}
						>
							AIRBNB
						</Link>
						<Link
							href={"https://www.booking.com"}
							target='_blank'
							className={cn(
								'bg-primary text-background text-center rounded-3xl transition-colors duration-400 hover:bg-secondary uppercase',
								'w-[150px] py-2 max-xl:w-[130px] max-xl:text-sm max-lg:w-[110px] max-lg:text-[10px]'
							)}
						>
							BOOKING
						</Link>
					</div>
				</div>
				<div className='flex-1 flex flex-col gap-3 justify-center items-center'>
					<div className="w-fit">
						<div className='flex flex-row gap-4 items-center mb-3'>
							<AtSign className="w-10 h-10 max-2xl:w-9 max-2xl:h-9 max-xl:w-8 max-xl:h-8 max-lg:w-7 max-lg:h-7" strokeWidth={1.5} />
							<a href='mailto:test@gmail.com' className="leading-tight hover:text-secondary transition-colors text-[18px] max-xl:text-[16px] max-lg:text-[14p]">
								test@gmail.com
							</a>
						</div>
						<div className='flex flex-row gap-4 items-center mb-3'>
							<Smartphone className="w-10 h-10 max-2xl:w-9 max-2xl:h-9 max-xl:w-8 max-xl:h-8 max-lg:w-7 max-lg:h-7" strokeWidth={1.5} />
							<div className="flex flex-col">
								<a href="tel:+35600000000" className="hover:text-secondary transition-colors text-[18px] max-xl:text-[16px] max-lg:text-[14p]">+356000 00 000</a>
								<a href="tel:+35600000000" className="hover:text-secondary transition-colors text-[18px] max-xl:text-[16px] max-lg:text-[14p]">+356000 00 000</a>
							</div>
						</div>
						<div className='flex flex-row gap-4 items-center'>
							<TreePalm className="w-10 h-10 max-2xl:w-9 max-2xl:h-9 max-xl:w-8 max-xl:h-8 max-lg:w-7 max-lg:h-7" strokeWidth={1.5} />
							<a href="https://maps.app.goo.gl/AnYa7R9KtytDYX4D8" className=" hover:text-secondary transition-colors text-[18px] max-xl:text-[16px] max-lg:text-[14px]">
								Sliema, Gzira, San Gwann, <br /> St. Paul Bay, MALTA
							</a>
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