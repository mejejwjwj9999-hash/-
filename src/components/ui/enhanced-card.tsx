
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EnhancedCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  gradient?: boolean;
  hover?: boolean;
}

const EnhancedCard: React.FC<EnhancedCardProps> = ({
  title,
  children,
  className,
  loading = false,
  gradient = false,
  hover = true,
}) => {
  if (loading) {
    return (
      <Card className={cn(
        "animate-pulse bg-gradient-to-br from-muted/50 to-muted/30",
        className
      )}>
        <CardHeader>
          <div className="h-6 bg-muted rounded-md w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "transition-all duration-300 border-0 shadow-soft",
      gradient && "bg-gradient-to-br from-background via-background to-muted/20",
      hover && "hover:shadow-university hover:scale-[1.02] hover:border-university-blue/20",
      "backdrop-blur-sm bg-background/95",
      className
    )}>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-card-title text-university-blue flex items-center gap-2">
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
};

export default EnhancedCard;
