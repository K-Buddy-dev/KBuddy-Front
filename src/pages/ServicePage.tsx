import { useEffect, useState } from 'react';
import { Navbar } from '@/components/shared/navbar/Navbar';
import { ServiceCard } from '@/components/service';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { counselorService, CounselorListItem } from '@/services/counselorService';
import defaultProfileImage from '@/assets/images/default-profile.png';
import { getCurrentUserUuid } from '@/utils/currentUser';
import { serviceCategories } from '@/constants/serviceCategories';

export function ServicePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || '';
  const [services, setServices] = useState<CounselorListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCounselors = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const result = await counselorService.getCounselors({
          ...(selectedCategory ? { category: selectedCategory } : {}),
          page: 0,
          size: 20,
        });
        setServices(result.content);
      } catch (error) {
        console.error(error);
        setErrorMessage('Unable to load services.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounselors();
  }, [selectedCategory]);

  const handleCategoryClick = (categoryCode: string) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (!categoryCode || selectedCategory === categoryCode) {
      nextSearchParams.delete('category');
    } else {
      nextSearchParams.set('category', categoryCode);
    }

    setSearchParams(nextSearchParams);
  };

  const handleCardClick = (id: string | number, counselorUserUuid?: string | number) => {
    const counselorUuid = String(id);
    const ownerUserUuid = counselorUserUuid ? String(counselorUserUuid) : '';

    navigate(`/service/${counselorUuid}`, {
      state: {
        isMyProfile: Boolean(ownerUserUuid && ownerUserUuid === getCurrentUserUuid()),
      },
    });
  };

  return (
    <>
      <Navbar withSearch={false} />
      <div className="w-full min-h-screen bg-bg-default pb-20">
        <div className="flex flex-col items-start gap-4 px-4 pt-4">
          <div className="flex w-full gap-2 overflow-x-auto pb-1">
            {serviceCategories.map((category) => {
              const isSelected = selectedCategory === category.code;

              return (
                <button
                  key={category.code}
                  type="button"
                  aria-pressed={isSelected}
                  className={`h-9 shrink-0 rounded-full border px-4 text-sm font-medium ${
                    isSelected
                      ? 'border-border-brand-default bg-bg-brand-default text-white'
                      : 'border-border-weak2 bg-white text-text-default'
                  }`}
                  onClick={() => handleCategoryClick(category.code)}
                >
                  {category.label}
                </button>
              );
            })}
          </div>

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
                  onClick={() => handleCardClick(service.counselorId, service.counselorUserUuid)}
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
