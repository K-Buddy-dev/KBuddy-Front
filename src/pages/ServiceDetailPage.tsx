import { useEffect, useRef, useState } from 'react';
import { useLoginPrompt } from '@/hooks/useLoginPrompt';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DetailTopbar } from '@/components/shared/topbar/DetailTopbar';
import { CategoryBadge } from '@/components/service/CategoryBadge';
import { StarRating } from '@/components/service/StarRating';
import { ServiceReviewList } from '@/components/service/ServiceReviewList';
import { ServicePhotoGallery } from '@/components/service/ServicePhotoGallery';
import { ServiceInquiry } from '@/components/service/ServiceInquiry';
import { Button } from '@/components/shared/button/Button';
import defaultProfileImage from '@/assets/images/default-profile.png';
import { counselorService } from '@/services/counselorService';
import type {
  CounselorInquiryDetail,
  CounselorInquiryListItem,
  CounselorReview,
  MyCounselorProfile,
} from '@/services/counselorService';
import { FaEdit, FaExclamationTriangle, FaTimes, FaTrash } from 'react-icons/fa';
import { getCurrentUserUuid } from '@/utils/currentUser';
import { analyticsService } from '@/services/analyticsService';
import { analyticsEvents } from '@/services/analyticsEvents';

type ServiceDetailLocationState = {
  backTo?: string;
  isMyProfile?: boolean;
  service?: MyCounselorProfile;
};

export function ServiceDetailPage() {
  const navigate = useNavigate();
  const { requireLogin } = useLoginPrompt();
  const location = useLocation();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'Info' | 'Review' | 'Photo' | 'Inquiry'>('Info');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const routeState = location.state as ServiceDetailLocationState | null;
  const passedService = routeState?.service;
  const passedIsMyProfile = typeof routeState?.isMyProfile === 'boolean' ? routeState.isMyProfile : undefined;
  const [service, setService] = useState(() =>
    passedService ? mapCounselorProfileToServiceDetail(passedService) : null
  );
  const [requestBlockedMessage, setRequestBlockedMessage] = useState('');
  const [isLoading, setIsLoading] = useState(!passedService);
  const [errorMessage, setErrorMessage] = useState('');
  const [reviews, setReviews] = useState<CounselorReview[]>(() => passedService?.recentReviews || []);
  const [reviewTotalCount, setReviewTotalCount] = useState(() => passedService?.reviewCount || 0);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [reviewErrorMessage, setReviewErrorMessage] = useState('');
  const [hasLoadedReviews, setHasLoadedReviews] = useState(false);
  const [inquiries, setInquiries] = useState<CounselorInquiryListItem[]>(() =>
    passedService ? getServiceDetailInquiries(passedService).items : []
  );
  const [inquiryTotalCount, setInquiryTotalCount] = useState(() =>
    passedService ? getServiceDetailInquiries(passedService).totalCount : 0
  );
  const [isInquiryLoading, setIsInquiryLoading] = useState(false);
  const [inquiryErrorMessage, setInquiryErrorMessage] = useState('');
  const [hasLoadedInquiries, setHasLoadedInquiries] = useState(false);
  const [expandedInquiryId, setExpandedInquiryId] = useState<number | null>(null);
  const [inquiryDetailById, setInquiryDetailById] = useState<Record<number, CounselorInquiryDetail>>({});
  const [loadingInquiryDetailId, setLoadingInquiryDetailId] = useState<number | null>(null);
  const [replyingToInquiryId, setReplyingToInquiryId] = useState<number | null>(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [replyErrorMessage, setReplyErrorMessage] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryTitle, setInquiryTitle] = useState('');
  const [inquiryContent, setInquiryContent] = useState('');
  const [isSecretInquiry, setIsSecretInquiry] = useState(false);
  const [inquiryFormErrorMessage, setInquiryFormErrorMessage] = useState('');
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const currentUserUuid = getCurrentUserUuid();
  const trackedServiceViewIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (passedService || !id) return;

    const fetchServiceDetail = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const profile = await counselorService.getCounselorDetail(id);
        const mappedProfile = mapCounselorProfileToServiceDetail(profile);
        setService(mappedProfile);
        setReviews(mappedProfile.reviews);
        setReviewTotalCount(mappedProfile.reviewCount);
        setInquiries(mappedProfile.inquiries);
        setInquiryTotalCount(mappedProfile.inquiryCount);
      } catch (error) {
        console.error(error);
        setErrorMessage('Unable to load this service.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceDetail();
  }, [id, passedService]);

  useEffect(() => {
    if (activeTab !== 'Review' || !service || hasLoadedReviews) return;

    let isMounted = true;

    const fetchReviews = async () => {
      setIsReviewLoading(true);
      setReviewErrorMessage('');

      try {
        const result = await counselorService.getCounselorReviews(service.id, { page: 0, size: 20 });

        if (!isMounted) return;

        setReviews(result.reviews);
        setReviewTotalCount(result.totalCount);
        setHasLoadedReviews(true);
      } catch (error) {
        console.error(error);

        if (!isMounted) return;

        setReviewErrorMessage('Unable to load reviews.');
      } finally {
        if (isMounted) {
          setIsReviewLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, [activeTab, hasLoadedReviews, service]);

  useEffect(() => {
    if (!service || trackedServiceViewIdRef.current === service.id) return;

    trackedServiceViewIdRef.current = service.id;
    analyticsService.trackEvent(analyticsEvents.serviceViewed, {
      category: service.category1,
      counselor_id: service.id,
      currency: 'KRW',
      value: parseServicePrice(service.price),
    });
  }, [service]);

  useEffect(() => {
    if (activeTab !== 'Inquiry' || !service || hasLoadedInquiries) return;

    let isMounted = true;

    const fetchInquiries = async () => {
      setIsInquiryLoading(true);
      setInquiryErrorMessage('');

      try {
        const result = await counselorService.getCounselorInquiries(service.id, { page: 0, size: 20 });

        if (!isMounted) return;

        setInquiries(result.inquiries);
        setInquiryTotalCount(result.totalCount);
        setHasLoadedInquiries(true);
      } catch (error) {
        console.error(error);

        if (!isMounted) return;

        setInquiryErrorMessage('Unable to load inquiries.');
      } finally {
        if (isMounted) {
          setIsInquiryLoading(false);
        }
      }
    };

    fetchInquiries();

    return () => {
      isMounted = false;
    };
  }, [activeTab, hasLoadedInquiries, service]);

  const handleBack = () => {
    if (routeState?.backTo) {
      navigate(routeState.backTo, { replace: true });
      return;
    }

    navigate(-1);
  };

  const handleBookmark = (event: React.MouseEvent) => {
    event.stopPropagation();
    const nextBookmarked = !isBookmarked;
    setIsBookmarked(nextBookmarked);
    if (service) {
      analyticsService.trackEvent(analyticsEvents.serviceSaved, {
        counselor_id: service.id,
        saved: nextBookmarked,
      });
    }
  };

  const handleRequest = () => {
    if (!service) return;

    if (isMyServiceProfile(service.id, currentUserUuid, passedIsMyProfile)) {
      setRequestBlockedMessage('You cannot request your own counselor profile.');
      return;
    }

    if (!requireLogin('Log in to request this service.')) return;

    analyticsService.trackEvent(analyticsEvents.serviceRequestStarted, {
      counselor_id: service.id,
    });
    navigate(`/service/${service.id}/request`);
  };

  const handleEditService = () => {
    if (!service) return;

    setShowDetailModal(false);
    navigate('/profile/counselor/create', {
      state: {
        mode: 'edit',
        counselorId: service.id,
      },
    });
  };

  const handleDeleteService = async () => {
    setShowDetailModal(false);

    try {
      await counselorService.deleteProfile();
      navigate('/profile?tab=My%20sale', { replace: true });
    } catch (error) {
      console.error(error);
      setRequestBlockedMessage('Unable to delete your counselor profile.');
    }
  };

  const handleSelectInquiry = async (inquiryId: number) => {
    setExpandedInquiryId((currentId) => (currentId === inquiryId ? null : inquiryId));

    if (!service || inquiryDetailById[inquiryId]) return;

    setLoadingInquiryDetailId(inquiryId);
    setInquiryErrorMessage('');

    try {
      const detail = await counselorService.getCounselorInquiryDetail(service.id, inquiryId);
      setInquiryDetailById((currentDetails) => ({
        ...currentDetails,
        [inquiryId]: detail,
      }));
    } catch (error) {
      console.error(error);
      setInquiryErrorMessage('Unable to load inquiry.');
    } finally {
      setLoadingInquiryDetailId(null);
    }
  };

  const handleReplyInquiry = (inquiryId: number) => {
    setReplyingToInquiryId((currentId) => (currentId === inquiryId ? null : inquiryId));
    setReplyDraft('');
    setReplyErrorMessage('');
  };

  const handleSubmitInquiryReply = async (inquiryId: number) => {
    if (!service) return;

    const content = replyDraft.trim();

    if (!content) {
      setReplyErrorMessage('Please enter a reply.');
      return;
    }

    setIsSubmittingReply(true);
    setReplyErrorMessage('');

    try {
      await counselorService.replyToCounselorInquiry(service.id, inquiryId, content);
      analyticsService.trackEvent(analyticsEvents.inquiryReplySubmitted, {
        counselor_id: service.id,
        inquiry_id: inquiryId,
        reply_length: content.length,
      });
      const detail = await counselorService.getCounselorInquiryDetail(service.id, inquiryId);
      setInquiryDetailById((currentDetails) => ({
        ...currentDetails,
        [inquiryId]: detail,
      }));
      setReplyDraft('');
      setReplyingToInquiryId(null);
    } catch (error) {
      console.error(error);
      setReplyErrorMessage('Unable to post reply.');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const refreshInquiries = async () => {
    if (!service) return;

    const result = await counselorService.getCounselorInquiries(service.id, { page: 0, size: 20 });
    setInquiries(result.inquiries);
    setInquiryTotalCount(result.totalCount);
    setHasLoadedInquiries(true);
  };

  const handleSubmitInquiry = async () => {
    if (!service) return;

    const title = inquiryTitle.trim();
    const content = inquiryContent.trim();

    if (!title || !content) {
      setInquiryFormErrorMessage('Please enter a title and content.');
      return;
    }

    if (!requireLogin('Log in to ask a question.')) return;

    setIsSubmittingInquiry(true);
    setInquiryFormErrorMessage('');

    try {
      await counselorService.createCounselorInquiry(service.id, {
        content,
        isSecret: isSecretInquiry,
        title,
      });
      analyticsService.trackEvent(analyticsEvents.inquirySubmitted, {
        counselor_id: service.id,
        content_length: content.length,
        is_secret: isSecretInquiry,
        title_length: title.length,
      });
      await refreshInquiries();
      setInquiryTitle('');
      setInquiryContent('');
      setIsSecretInquiry(false);
      setShowInquiryForm(false);
    } catch (error) {
      console.error(error);
      setInquiryFormErrorMessage('Unable to submit inquiry.');
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  const tabs = [
    { id: 'Info' as const, label: 'Info' },
    { id: 'Review' as const, label: 'Review' },
    { id: 'Photo' as const, label: 'Photo' },
    { id: 'Inquiry' as const, label: 'Inquiry' },
  ];

  if (isLoading) {
    return <div className="w-full min-h-screen flex items-center justify-center bg-bg-default">Loading service...</div>;
  }

  if (!service) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-bg-default">
        {errorMessage || 'Service not found.'}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-bg-default pb-32">
      {requestBlockedMessage && (
        <OwnProfileRequestBlockedModal message={requestBlockedMessage} onClose={() => setRequestBlockedMessage('')} />
      )}

      {showInquiryForm && (
        <InquiryFormModal
          content={inquiryContent}
          errorMessage={inquiryFormErrorMessage}
          isSecret={isSecretInquiry}
          isSubmitting={isSubmittingInquiry}
          onClose={() => {
            setShowInquiryForm(false);
            setInquiryFormErrorMessage('');
          }}
          onContentChange={setInquiryContent}
          onIsSecretChange={setIsSecretInquiry}
          onSubmit={handleSubmitInquiry}
          onTitleChange={setInquiryTitle}
          title={inquiryTitle}
        />
      )}

      {/* Top Bar */}
      <DetailTopbar
        title={service.title}
        type="back"
        isBookmarked={isBookmarked}
        showDetailModal={showDetailModal}
        onBack={handleBack}
        onBookmark={handleBookmark}
        setShowDetailModal={setShowDetailModal}
      />

      {showDetailModal && (
        <ServiceDetailMenuModal
          isMyProfile={isMyServiceProfile(service.id, currentUserUuid, passedIsMyProfile)}
          onDelete={handleDeleteService}
          onEdit={handleEditService}
          onClose={() => setShowDetailModal(false)}
          onReport={() => {
            alert('신고가 접수되었습니다.');
            setShowDetailModal(false);
          }}
        />
      )}

      {/* Hero Image */}
      <div className="relative w-full h-[197px] mt-14">
        <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/25" />
        <div className="absolute bottom-2 left-4">
          <CategoryBadge type={service.categoryType} />
        </div>
      </div>

      {/* Service Info */}
      <div className="flex flex-col items-start px-4 py-3 bg-bg-default border-b border-border-weak2">
        <h1 className="w-full text-text-default font-roboto text-body-100-medium font-medium leading-6 tracking-[0.15px] line-clamp-2 mb-2">
          {service.title}
        </h1>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-text-weak font-roboto text-label-300-heavy font-medium leading-3 tracking-[0.24px]">
            {service.sellerId}
          </span>
          <div className="flex items-center gap-1">
            <StarRating rating={service.rating} size="small" />
            <span className="text-text-default font-roboto text-label-300-heavy font-medium leading-3 tracking-[0.24px]">
              {service.rating}
            </span>
          </div>
        </div>
        <span className="text-text-weak font-roboto text-label-300-light font-normal leading-4">
          {service.category1} | {service.category2}
        </span>

        {/* Duration and Price */}
        <div className="flex w-full justify-end items-center px-3 h-9 rounded-lg bg-bg-medium mt-3">
          <div className="flex items-center gap-2">
            <span className="text-text-weak font-roboto text-label-300-heavy font-medium leading-3 tracking-[0.24px]">
              {service.duration}
            </span>
            <span className="text-text-default font-roboto text-body-200-medium font-medium leading-5 tracking-[0.25px]">
              {service.price}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-14 bg-bg-default shadow-hover z-10">
        <div className="flex w-full h-[50px] px-4 items-start">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-2 flex-1 pt-4 ${
                activeTab === tab.id ? 'flex-shrink-0' : 'h-[35px]'
              }`}
            >
              <span
                className={`text-center font-roboto text-body-100-medium font-medium leading-6 tracking-[0.15px] ${
                  activeTab === tab.id ? 'text-text-brand-default' : 'text-text-weak'
                }`}
              >
                {tab.label}
              </span>
              {activeTab === tab.id && <div className="w-full h-[3px] bg-bg-brand-default" />}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="w-full pb-28">
        {activeTab === 'Info' && (
          <div className="flex flex-col">
            {/* Info Section */}
            <div className="flex px-4 items-start gap-2">
              <div className="flex flex-col w-full pt-6 pb-4">
                <h2 className="text-text-default font-roboto text-title-200-medium font-medium leading-6 tracking-[0.15px] mb-4">
                  Info
                </h2>
                <p className="text-text-default font-roboto text-body-200-light font-normal leading-5 tracking-[0.25px] whitespace-pre-line">
                  {service.description}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-2 bg-border-weak2" />

            {/* Reviews Section */}
            <ServiceReviewList rating={service.rating} reviewCount={service.reviewCount} reviews={service.reviews} />

            {/* Divider */}
            <div className="w-full h-2 bg-border-weak2 mt-6" />

            {/* Photo Section */}
            <ServicePhotoGallery photoUrls={service.photoUrls} compact />

            {/* Divider */}
            <div className="w-full h-2 bg-border-weak2 mt-6" />

            {/* Inquiry Section */}
            <ServiceInquiry compact inquiries={service.inquiries} totalCount={service.inquiryCount} />
          </div>
        )}

        {activeTab === 'Review' && (
          <ServiceReviewList
            errorMessage={reviewErrorMessage}
            isLoading={isReviewLoading}
            rating={service.rating}
            reviewCount={hasLoadedReviews ? reviewTotalCount : service.reviewCount}
            reviews={reviews}
            showAll
          />
        )}

        {activeTab === 'Photo' && <ServicePhotoGallery photoUrls={service.photoUrls} />}

        {activeTab === 'Inquiry' && (
          <ServiceInquiry
            detailById={inquiryDetailById}
            errorMessage={inquiryErrorMessage}
            expandedInquiryId={expandedInquiryId}
            inquiries={inquiries}
            isLoading={isInquiryLoading}
            isSubmittingReply={isSubmittingReply}
            loadingDetailId={loadingInquiryDetailId}
            onAskSeller={() => setShowInquiryForm(true)}
            onReply={handleReplyInquiry}
            onReplyDraftChange={setReplyDraft}
            onSelectInquiry={handleSelectInquiry}
            onSubmitReply={handleSubmitInquiryReply}
            replyDraft={replyDraft}
            replyingTo={replyingToInquiryId}
            replyErrorMessage={replyErrorMessage}
            totalCount={inquiryTotalCount}
          />
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-4 left-0 right-0 z-20">
        <div className="w-full max-w-[600px] mx-auto px-4">
          <div className="flex items-center justify-between rounded-lg border border-border-weak2 bg-white px-4 py-3 shadow-default">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <span className="text-text-default font-roboto text-body-100-medium font-medium leading-6 tracking-[0.15px]">
                  {service.price}
                </span>
                <span className="text-text-weak font-roboto text-label-300-heavy font-bold leading-4">
                  {service.duration}
                </span>
              </div>
              <span className="text-text-weak font-roboto text-label-300-light font-normal leading-4">
                Minimum {service.minimumDuration} is required
              </span>
            </div>
            <Button variant="solid" color="primary" size="medium" onClick={handleRequest} className="h-10">
              Request
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InquiryFormModal({
  content,
  errorMessage,
  isSecret,
  isSubmitting,
  onClose,
  onContentChange,
  onIsSecretChange,
  onSubmit,
  onTitleChange,
  title,
}: {
  content: string;
  errorMessage: string;
  isSecret: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onContentChange: (value: string) => void;
  onIsSecretChange: (value: boolean) => void;
  onSubmit: () => void;
  onTitleChange: (value: string) => void;
  title: string;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40 px-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-form-title"
        className="w-full max-w-[360px] rounded-lg bg-white p-5 shadow-default"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2
            id="inquiry-form-title"
            className="text-text-default font-roboto text-title-200-medium font-medium leading-6"
          >
            Ask the seller
          </h2>
          <button type="button" className="text-text-weak font-roboto text-body-100-medium" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-text-default font-roboto text-label-300-heavy font-medium">
            Title
            <input
              className="h-11 rounded-lg border border-border-default px-3 text-text-default font-roboto text-body-200-light outline-none focus:border-border-brand"
              onChange={(event) => onTitleChange(event.target.value)}
              value={title}
            />
          </label>

          <label className="flex flex-col gap-1 text-text-default font-roboto text-label-300-heavy font-medium">
            Content
            <textarea
              className="min-h-[120px] rounded-lg border border-border-default px-3 py-2 text-text-default font-roboto text-body-200-light outline-none focus:border-border-brand"
              onChange={(event) => onContentChange(event.target.value)}
              value={content}
            />
          </label>

          <label className="flex items-center gap-2 text-text-default font-roboto text-body-200-light">
            <input type="checkbox" checked={isSecret} onChange={(event) => onIsSecretChange(event.target.checked)} />
            Secret inquiry
          </label>

          {errorMessage && (
            <p className="text-text-danger-default font-roboto text-label-300-heavy leading-3">{errorMessage}</p>
          )}

          <Button
            type="button"
            variant="solid"
            color="primary"
            size="medium"
            className="mt-2 w-full"
            disabled={isSubmitting || !title.trim() || !content.trim()}
            onClick={onSubmit}
          >
            Submit inquiry
          </Button>
        </div>
      </div>
    </div>
  );
}

function isMyServiceProfile(counselorUuid: string, currentUserUuid: string, passedIsMyProfile?: boolean) {
  if (passedIsMyProfile !== undefined) return passedIsMyProfile;
  return Boolean(currentUserUuid && String(counselorUuid) === String(currentUserUuid));
}

function OwnProfileRequestBlockedModal({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40" onClick={onClose}>
      <div
        role="alert"
        className="mx-4 w-full max-w-[360px] rounded-lg bg-white px-5 py-5 shadow-default"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-text-default font-roboto text-[16px] font-medium leading-6">{message}</p>
        <div className="mt-4 flex justify-end">
          <Button type="button" variant="solid" color="primary" size="medium" className="h-10 px-6" onClick={onClose}>
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}

function ServiceDetailMenuModal({
  isMyProfile,
  onClose,
  onDelete,
  onEdit,
  onReport,
}: {
  isMyProfile: boolean;
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onReport: () => void;
}) {
  return (
    <div className="fixed inset-0 z-30 bg-black bg-opacity-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-lg" onClick={(event) => event.stopPropagation()}>
        <div className="w-full flex items-center justify-end px-4 py-4 border-b-2">
          <button className="text-gray-500 hover:text-gray-700 focus:outline-none" onClick={onClose}>
            <span className="sr-only">close menu</span>
            <FaTimes size={20} />
          </button>
        </div>
        <div className="w-full flex flex-col items-start px-4">
          {!isMyProfile && (
            <button
              className="w-full py-[21px] px-2 text-text-danger-default font-semibold flex items-center"
              onClick={onReport}
            >
              <FaExclamationTriangle className="mr-2" /> Report this service
            </button>
          )}
          {isMyProfile && (
            <>
              <button
                className="w-full py-[21px] px-2 text-text-default font-semibold border-b-2 flex items-center"
                onClick={onEdit}
              >
                <FaEdit className="mr-2" /> Edit this content
              </button>
              <button
                className="w-full py-[21px] px-2 text-text-default font-semibold flex items-center"
                onClick={onDelete}
              >
                <FaTrash className="mr-2" /> Delete this content
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function mapCounselorProfileToServiceDetail(profile: MyCounselorProfile) {
  const categories = Array.isArray(profile.categories) ? profile.categories : [];
  const inquiries = getServiceDetailInquiries(profile);
  const sessionMinutes = typeof profile.sessionMinutes === 'number' ? profile.sessionMinutes : 0;
  const regularPrice = typeof profile.regularPrice === 'number' ? profile.regularPrice : 0;
  const recentReviews = Array.isArray(profile.recentReviews) ? profile.recentReviews : [];
  const rating = typeof profile.ratingAvg === 'number' ? profile.ratingAvg : 0;

  return {
    category1: categories[0] || 'No category',
    category2: categories.slice(1).join(' | '),
    categoryType: '1:1 Chat' as const,
    description: profile.detail,
    duration: `${sessionMinutes} min`,
    id: profile.id,
    imageUrl: profile.coverImageUrl || profile.profileImageUrl || defaultProfileImage,
    inquiries: inquiries.items,
    inquiryCount: inquiries.totalCount,
    minimumDuration: `${sessionMinutes} min.`,
    photoCount: Array.isArray(profile.photoUrls) ? profile.photoUrls.length : 0,
    photoUrls: Array.isArray(profile.photoUrls) ? profile.photoUrls : [],
    price: `${regularPrice.toLocaleString()} won`,
    rating,
    reviewCount: typeof profile.reviewCount === 'number' ? profile.reviewCount : recentReviews.length,
    reviews: recentReviews,
    sellerId: `@${profile.name}`,
    title: profile.title,
  };
}

function getServiceDetailInquiries(profile: MyCounselorProfile): {
  items: CounselorInquiryListItem[];
  totalCount: number;
} {
  const inquiryField = profile.inquiry;
  const items = Array.isArray(profile.inquiries)
    ? profile.inquiries
    : Array.isArray(profile.recentInquiries)
      ? profile.recentInquiries
      : Array.isArray(inquiryField)
        ? inquiryField
        : inquiryField && Array.isArray(inquiryField.inquiries)
          ? inquiryField.inquiries
          : [];

  const totalCount =
    typeof profile.inquiryCount === 'number'
      ? profile.inquiryCount
      : inquiryField && !Array.isArray(inquiryField) && typeof inquiryField.totalCount === 'number'
        ? inquiryField.totalCount
        : items.length;

  return { items, totalCount };
}

function parseServicePrice(price: string) {
  const numericPrice = Number(price.replace(/[^\d]/g, ''));
  return Number.isFinite(numericPrice) ? numericPrice : 0;
}
