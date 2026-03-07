import { Skeleton } from "@/components/ui/skeleton"

export const BlogPostSkeleton = () => {
	return (
		<article className="max-w-4xl mx-auto py-16 px-24 max-md:px-10 max-sm:px-4 max-sm:py-6 font-sans border max-sm:border-none">
			<div className="flex items-center gap-2 mb-6 max-sm:mb-4">
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-4 w-4 rounded-full" />
				<Skeleton className="h-4 w-32" />
			</div>
			<div className="flex flex-col gap-5 mb-8 max-sm:gap-3">
				<Skeleton className="h-12 max-sm:h-8 w-full" />
				<Skeleton className="h-12 max-sm:h-8 w-2/3" />
			</div>
			<Skeleton className="h-10 max-sm:h-6 w-full mb-7" />
			<div className="block overflow-hidden">
				<div className="w-full md:w-[45%] md:float-left md:mr-10 mb-6">
					<Skeleton className="aspect-3/4 w-full" />
				</div>
				<div className="space-y-4">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-[90%]" />
				</div>
			</div>
			<div className="mt-16 max-sm:mt-10 pt-6">
				<div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
					<Skeleton className="h-6 w-16" />
					<Skeleton className="h-6 w-20" />
				</div>
			</div>
		</article>
	)
}