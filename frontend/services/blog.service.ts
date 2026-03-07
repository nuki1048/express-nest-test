import { axiosClassic } from '@/api/interceptors'
import { IBlogPost } from '@/types/blog.types'

class BlogService {
	private BASE_URL = '/blog-posts'

	async getAll() {
		const response = await axiosClassic.get<IBlogPost[]>(this.BASE_URL)
		return response.data
	}

	async getBySlug(slug: string) {
		const response = await axiosClassic.get<IBlogPost>(`${this.BASE_URL}/${slug}`)
		return response.data
	}

	async updateLikes(slug: string, count: number) {
    const response = await axiosClassic.patch<IBlogPost>(`${this.BASE_URL}/${slug}`, {
      likes: count
    })
    return response.data
  }
}

export const blogService = new BlogService()