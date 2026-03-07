'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LikeButton } from '.'

interface RecentCardProps {
	slug: string
	title: string
	mainPhoto: string
	views: number
	likes: number
	className?: string
}

export const RecentCard: React.FC<RecentCardProps> = ({
	slug,
	title,
	mainPhoto,
	views,
	likes,
	className,
}) => {
	return (
		<div className={cn('bg-white border border-gray-200 overflow-hidden flex flex-col', className)}>
			<Link href={`/blog/${slug}`} className="grow">
				<div className="relative aspect-square w-full overflow-hidden bg-gray-100">
					<Image
						src={mainPhoto}
						alt={title}
						fill
						priority={false}
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
						className="object-cover transition-transform duration-500 hover:scale-105"
					/>
				</div>
				<div className="p-6 max-sm:p-4 flex flex-col items-center text-center">
					<h3 className="font-engravers text-lg max-sm:text-base font-bold uppercase tracking-wider mb-4 max-sm:mb-2 line-clamp-2 min-h-14 max-sm:min-h-12 transition-colors hover:text-secondary">
						{title}
					</h3>
				</div>
			</Link>
			<div className="px-6 py-4 max-sm:px-4 max-sm:py-3 border-t border-gray-100 flex items-center justify-between text-gray-400">
				<div className="flex items-center gap-2">
					<Eye size={18} className="max-sm:w-4 max-sm:h-4" />
					<span className="text-sm max-sm:text-xs">{views}</span>
				</div>
				<LikeButton slug={slug} likes={likes} />
			</div>
		</div>
	)
}