'use client'
import React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useBlog } from '@/lib/useBlog'
import { DASHBOARD_PAGES } from '@/config/pages-url.config'
import { cn } from '@/lib/utils'
import { useParams } from 'next/navigation'
import { RecentCard, RecentCardSkeleton } from '.'

interface Props {
	className?: string
}

export const RecentPosts: React.FC<Props> = ({ className }) => {
	const params = useParams()
	const t = useTranslations('Blog')
	const { data: posts, isLoading } = useBlog()
	const recentPosts = posts
		?.filter((post) => post.slug !== params.slug)
		.slice(0, 3) || []
	const gridStyles = "grid grid-cols-3 max-md:grid-cols-1 gap-6"

	if (isLoading) {
		return (
			<section className={cn('py-12 max-w-4xl mx-auto max-lg:px-4', className)}>
				<div className="flex items-center justify-between mb-8 max-md:mb-6">
					<div className="h-7 w-40 bg-gray-100 animate-pulse rounded" />
					<div className="h-4 w-16 bg-gray-100 animate-pulse rounded" />
				</div>
				<div className={gridStyles}>
					{[...Array(3)].map((_, i) => (
						<RecentCardSkeleton key={i} />
					))}
				</div>
			</section>
		)
	}

	if (recentPosts.length === 0) return null

	return (
		<section className={cn('py-12 max-w-4xl mx-auto max-lg:px-4', className)}>
			<div className="flex items-center justify-between mb-8 max-md:mb-6">
				<h2 className="text-xl max-sm:text-lg font-bold">
					{t('recentPosts')}
				</h2>
				<Link
					href={DASHBOARD_PAGES.BLOG}
					className="hover:text-secondary transition-colors text-sm"
				>
					{t('seeAll')}
				</Link>
			</div>
			<div className={gridStyles}>
				{recentPosts.map((post) => (
					<RecentCard
						key={post.id}
						slug={post.slug}
						title={post.title}
						mainPhoto={post.mainPhoto}
						views={post.views}
						likes={post.likes}
					/>
				))}
			</div>
		</section>
	)
}