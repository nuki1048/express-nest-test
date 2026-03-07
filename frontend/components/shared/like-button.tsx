'use client'
import React from 'react'
import { Heart } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { blogService } from '@/services/blog.service'
import { IBlogPost } from '@/types/blog.types'
import { cn } from '@/lib/utils'

interface LikeButtonProps {
	slug: string
	likes: number
}

export const LikeButton: React.FC<LikeButtonProps> = ({ slug, likes }) => {
	const queryClient = useQueryClient()
	const likedPosts = typeof window !== 'undefined'
		? JSON.parse(localStorage.getItem('likedPosts') || '[]')
		: []
	const isLiked = likedPosts.includes(slug)
	const { mutate } = useMutation({
		mutationFn: (newLikes: number) => blogService.updateLikes(slug, newLikes),
		onMutate: async (newLikes) => {
			await queryClient.cancelQueries({ queryKey: ['blog'] })
			const previousPosts = queryClient.getQueryData<IBlogPost[]>(['blog'])

			queryClient.setQueryData<IBlogPost[]>(['blog'], (old) => {
				if (!old) return []
				return old.map((p) => (p.slug === slug ? { ...p, likes: newLikes } : p))
			})
			return { previousPosts }
		},
		onError: (err, newLikes, context) => {
			if (context?.previousPosts) {
				queryClient.setQueryData(['blog'], context.previousPosts)
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['blog'] })
		}
	})

	const handleLike = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		const nextLikesCount = isLiked ? likes - 1 : likes + 1
		const updatedList = isLiked
			? likedPosts.filter((s: string) => s !== slug)
			: [...likedPosts, slug]

		localStorage.setItem('likedPosts', JSON.stringify(updatedList))
		mutate(nextLikesCount)
	}

	return (
		<div className="flex flex-row items-center gap-2">
			<span className={cn('text-sm transition-colors font-medium', isLiked && 'text-red-500')}>
				{likes}
			</span>
			<button
				onClick={handleLike}
				className='transition-all duration-300 active:scale-90 outline-none'
			>
				<Heart
					size={18}
					className={cn(
						'transition-all duration-300 cursor-pointer',
						isLiked ? 'fill-red-500 text-red-500' : 'hover:text-red-500'
					)}
				/>
			</button>
		</div>
	)
}