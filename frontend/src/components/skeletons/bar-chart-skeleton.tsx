import { Skeleton } from '../ui/skeleton';

const BarChartSkeleton = () => {
  return (
    <div className="grid h-[250px] grid-cols-12 gap-3 p-4">
      <div className="col-span-1 flex flex-col justify-end gap-2">
        <Skeleton className="h-[10%] w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="col-span-1 flex flex-col justify-end gap-2">
        <Skeleton className="h-[18%] w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="col-span-1 flex flex-col justify-end gap-4">
        <Skeleton className="h-[20%] w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="col-span-1 flex flex-col justify-end gap-4">
        <Skeleton className="h-[23%] w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="col-span-1 flex flex-col justify-end gap-4">
        <Skeleton className="h-[24%] w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="col-span-1 flex flex-col justify-end gap-4">
        <Skeleton className="h-[25%] w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="col-span-1 flex flex-col justify-end gap-4">
        <Skeleton className="h-[40%] w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="col-span-1 flex flex-col justify-end gap-4">
        <Skeleton className="h-[43%] w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="col-span-1 flex flex-col justify-end gap-4">
        <Skeleton className="h-[63%] w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="col-span-1 flex flex-col justify-end gap-4">
        <Skeleton className="h-[64%] w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="col-span-1 flex flex-col justify-end gap-4">
        <Skeleton className="h-[95%] w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="col-span-1 flex flex-col justify-end gap-4">
        <Skeleton className="h-[100%] w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
};

export default BarChartSkeleton;
