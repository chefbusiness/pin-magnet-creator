import { useState } from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { usePins } from '@/hooks/usePins';
import { useLanguage } from '@/contexts/LanguageContext';
import { Navigate } from 'react-router-dom';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { PinGrid } from '@/components/dashboard/PinGrid';

const Dashboard = () => {
  const { user, profile, getRemainingPins } = useAuth();
  const { pins, loading, deletePin, downloadImage } = usePins();
  const { t } = useLanguage();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleDelete = async (pinId: string) => {
    setDeletingId(pinId);
    const success = await deletePin(pinId);
    setDeletingId(null);
  };

  const handleDownload = async (imageUrl: string, title: string) => {
    if (imageUrl) {
      await downloadImage(imageUrl, title);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground mb-6 text-sm md:text-base">
            {t('dashboard.subtitle')}
          </p>
          
          <StatsCards
            totalPins={pins.length}
            pinsThisMonth={profile?.pins_generated_this_month || 0}
            remainingPins={getRemainingPins()}
          />
        </div>

        <PinGrid
          pins={pins}
          loading={loading}
          onDownload={handleDownload}
          onDelete={handleDelete}
          deletingId={deletingId}
          formatDate={formatDate}
        />
      </div>
    </div>
  );
};

export default Dashboard;