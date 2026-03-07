'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { useBlog } from '@/lib/useBlog'
import { BlogCard, BlogCardSkeleton } from '.'

interface Props {
	className?: string
}

export const BlogList: React.FC<Props> = ({ className }) => {
	const { data, isLoading } = useBlog()
	const gridStyles = "grid grid-cols-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-8 max-md:gap-6"

	if (isLoading) {
		return (
			<div className={cn(gridStyles, className)}>
				{[...Array(4)].map((_, i) => (
					<BlogCardSkeleton key={i} />
				))}
			</div>
		)
	}

	return (
		<div className={gridStyles}>
			{data.map((post) => (
				<BlogCard key={post.id} {...post} />
			))}
		</div>
	)
}