import { useEffect, useState } from 'react';
import { Navbar } from '@/components/shared/navbar/Navbar';
import { ServiceCard } from '@/components/service';
import { useNavigate } from 'react-router-dom';
import { counselorService, CounselorListItem } from '@/services/counselorService';
import defaultProfileImage from '@/assets/images/default-profile.png';
import { getCurrentUserUuid } from '@/utils/currentUser';

export function ServicePage() {
  const navigate = useNavigate();
  const [services, setServices] = useState<CounselorListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCounselors = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const result = await counselorService.getCounselors({ page: 0, size: 20 });
        setServices(result.content);
      } catch (error) {
        console.error(error);
        setErrorMessage('Unable to load services.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounselors();
  }, []);

  const handleCardClick = (id: string | number) => {
    const counselorUuid = String(id);

    navigate(`/service/${counselorUuid}`, {
      state: {
        isMyProfile: counselorUuid === getCurrentUserUuid(),
      },
    });
  };

  return (
    <>
      <Navbar withSearch={false} />
      <div className="w-full min-h-screen bg-bg-default pb-20">
        <div className="flex flex-col items-start gap-4 px-4 pt-4">
          {isLoading && <div className="w-full py-10 text-center text-text-weak">Loading services...</div>}
          {!isLoading && errorMessage && (
            <div className="w-full py-10 text-center text-text-danger-default">{errorMessage}</div>
          )}
          {!isLoading && !errorMessage && services.length === 0 && (
            <div className="w-full py-10 text-center text-text-weak">No services available.</div>
          )}
          {!isLoading &&
            !errorMessage &&
            services.map((service) => {
              const viewModel = mapCounselorToServiceCard(service);

              return (
                <ServiceCard
                  key={service.counselorId}
                  {...viewModel}
                  onClick={() => handleCardClick(service.counselorId)}
                />
              );
            })}
        </div>
      </div>
    </>
  );
}

function mapCounselorToServiceCard(service: CounselorListItem) {
  return {
    imageUrl: service.coverImageUrl || defaultProfileImage,
    title: service.title,
    sellerId: `@${service.name}`,
    rating: service.ratingAvg,
    categoryName: service.categories.join(' | ') || 'No category',
    duration: `${service.sessionMinutes} min`,
    price: `${service.regularPrice.toLocaleString()} won`,
    badgeType: service.hasPromotion ? ('trending' as const) : undefined,
    categoryType: '1:1 Chat' as const,
  };
}
