import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const Step3Loading = () => {
    return (
        <div className="w-full px-[116px] flex flex-col gap-6 py-6 min-h-screen">
            {/* Top Bar Loader */}
            <div className="flex items-center justify-between gap-20">
                <div className="min-w-[600px] h-[92px] p-4 bg-white rounded-5xl flex flex-col gap-2 border-[1px] border-[rgba(224,224,224,0.65)] [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)]">
                    <Skeleton className="h-4 w-[250px] mb-4 bg-gray-300 dark:bg-gray-500" />
                    <Skeleton className="h-4 w-[250px] mb-4 bg-gray-300 dark:bg-gray-500" />
                </div>
                <div className="min-w-[450px] h-[92px] bg-white rounded-5xl px-4 py-[25px] flex items-center gap-2 [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)]">
                    <Skeleton className="w-4 h-4" />
                    <Skeleton className="text-[#7C7C7C] font-normal text-sm block max-w-[418px]" />
                </div>
            </div>

            {/* Choose Question Type Loader */}
            <div className="bg-white rounded-3xl p-8 mt-6">
                <Skeleton className="h-6 w-[200px] mb-4" />
                <div className="grid grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            </div>

            {/* Question Sequence Loader */}
            <div className="bg-white rounded-3xl p-8 mt-6">
                <Skeleton className="h-6 w-[200px] mb-4" />
                <div className="flex flex-col gap-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-6 w-8" />
                            <Skeleton className="h-6 w-[300px]" />
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Step3Loading;