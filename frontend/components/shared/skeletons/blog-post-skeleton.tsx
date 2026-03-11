import { Skeleton } from "@/components/ui/skeleton"

export const BlogPostSkeleton = () => {
	return (
		<article className="max-w-4xl mx-auto py-16 px-24 max-md:px-10 max-sm:px-4 max-sm:py-6 font-sans border max-sm:border-none">
			<div className="flex items-center gap-2 mb-6 max-sm:mb-4">
				<Skeleton className="h-4 w-24" />
				<span className="text-gray-200">•</span>
				<Skeleton className="h-4 w-20" />
				<span className="text-gray-200">•</span>
				<Skeleton className="h-4 w-16" />
			</div>
			<div className="flex flex-col gap-5 mb-8 max-sm:gap-3 max-sm:mb-6">
				<Skeleton className="h-12 max-sm:h-8 w-full" />
				<Skeleton className="h-12 max-sm:h-8 w-1/3" />
			</div>
			<div className="space-y-3 mb-7 max-sm:mb-5">
				<Skeleton className="h-10 max-sm:h-6 w-full" />
				<Skeleton className="h-10 max-sm:h-6 w-[90%]" />
			</div>
			<div className="flex flex-col md:flex-row gap-10 mb-6">
				<div className="w-full md:w-[45%] shrink-0">
					<Skeleton className="aspect-3/4 w-full shadow-xl" />
				</div>
				<div className="flex-1 space-y-4">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-[60%]" />
				</div>
			</div>
			<div className="mt-16 max-sm:mt-10 pt-6">
				<div className="px-6 py-4 max-sm:px-2 border-t border-gray-100 flex items-center justify-between">
					<Skeleton className="h-5 w-20" />
					<Skeleton className="h-5 w-20" />
				</div>
			</div>
		</article>
	)
}