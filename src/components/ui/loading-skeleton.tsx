import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'table' | 'dashboard' | 'chart';
  count?: number;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  variant = 'card', 
  count = 3,
  className = ''
}) => {
  const Skeleton = ({ className }: { className: string }) => (
    <div className={`animate-pulse bg-muted rounded ${className}`} />
  );

  const CardSkeleton = () => (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </CardContent>
    </Card>
  );

  const ListSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 rtl:space-x-reverse">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  const TableSkeleton = () => (
    <div className="space-y-3">
      <div className="flex space-x-4 rtl:space-x-reverse">
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 flex-1" />
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex space-x-4 rtl:space-x-reverse">
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 flex-1" />
        </div>
      ))}
    </div>
  );

  const DashboardSkeleton = () => (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Main content */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (variant) {
      case 'list':
        return <ListSkeleton />;
      case 'table':
        return <TableSkeleton />;
      case 'dashboard':
        return <DashboardSkeleton />;
      case 'chart':
        return (
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-64 w-full" />
          </div>
        );
      case 'card':
      default:
        return (
          <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        );
    }
  };

  return (
    <div className={className}>
      {renderSkeleton()}
    </div>
  );
};

export default LoadingSkeleton;