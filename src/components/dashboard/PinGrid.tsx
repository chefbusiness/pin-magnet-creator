import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PinCard } from './PinCard';
import { EmptyState } from './EmptyState';

interface Pin {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  status: string;
  created_at: string;
  template_style?: string;
}

interface PinGridProps {
  pins: Pin[];
  loading: boolean;
  loadingMore?: boolean;
  hasMorePins?: boolean;
  onLoadMore?: () => void;
  onDownload: (imageUrl: string, title: string) => void;
  onDelete: (pinId: string) => void;
  deletingId: string | null;
  formatDate: (dateString: string) => string;
}

export function PinGrid({ pins, loading, loadingMore, hasMorePins, onLoadMore, onDownload, onDelete, deletingId, formatDate }: PinGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-40 md:h-48 w-full" />
            <CardContent className="p-3 md:p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (pins.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {pins.map((pin) => (
          <PinCard
            key={pin.id}
            pin={pin}
            onDownload={onDownload}
            onDelete={onDelete}
            isDeleting={deletingId === pin.id}
            formatDate={formatDate}
          />
        ))}
      </div>
      
      {/* Load More Button */}
      {hasMorePins && (
        <div className="flex justify-center">
          <Button
            onClick={onLoadMore}
            disabled={loadingMore}
            variant="outline"
            size="lg"
            className="min-w-[200px]"
          >
            {loadingMore ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Cargando más...
              </>
            ) : (
              'Cargar más pines'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}