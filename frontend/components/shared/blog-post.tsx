'use client'
import React, { useEffect } from 'react'
import Image from 'next/image'
import { notFound, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBlog } from '@/lib/useBlog'
import { LikeButton } from '.'
import { BlogPostSkeleton } from './skeletons/blog-post-skeleton'

interface Props {
	className?: string
}

export const BlogPost: React.FC<Props> = ({ className }) => {
	const params = useParams()
	const t = useTranslations('Blog')
	const { data: posts, isLoading } = useBlog()

	const post = posts?.find((p) => p.slug === params.slug)
	const slug = params.slug as string
	const locale = params.locale as string

	useEffect(() => {
		const handleContextMenu = (e: MouseEvent) => e.preventDefault()

		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				(e.ctrlKey && (e.key === 'c' || e.key === 'u' || e.key === 's' || e.key === 'p' || e.key === 'a')) ||
				e.key === 'F12'
			) {
				e.preventDefault()
			}
		}

		document.addEventListener('contextmenu', handleContextMenu)
		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('contextmenu', handleContextMenu)
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	if (isLoading) return <BlogPostSkeleton />
	if (!post) return notFound()

	const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
	const publishDate = new Date(post.createdAt).toLocaleDateString(locale, dateOptions)
	const isUpdated = new Date(post.updatedAt).getTime() > new Date(post.createdAt).getTime()
	const updateDate = isUpdated ? new Date(post.updatedAt).toLocaleDateString(locale, dateOptions) : null

	return (
		<article
			className={cn(
				'max-w-4xl mx-auto py-16 px-24 font-sans text-[#222] border select-none',
				'max-md:px-10 max-md:py-10 max-sm:px-4 max-sm:py-6 max-sm:border-none',
				className
			)}
			onCopy={(e) => e.preventDefault()}
		>
			<div className="flex items-center gap-2 text-[14px] max-sm:text-[12px] tracking-widest mb-6 max-sm:mb-4">
				<span className="font-bold text-black">Largo Estate</span>
				<span className="text-gray-300">•</span>
				<span>{publishDate}</span>
				{post.readTime && <>
					<span className="text-gray-300">•</span>
					<span>{post.readTime}</span>
				</>}
			</div>
			<div className='flex flex-col gap-5 mb-8 max-sm:gap-3 max-sm:mb-6'>
				<h1 className="font-engravers text-5xl max-md:text-4xl max-sm:text-2xl font-black uppercase tracking-wide">
					{post.title}
				</h1>
				{updateDate && (
					<p className='text-[14px] max-sm:text-[12px] tracking-widest text-gray-400'>
						{t('updated')}: {updateDate}
					</p>
				)}
			</div>
			<p className='text-3xl max-md:text-2xl max-sm:text-lg leading-10 max-sm:leading-7 font-semibold mb-7 max-sm:mb-5'>
				{post.description}
			</p>
			<div className="block">
				<div className="w-full md:w-[45%] md:float-left md:mr-10 mb-6 max-sm:mb-4">
					<div className="relative aspect-3/4 w-full shadow-xl shadow-gray-200/50">
						<Image
							src={post.mainPhoto}
							alt={post.title}
							fill
							priority
							className="object-cover"
						/>
					</div>
				</div>
				<div
					className="blog-content text-[18px] max-sm:text-[16px] leading-[1.8] text-gray-700 prose prose-neutral max-w-none"
					dangerouslySetInnerHTML={{ __html: post.content }}
				/>
				<div className="clear-both" />
			</div>
			<div className="mt-16 max-sm:mt-10 pt-6">
				<div className="px-6 py-4 max-sm:px-2 border-t border-gray-100 flex items-center justify-between text-gray-400">
					<div className="flex items-center gap-2">
						<Eye size={18} className="max-sm:w-4 max-sm:h-4" />
						<span className="text-sm max-sm:text-xs">{post.views}</span>
					</div>
					<LikeButton slug={slug} likes={post.likes} />
				</div>
			</div>
		</article>
	)
}