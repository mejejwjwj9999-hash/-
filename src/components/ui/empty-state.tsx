import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  children,
  className = ''
}) => {
  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-8 text-center">
        {Icon && (
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Icon className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
        )}
        
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {title}
        </h3>
        
        {description && (
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {description}
          </p>
        )}
        
        {action && (
          <Button onClick={action.onClick} className="mb-4">
            {action.label}
          </Button>
        )}
        
        {children}
      </CardContent>
    </Card>
  );
};

export default EmptyState;