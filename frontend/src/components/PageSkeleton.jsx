import { SkeletonBlock } from "./Skeleton";

export default function PageSkeleton() {
  return (
    <div className="space-y-6 pr-4">
      <div>
        <SkeletonBlock className="h-8 w-48 mb-2" />
        <SkeletonBlock className="h-4 w-72" />
      </div>
      <SkeletonBlock className="h-64 w-full rounded-2xl" />
      <SkeletonBlock className="h-64 w-full rounded-2xl" />
    </div>
  );
}