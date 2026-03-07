import { BlogPost, RecentPosts } from '@/components/shared'
import { DASHBOARD_PAGES } from '@/config/pages-url.config'
import { blogService } from '@/services/blog.service'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

interface Props {
	params: Promise<{ slug: string; locale: string }>
}

export default async function BlogPostPage({ params }: Props) {
	const { slug, locale } = await params
	const t = await getTranslations({ locale, namespace: 'Blog' })
	let post = null

	try {
		post = await blogService.getBySlug(slug)
	} catch (err) {
		return notFound()
	}

	if (!post) {
		return notFound()
	}

	return (
		<section className='max-w-[950px] mx-auto max-lg:px-4'>
			<div className='py-10 max-md:py-6'>
				<Link href={DASHBOARD_PAGES.BLOG} className='transition-colors duration-300 hover:text-secondary text-[15px]'>{t('allPosts')}</Link>
			</div>
			<BlogPost />
			<RecentPosts />
		</section>
	)
}