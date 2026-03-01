import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface Props {
	className?: string
}

const photos = [
	{ id: 1, url: '/generalPage/photos/9.webp' },
	{ id: 2, url: '/generalPage/photos/1.webp' },
	{ id: 3, url: '/generalPage/photos/3.webp' },
	{ id: 4, url: '/generalPage/photos/10.webp' },
	{ id: 5, url: '/generalPage/photos/8.webp' },
	{ id: 6, url: '/generalPage/photos/4.webp' },
	{ id: 7, url: '/generalPage/photos/6.webp' },
	{ id: 8, url: '/generalPage/photos/5.webp' },
	{ id: 9, url: '/generalPage/photos/7.webp' },
	{ id: 10, url: '/generalPage/photos/2.webp' },
]

export const PhotosSection: React.FC<Props> = ({ className }) => {
	return (
		<section className={cn('w-full py-10 px-4 max-w-[1640px] mx-auto', className)}>
			<div className={cn(
				'gap-4 space-y-4',
				'columns-2',
				'md:columns-3',
				'lg:columns-4',
				'xl:columns-5'
			)}>
				{photos.map((photo) => (
					<div key={photo.id} className="break-inside-avoid">
						<div className="relative overflow-hidden rounded-xl bg-muted shadow-sm group">
							<Image
								src={photo.url}
								alt={`Gallery image ${photo.id}`}
								width={500}
								height={700}
								className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
								sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
							/>
							<div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
						</div>
					</div>
				))}
			</div>
		</section>
	)
}