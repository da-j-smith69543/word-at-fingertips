import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

export const LoadingSpinner = ({ size = 'md', className, text }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
      <Loader2 className={cn('animate-spin text-gold', sizeClasses[size])} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
};

interface LoadingStateProps {
  isLoading: boolean;
  error?: string | null;
  children: React.ReactNode;
  loadingText?: string;
  errorFallback?: React.ReactNode;
  onRetry?: () => void;
}

export const LoadingState = ({ 
  isLoading, 
  error, 
  children, 
  loadingText = 'Loading...', 
  errorFallback,
  onRetry 
}: LoadingStateProps) => {
  if (error) {
    if (errorFallback) {
      return <>{errorFallback}</>;
    }
    
    return (
      <div className="text-center py-8">
        <div className="text-destructive mb-2">⚠️ {error}</div>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="text-sm text-primary hover:underline"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner text={loadingText} />
      </div>
    );
  }

  return <>{children}</>;
};