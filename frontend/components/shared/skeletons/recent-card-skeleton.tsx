import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface Props {
	className?: string
}

export const RecentCardSkeleton: React.FC<Props> = ({ className }) => {
	return (
		<div className={cn('bg-white border border-gray-200 overflow-hidden flex flex-col', className)}>
			<Skeleton className="relative aspect-square w-full rounded-none" />
			<div className="p-6 max-sm:p-4 flex flex-col items-center">
				<div className="w-full space-y-2 mb-4 max-sm:mb-2">
					<Skeleton className="h-5 max-sm:h-4 w-full" />
					<Skeleton className="h-5 max-sm:h-4 w-3/4 mx-auto" />
				</div>
			</div>
			<div className="px-6 py-4 max-sm:px-4 max-sm:py-3 border-t border-gray-100 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-4 rounded-full max-sm:h-3.5 max-sm:w-3.5" />
					<Skeleton className="h-4 w-8 max-sm:h-3" />
				</div>
				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-8 max-sm:h-3" />
					<Skeleton className="h-4 w-4 rounded-full max-sm:h-3.5 max-sm:w-3.5" />
				</div>
			</div>
		</div>
	)
}