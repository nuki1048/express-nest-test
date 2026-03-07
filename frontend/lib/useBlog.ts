import { blogService } from '@/services/blog.service'
import { useQuery } from '@tanstack/react-query'

export function useBlog() {
	const { data, isLoading, error } = useQuery({
		queryKey: ['blog'],
		queryFn: () => blogService.getAll()
	})

	const publishedPosts = data 
    ? data.filter((post) => post.isPublished === true) 
    : []

	return {
    data: publishedPosts, 
    isLoading, 
    error
  }
}