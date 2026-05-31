import { ChangeEvent, Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import defaultProfileImage from '@/assets/images/default-profile.png';
import { Button } from '@/components/shared/button/Button';
import { Calendar } from '@/components/shared/calendar/Calendar';
import { LeftArrowTriangle, RightArrowTriangle, XIcon } from '@/components/shared/icon';
import { TimeSlotPicker } from '@/components/shared/time-slot-picker/TimeSlotPicker';
import { counselorService, CounselorAvailabilitySlot, MyCounselorProfile } from '@/services/counselorService';
import { parseUtcDateTime } from '@/utils/utcDateTime';

const steps = [{ label: 'Basic info' }, { label: 'Details of service' }, { label: 'Review & submit' }];

const categoryOptions = [
  'Restaurant',
  'Cafe/Dessert',
  'Shopping',
  'Attraction',
  'Lodging',
  'Nature',
  'Art',
  'Beauty/Spa',
  'Transportation',
  'Health',
  'Daily Life',
  'Others',
];

const categoryCodeByLabel: Record<string, string> = {
  Art: 'ART',
  Attraction: 'ATTRACTION',
  'Beauty/Spa': 'BEAUTY_SPA',
  'Cafe/Dessert': 'CAFE_DESSERT',
  'Daily Life': 'DAILY_LIFE',
  Health: 'HEALTH',
  Lodging: 'LODGING',
  Nature: 'NATURE',
  Others: 'OTHERS',
  Restaurant: 'RESTAURANT',
  Shopping: 'SHOPPING',
  Transportation: 'TRANSPORTATION',
};

const categoryLabelByCode = Object.entries(categoryCodeByLabel).reduce<Record<string, string>>(
  (labelsByCode, [label, code]) => ({
    ...labelsByCode,
    [code]: label,
  }),
  {}
);

type CounselorProfileCreateLocationState = {
  counselorId?: string;
  mode?: 'create' | 'edit';
};

type BasicInfoState = {
  additionalPhotoFiles: File[];
  additionalPhotoUrls: string[];
  coverImageFile: File | null;
  coverPreviewUrl: string;
  detail: string;
  professionalBackground: string;
  proofFiles: File[];
  proofFileNames: string[];
  title: string;
};

type AvailabilityState = {
  endDate: Date;
  endTime: string;
  label: string;
  startDate: Date;
  startTime: string;
};

type ServiceDetailsState = {
  amountOfTime: string;
  availabilities: AvailabilityState[];
  availableDates: string[];
  price: string;
  promotionEndDate: string;
  promotionStartDate: string;
  promotionalPrice: string;
  sessionMinutes: string;
  shouldSubmitSlots: boolean;
};

type AvailabilitySelectionMode = 'single' | 'range';

const defaultBasicInfo: BasicInfoState = {
  additionalPhotoFiles: [],
  additionalPhotoUrls: [],
  coverImageFile: null,
  coverPreviewUrl: defaultProfileImage,
  detail:
    'Lorem ipsum dolor sit amet consectetur. Urna lacus ut pellentesque potenti cursus. Nunc aliquet tortor tempus duis aenean. Ultrices nulla laoreet venenatis tristique ac felis.',
  professionalBackground:
    'Lorem ipsum dolor sit amet consectetur. Urna lacus ut pellentesque potenti cursus. Nunc aliquet tortor.',
  proofFiles: [],
  proofFileNames: [],
  title: 'Lorem ipsum dolor sit amet consectetur.',
};

const defaultServiceDetails: ServiceDetailsState = {
  amountOfTime: '',
  availabilities: [],
  availableDates: [],
  price: '',
  promotionEndDate: '',
  promotionStartDate: '',
  promotionalPrice: '',
  sessionMinutes: '',
  shouldSubmitSlots: false,
};

export function CounselorProfileCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = location.state as CounselorProfileCreateLocationState | null;
  const isEditMode = routeState?.mode === 'edit';
  const editCounselorId = routeState?.counselorId;
  const [currentStep, setCurrentStep] = useState(0);
  const [basicInfo, setBasicInfo] = useState<BasicInfoState>(defaultBasicInfo);
  const [serviceDetails, setServiceDetails] = useState<ServiceDetailsState>(defaultServiceDetails);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(isEditMode && Boolean(editCounselorId));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitBlockers = getSubmitBlockers({ basicInfo, isEditMode, selectedCategories, serviceDetails });
  const serviceDetailsStepBlockers = getServiceDetailsStepBlockers(serviceDetails);

  const canSubmit = submitBlockers.length === 0;
  const isNextDisabled = currentStep === 1 && serviceDetailsStepBlockers.length > 0;

  useEffect(() => {
    if (!isEditMode || !editCounselorId) return;

    const fetchCounselorProfile = async () => {
      setIsLoadingProfile(true);

      try {
        const [profile, availabilitySlots] = await Promise.all([
          counselorService.getCounselorDetail(editCounselorId),
          getEditableCounselorAvailabilitySlots(editCounselorId),
        ]);
        const initialFormState = mapCounselorProfileToFormState(profile, availabilitySlots);
        setBasicInfo(initialFormState.basicInfo);
        setServiceDetails(initialFormState.serviceDetails);
        setSelectedCategories(initialFormState.selectedCategories);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchCounselorProfile();
  }, [editCounselorId, isEditMode]);

  const handleBack = () => {
    if (currentStep === 0) {
      navigate(-1);
      return;
    }

    setCurrentStep((step) => step - 1);
  };

  const handleNext = () => {
    if (isNextDisabled) return;
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formData = buildCounselorProfileFormData({
        basicInfo,
        includeSlots: !isEditMode || serviceDetails.shouldSubmitSlots,
        isEditMode,
        serviceDetails,
        selectedCategories,
      });

      if (isEditMode) {
        await counselorService.updateProfile(formData);
      } else {
        await counselorService.registerProfile(formData);
      }
      navigate('/profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg-default pb-32 font-roboto text-text-default">
      <header className="bg-white">
        <div className="flex h-[44px] items-center justify-between px-5 text-[12px] font-medium">
          <span>9:30</span>
          <div className="h-5 w-5 rounded-full bg-[#15151C]" />
          <div className="flex items-center gap-1">
            <div className="h-3 w-4 rounded-sm bg-border-weak1" />
            <div className="h-4 w-4 bg-text-default" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
            <div className="h-4 w-2 rounded-sm bg-text-default" />
          </div>
        </div>

        <div className="flex h-12 items-center justify-between px-3">
          <button
            type="button"
            onClick={() => navigate('/profile?tab=My%20sale')}
            className="rounded-full border border-border-default px-3 py-1 text-[12px] font-medium"
          >
            Save & exit
          </button>
          <button type="button" className="rounded-full border border-border-default px-3 py-1 text-[12px] font-medium">
            ? Help
          </button>
        </div>
      </header>

      <StepProgress currentStep={currentStep} />

      {isLoadingProfile && (
        <div className="px-4 py-8 text-center text-[14px] font-medium text-text-weak">Loading counselor profile...</div>
      )}

      {!isLoadingProfile && currentStep === 0 && (
        <BasicInfoStep basicInfo={basicInfo} onBasicInfoChange={setBasicInfo} />
      )}
      {!isLoadingProfile && currentStep === 1 && (
        <ServiceDetailsStep
          serviceDetails={serviceDetails}
          serviceDetailsStepBlockers={serviceDetailsStepBlockers}
          onServiceDetailsChange={setServiceDetails}
        />
      )}
      {!isLoadingProfile && currentStep === 2 && (
        <ReviewSubmitStep
          basicInfo={basicInfo}
          serviceDetails={serviceDetails}
          selectedCategories={selectedCategories}
          submitBlockers={submitBlockers}
          onEditBasicInfo={() => setCurrentStep(0)}
          onEditServiceDetails={() => setCurrentStep(1)}
          onSelectedCategoriesChange={setSelectedCategories}
        />
      )}

      <div className="fixed bottom-0 left-0 right-0 flex h-20 w-full items-start border-t border-border-weak1 bg-white">
        <div className="mx-auto flex w-full max-w-[600px] items-center justify-between px-4 pt-3">
          <Button variant="link" color="secondary" size="medium" onClick={handleBack} className="h-10 px-2 underline">
            Back
          </Button>
          <Button
            variant="solid"
            color="primary"
            size="medium"
            onClick={currentStep === steps.length - 1 ? handleSubmit : handleNext}
            disabled={isNextDisabled || (currentStep === steps.length - 1 && (!canSubmit || isSubmitting))}
            className="h-10 px-8"
          >
            {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function BasicInfoStep({
  basicInfo,
  onBasicInfoChange,
}: {
  basicInfo: BasicInfoState;
  onBasicInfoChange: Dispatch<SetStateAction<BasicInfoState>>;
}) {
  const [currentAdditionalPhotoIndex, setCurrentAdditionalPhotoIndex] = useState(0);
  const [isEditingAdditionalPhotos, setIsEditingAdditionalPhotos] = useState(false);
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const proofFileInputRef = useRef<HTMLInputElement>(null);
  const additionalPhotoInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    onBasicInfoChange((currentInfo) => ({
      ...currentInfo,
      coverImageFile: file,
      coverPreviewUrl: URL.createObjectURL(file),
    }));
  };

  const handleProofFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) return;

    onBasicInfoChange((currentInfo) => ({
      ...currentInfo,
      proofFiles: [...currentInfo.proofFiles, ...files],
      proofFileNames: [...currentInfo.proofFileNames, ...files.map((file) => file.name)],
    }));
    event.target.value = '';
  };

  const handleAdditionalPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) return;

    onBasicInfoChange((currentInfo) => ({
      ...currentInfo,
      additionalPhotoFiles: [...currentInfo.additionalPhotoFiles, ...files],
      additionalPhotoUrls: [...currentInfo.additionalPhotoUrls, ...files.map((file) => URL.createObjectURL(file))],
    }));
    event.target.value = '';
  };

  const removeAdditionalPhoto = (photoIndex: number) => {
    onBasicInfoChange((currentInfo) => ({
      ...currentInfo,
      additionalPhotoFiles: currentInfo.additionalPhotoFiles.filter((_, index) => index !== photoIndex),
      additionalPhotoUrls: currentInfo.additionalPhotoUrls.filter((_, index) => index !== photoIndex),
    }));
    setCurrentAdditionalPhotoIndex((currentIndex) =>
      Math.max(0, Math.min(currentIndex, basicInfo.additionalPhotoUrls.length - 2))
    );
  };

  const moveAdditionalPhoto = (fromIndex: number, toIndex: number) => {
    onBasicInfoChange((currentInfo) => {
      if (toIndex < 0 || toIndex >= currentInfo.additionalPhotoUrls.length) return currentInfo;

      const nextFiles = [...currentInfo.additionalPhotoFiles];
      const nextUrls = [...currentInfo.additionalPhotoUrls];
      const [movedFile] = nextFiles.splice(fromIndex, 1);
      const [movedUrl] = nextUrls.splice(fromIndex, 1);
      nextFiles.splice(toIndex, 0, movedFile);
      nextUrls.splice(toIndex, 0, movedUrl);
      return { ...currentInfo, additionalPhotoFiles: nextFiles, additionalPhotoUrls: nextUrls };
    });
    setCurrentAdditionalPhotoIndex(Math.min(fromIndex, toIndex));
  };

  return (
    <main className="flex flex-col gap-5 px-4 py-5">
      <section>
        <h1 className="text-[16px] font-semibold leading-6">Let’s add your cover image first.</h1>
        <p className="mt-1 text-[14px] leading-5">This image will be the cover image of the market listings.</p>

        <div className="mt-3 border-4 border-[#2787FF]">
          <img src={basicInfo.coverPreviewUrl} alt="Cover preview" className="h-[150px] w-full object-cover" />
        </div>

        <input
          ref={profilePhotoInputRef}
          type="file"
          accept="image/*"
          aria-label="Add profile photo"
          className="hidden"
          onChange={handleProfilePhotoChange}
        />
        <Button
          variant="outline"
          color="secondary"
          size="medium"
          className="mt-4 w-full"
          onClick={() => profilePhotoInputRef.current?.click()}
        >
          Add profile photo
        </Button>
      </section>

      <div className="-mx-4 border-t border-border-weak1" />

      <FormField
        id="listingTitle"
        label="Title of listing"
        value={basicInfo.title}
        onChange={(title) => onBasicInfoChange((currentInfo) => ({ ...currentInfo, title }))}
        rows={2}
        count="21/30"
      />

      <Divider />

      <FormField
        id="detail"
        label="Detail"
        description="Describe what you can offer for a 1:1 live chat session."
        value={basicInfo.detail}
        onChange={(detail) => onBasicInfoChange((currentInfo) => ({ ...currentInfo, detail }))}
        rows={6}
        count="21/30"
      />

      <Divider />

      <FormField
        id="professionalBackground"
        label="Professional Background"
        description="Please describe your professional qualifications for your service and upload at least one supporting image for an evidence."
        value={basicInfo.professionalBackground}
        onChange={(professionalBackground) =>
          onBasicInfoChange((currentInfo) => ({ ...currentInfo, professionalBackground }))
        }
        rows={5}
        count="21/30"
      />

      <section className="flex flex-col gap-2">
        {basicInfo.proofFileNames.map((fileName, index) => (
          <ProofFileItem
            key={`${fileName}-${index}`}
            fileName={fileName}
            onRemove={() =>
              onBasicInfoChange((currentInfo) => ({
                ...currentInfo,
                proofFiles: currentInfo.proofFiles.filter((_, fileIndex) => fileIndex !== index),
                proofFileNames: currentInfo.proofFileNames.filter((_, fileIndex) => fileIndex !== index),
              }))
            }
          />
        ))}
        <input
          ref={proofFileInputRef}
          type="file"
          multiple
          aria-label="Add file of proof"
          className="hidden"
          onChange={handleProofFileChange}
        />
        <Button
          variant="outline"
          color="secondary"
          size="medium"
          className="mt-4 w-full"
          onClick={() => proofFileInputRef.current?.click()}
        >
          Add file of proof
        </Button>
      </section>

      <Divider />

      <section>
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-[14px] font-semibold leading-5">Add photo(s)</h2>
          <span className="text-[12px] text-text-weak">(Optional)</span>
        </div>
        <p className="mt-1 text-[12px] leading-4">
          Upload photos of the location you&apos;ll be planning the itinerary for. Additional photos can help entice
          users to request an itinerary. At least 1 photo for the cover is required.
        </p>
        <input
          ref={additionalPhotoInputRef}
          type="file"
          accept="image/*"
          multiple
          aria-label="Add photo"
          className="hidden"
          onChange={handleAdditionalPhotoChange}
        />
        <Button
          variant="outline"
          color="secondary"
          size="medium"
          className="mt-4 w-full"
          onClick={() => additionalPhotoInputRef.current?.click()}
        >
          Add photo
        </Button>
      </section>

      {basicInfo.additionalPhotoUrls.length > 0 && (
        <AdditionalPhotoGallery
          currentIndex={currentAdditionalPhotoIndex}
          isEditing={isEditingAdditionalPhotos}
          photoUrls={basicInfo.additionalPhotoUrls}
          onEdit={() => setIsEditingAdditionalPhotos((isEditing) => !isEditing)}
          onAddPhotos={() => additionalPhotoInputRef.current?.click()}
          onMovePhoto={moveAdditionalPhoto}
          onPrevious={() => setCurrentAdditionalPhotoIndex((index) => Math.max(0, index - 1))}
          onRemovePhoto={removeAdditionalPhoto}
          onNext={() =>
            setCurrentAdditionalPhotoIndex((index) => Math.min(basicInfo.additionalPhotoUrls.length - 1, index + 1))
          }
        />
      )}
    </main>
  );
}

function ServiceDetailsStep({
  onServiceDetailsChange,
  serviceDetails,
  serviceDetailsStepBlockers,
}: {
  onServiceDetailsChange: Dispatch<SetStateAction<ServiceDetailsState>>;
  serviceDetails: ServiceDetailsState;
  serviceDetailsStepBlockers: string[];
}) {
  const [isDateTimeSheetOpen, setIsDateTimeSheetOpen] = useState(false);
  const [selectedAvailableStartDate, setSelectedAvailableStartDate] = useState<Date | null>(null);
  const [selectedAvailableEndDate, setSelectedAvailableEndDate] = useState<Date | null>(null);
  const [selectedAvailableTimeSlots, setSelectedAvailableTimeSlots] = useState<string[]>([]);
  const [selectedAvailableTimeSlotsByDate, setSelectedAvailableTimeSlotsByDate] = useState<Record<string, string[]>>(
    {}
  );
  const [availabilitySelectionMode, setAvailabilitySelectionMode] = useState<AvailabilitySelectionMode>('single');
  const highlightedAvailabilityDates = getAvailabilityDates(serviceDetails.availabilities);
  const selectedAvailabilitySummary = getAvailabilitySummary(serviceDetails.availabilities);
  const selectedRangeTimeSlots =
    selectedAvailableStartDate && selectedAvailableEndDate
      ? getCommonTimeSlotsForDateRange(
          selectedAvailableTimeSlotsByDate,
          selectedAvailableStartDate,
          selectedAvailableEndDate
        )
      : [];
  const canAddSelectedAvailability = Object.values(selectedAvailableTimeSlotsByDate).some(
    (timeSlots) => timeSlots.length > 0
  );
  const canApplyRangeAvailability =
    Boolean(selectedAvailableStartDate && selectedAvailableEndDate) && selectedRangeTimeSlots.length > 0;
  const canApplyDateTime =
    availabilitySelectionMode === 'range' ? canApplyRangeAvailability : canAddSelectedAvailability;
  const sheetHighlightedDates = isDateTimeSheetOpen
    ? getDatesFromTimeSlotsByDate(selectedAvailableTimeSlotsByDate)
    : highlightedAvailabilityDates;

  const openDateTimeSheet = () => {
    const firstAvailabilityDate = getFirstAvailabilityDate(serviceDetails.availabilities);
    const nextTimeSlotsByDate = buildTimeSlotsByDate(serviceDetails.availabilities);
    setSelectedAvailableTimeSlotsByDate(nextTimeSlotsByDate);
    setAvailabilitySelectionMode('single');

    if (firstAvailabilityDate) {
      setSelectedAvailableStartDate(firstAvailabilityDate);
      setSelectedAvailableEndDate(firstAvailabilityDate);
      setSelectedAvailableTimeSlots(nextTimeSlotsByDate[formatDateForApi(firstAvailabilityDate)] ?? []);
    } else {
      setSelectedAvailableStartDate(null);
      setSelectedAvailableEndDate(null);
      setSelectedAvailableTimeSlots([]);
    }

    setIsDateTimeSheetOpen(true);
  };

  const handleAddAvailableDate = () => {
    if (!canApplyDateTime) return;

    onServiceDetailsChange((currentDetails) => {
      const nextAvailabilities = buildAvailabilitiesFromTimeSlotsByDate(selectedAvailableTimeSlotsByDate);

      return {
        ...currentDetails,
        availabilities: nextAvailabilities,
        availableDates: buildAvailableDateLabels(nextAvailabilities),
        shouldSubmitSlots: true,
      };
    });
    setSelectedAvailableStartDate(null);
    setSelectedAvailableEndDate(null);
    setSelectedAvailableTimeSlots([]);
    setSelectedAvailableTimeSlotsByDate({});
    setAvailabilitySelectionMode('single');
    setIsDateTimeSheetOpen(false);
  };

  const handleSelectAvailableDate = (date: Date) => {
    if (availabilitySelectionMode === 'range') {
      if (!selectedAvailableStartDate || selectedAvailableEndDate) {
        setSelectedAvailableStartDate(date);
        setSelectedAvailableEndDate(null);
        setSelectedAvailableTimeSlots(selectedAvailableTimeSlotsByDate[formatDateForApi(date)] ?? []);
        return;
      }

      if (date < selectedAvailableStartDate) {
        setSelectedAvailableEndDate(selectedAvailableStartDate);
        setSelectedAvailableStartDate(date);
        setSelectedAvailableTimeSlots(
          getCommonTimeSlotsForDateRange(selectedAvailableTimeSlotsByDate, date, selectedAvailableStartDate)
        );
        return;
      }

      setSelectedAvailableEndDate(date);
      setSelectedAvailableTimeSlots(
        getCommonTimeSlotsForDateRange(selectedAvailableTimeSlotsByDate, selectedAvailableStartDate, date)
      );
      return;
    }

    if (!selectedAvailableStartDate || selectedAvailableEndDate) {
      setSelectedAvailableStartDate(date);
      setSelectedAvailableEndDate(date);
      setSelectedAvailableTimeSlots(selectedAvailableTimeSlotsByDate[formatDateForApi(date)] ?? []);
      return;
    }

    if (date < selectedAvailableStartDate) {
      setSelectedAvailableEndDate(selectedAvailableStartDate);
      setSelectedAvailableStartDate(date);
      setSelectedAvailableTimeSlots(selectedAvailableTimeSlotsByDate[formatDateForApi(date)] ?? []);
      return;
    }

    setSelectedAvailableEndDate(date);
    setSelectedAvailableTimeSlots(selectedAvailableTimeSlotsByDate[formatDateForApi(date)] ?? []);
  };

  const handleTimeSlotsChange = (timeSlots: string[]) => {
    if (availabilitySelectionMode === 'range') {
      setSelectedAvailableTimeSlots(timeSlots);
      if (selectedAvailableStartDate && selectedAvailableEndDate) {
        setSelectedAvailableTimeSlotsByDate((currentTimeSlotsByDate) =>
          setTimeSlotsForDateRange(
            currentTimeSlotsByDate,
            selectedAvailableStartDate,
            selectedAvailableEndDate,
            timeSlots
          )
        );
      }
      return;
    }

    if (!selectedAvailableStartDate) return;

    const selectedDateKey = formatDateForApi(selectedAvailableStartDate);
    setSelectedAvailableTimeSlots(timeSlots);
    setSelectedAvailableTimeSlotsByDate((currentTimeSlotsByDate) => ({
      ...currentTimeSlotsByDate,
      [selectedDateKey]: timeSlots,
    }));
  };

  return (
    <main className="flex flex-col gap-6 px-4 py-5">
      <section>
        <h1 className="text-[18px] font-semibold leading-6">Add availability for your service.</h1>
        <p className="mt-2 text-[16px] leading-6">You can add your available schedule up to two months from now.</p>
        <h2 className="mt-6 text-[16px] font-semibold leading-6 text-text-weak">Added hours:</h2>
        {selectedAvailabilitySummary && (
          <p className="mt-2 rounded-lg bg-bg-medium px-4 py-3 text-[14px] font-semibold text-text-weak">
            {selectedAvailabilitySummary}. Open calendar to review or edit.
          </p>
        )}
        <Button variant="outline" color="secondary" size="medium" className="mt-3 w-full" onClick={openDateTimeSheet}>
          Add date & time
        </Button>
      </section>

      <div className="-mx-4 h-2 bg-bg-medium" />

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-[18px] font-semibold leading-6">Add price for your service.</h2>
          <h3 className="mt-5 text-[16px] font-semibold leading-5">Regular price</h3>
          <p className="mt-1 text-[14px] leading-5">Set the price for the service.</p>
        </div>

        <div className="flex flex-col gap-4 rounded border border-border-default bg-white px-4 py-4">
          <SuffixInput
            id="price"
            label="Price"
            suffix="won"
            value={serviceDetails.price}
            onChange={(price) => onServiceDetailsChange((currentDetails) => ({ ...currentDetails, price }))}
          />
          <SuffixInput
            id="sessionMinutes"
            label="Session minutes"
            suffix="min."
            value={serviceDetails.sessionMinutes}
            onChange={(sessionMinutes) =>
              onServiceDetailsChange((currentDetails) => ({ ...currentDetails, sessionMinutes }))
            }
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-semibold leading-5">Promotion</h2>
            <p className="mt-1 text-[14px] leading-5">Set the discounted price for promotions.</p>
          </div>
          <span className="text-[14px] text-text-weak">Optional</span>
        </div>

        <div className="rounded border border-border-default bg-white">
          <div className="flex flex-col gap-4 px-4 py-5">
            <SuffixInput
              id="promotionalPrice"
              label="Promotional price"
              suffix="won"
              value={serviceDetails.promotionalPrice}
              onChange={(promotionalPrice) =>
                onServiceDetailsChange((currentDetails) => ({ ...currentDetails, promotionalPrice }))
              }
            />
            <SuffixInput
              id="amountOfTime"
              label="Amount of time"
              suffix="min."
              value={serviceDetails.amountOfTime}
              onChange={(amountOfTime) =>
                onServiceDetailsChange((currentDetails) => ({ ...currentDetails, amountOfTime }))
              }
            />
          </div>

          <Divider />

          <div className="px-4 py-4">
            <h3 className="text-[14px] font-semibold leading-5">Duration</h3>
            <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-start gap-3">
              <DateInput
                id="startDate"
                label="Start date"
                value={serviceDetails.promotionStartDate}
                onChange={(promotionStartDate) =>
                  onServiceDetailsChange((currentDetails) => ({ ...currentDetails, promotionStartDate }))
                }
              />
              <span className="pt-1 text-[18px] font-semibold">-</span>
              <DateInput
                id="endDate"
                label="End date"
                value={serviceDetails.promotionEndDate}
                onChange={(promotionEndDate) =>
                  onServiceDetailsChange((currentDetails) => ({ ...currentDetails, promotionEndDate }))
                }
              />
            </div>
            {hasInvalidPromotionDates(serviceDetails) && (
              <p className="mt-3 text-[12px] font-medium leading-4 text-red-600">
                Enter promotion dates as valid MM/DD/YYYY dates.
              </p>
            )}
            {hasPromotionDateOrderError(serviceDetails) && (
              <p className="mt-3 text-[12px] font-medium leading-4 text-red-600">
                Promotion start date must be before or same as end date.
              </p>
            )}
          </div>
        </div>
      </section>

      {serviceDetailsStepBlockers.length > 0 && (
        <section className="rounded-lg bg-red-50 px-4 py-3 text-[12px] font-medium leading-5 text-red-600">
          <p>Complete required fields to continue:</p>
          <ul className="mt-1 list-disc pl-4">
            {serviceDetailsStepBlockers.map((blocker) => (
              <li key={blocker}>{blocker}</li>
            ))}
          </ul>
        </section>
      )}
      {isDateTimeSheetOpen && (
        <DateTimeSheet
          canAdd={canApplyDateTime}
          highlightedDates={sheetHighlightedDates}
          mode={availabilitySelectionMode}
          selectedEndDate={selectedAvailableEndDate}
          selectedStartDate={selectedAvailableStartDate}
          selectedTimeSlots={selectedAvailableTimeSlots}
          onAdd={handleAddAvailableDate}
          onClose={() => setIsDateTimeSheetOpen(false)}
          onModeChange={(mode) => {
            setAvailabilitySelectionMode(mode);
            setSelectedAvailableStartDate(null);
            setSelectedAvailableEndDate(null);
            setSelectedAvailableTimeSlots([]);
          }}
          onReset={() => {
            setSelectedAvailableStartDate(null);
            setSelectedAvailableEndDate(null);
            setSelectedAvailableTimeSlots([]);
            setSelectedAvailableTimeSlotsByDate({});
          }}
          onSelectDate={handleSelectAvailableDate}
          onTimeSlotsChange={handleTimeSlotsChange}
        />
      )}
    </main>
  );
}

function ReviewSubmitStep({
  basicInfo,
  onEditBasicInfo,
  onEditServiceDetails,
  onSelectedCategoriesChange,
  selectedCategories,
  serviceDetails,
  submitBlockers,
}: {
  basicInfo: BasicInfoState;
  onEditBasicInfo: () => void;
  onEditServiceDetails: () => void;
  onSelectedCategoriesChange: Dispatch<SetStateAction<string[]>>;
  selectedCategories: string[];
  serviceDetails: ServiceDetailsState;
  submitBlockers: string[];
}) {
  const sessionMinutes = serviceDetails.sessionMinutes || '15';
  const promotionSessionMinutes = serviceDetails.amountOfTime || sessionMinutes;
  const regularPrice = serviceDetails.price || '10,000';
  const promotionalPrice = serviceDetails.promotionalPrice || '5,000';
  const promotionStartDate = serviceDetails.promotionStartDate || '03/20/2024';
  const promotionEndDate = serviceDetails.promotionEndDate || '04/20/2024';
  const availableDates =
    serviceDetails.availableDates.length > 0
      ? serviceDetails.availableDates
      : ['03/08 - 03/14 | 6:15PM - 9:15PM', '03/15 - 03/25 | 10AM - 2PM'];
  const reviewPhotoUrls = basicInfo.additionalPhotoUrls;

  return (
    <main className="flex flex-col gap-5 px-4 py-5">
      <section>
        <h1 className="text-[16px] font-semibold leading-6">Sale listing preview</h1>
        <p className="mt-1 text-[12px] leading-4">
          This is how your listing will appear to users on K-Buddy&apos;s market page.
        </p>

        <article className="mt-4 overflow-hidden rounded-lg border border-border-weak1 bg-white shadow-sm">
          <div className="relative">
            <img
              src={basicInfo.coverPreviewUrl}
              alt="Sale listing preview cover"
              className="h-[170px] w-full object-cover"
            />
            <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-[10px] font-semibold text-white">
              1:1 Chat
            </span>
          </div>
          <div className="p-3">
            <h2 className="text-[13px] font-semibold leading-5">{basicInfo.title}</h2>
            <p className="mt-1 text-[10px] leading-4">
              @Seller&apos;s ID · <span className="text-[#12B76A]">★</span> 4.5
            </p>
            <p className="text-[10px] leading-4">Category | Category2</p>
            <div className="mt-3 rounded bg-bg-medium px-3 py-2 text-right text-[10px] leading-4">
              <span className="mr-2 rounded bg-bg-brand-default px-2 py-1 font-semibold text-white">33%OFF</span>
              <span>
                {sessionMinutes} minutes&nbsp;&nbsp;{regularPrice} won
              </span>
            </div>
          </div>
        </article>
      </section>

      <div className="-mx-4 h-2 bg-bg-medium" />

      <section>
        <h2 className="text-[14px] font-semibold leading-5">Select all categories</h2>
        <p className="mt-1 text-[12px] leading-4">
          Choose at least one category that fits your blog. Feel free to select multiple categories.
        </p>
        <h3 className="mt-5 text-[12px] font-semibold leading-4">Category selection</h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {categoryOptions.map((category) => (
            <label
              key={category}
              className="flex h-10 items-center gap-2 rounded border border-border-default bg-white px-3 text-[12px] font-medium"
            >
              <input
                type="checkbox"
                aria-label={category}
                checked={selectedCategories.includes(category)}
                onChange={(event) => {
                  const isChecked = event.currentTarget.checked;
                  onSelectedCategoriesChange((currentCategories) =>
                    isChecked
                      ? [...currentCategories, category]
                      : currentCategories.filter((currentCategory) => currentCategory !== category)
                  );
                }}
                className="h-3.5 w-3.5 accent-bg-brand-default"
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </section>

      <ReviewCard title="Listing detail" editLabel="Edit listing detail" onEdit={onEditBasicInfo}>
        <ReviewTextBlock title="Title of Listing">{basicInfo.title}</ReviewTextBlock>
        <ReviewTextBlock title="Detail">{basicInfo.detail}</ReviewTextBlock>
        <ReviewTextBlock title="Professional background">{basicInfo.professionalBackground}</ReviewTextBlock>
        <ReviewTextBlock title="File name goes here.jpg">
          {basicInfo.proofFileNames.length > 0 ? basicInfo.proofFileNames.join(', ') : 'File name goes here.jpg'}
        </ReviewTextBlock>
        {reviewPhotoUrls.length > 0 && (
          <div>
            <h3 className="text-[12px] font-semibold leading-4">Photo(s)</h3>
            <div className="mt-2 grid grid-cols-5 gap-2">
              {reviewPhotoUrls.map((photoUrl, index) => (
                <img
                  key={`${photoUrl}-${index}`}
                  src={photoUrl}
                  alt={`Review photo ${index + 1}`}
                  className="h-12 w-full rounded object-cover"
                />
              ))}
            </div>
          </div>
        )}
      </ReviewCard>

      <ReviewCard title="Available hours" editLabel="Edit available hours" onEdit={onEditServiceDetails}>
        <p className="text-[12px] font-semibold leading-5">{availableDates.join('\n')}</p>
      </ReviewCard>

      <ReviewCard title="Service price" editLabel="Edit service price" onEdit={onEditServiceDetails}>
        <ReviewTextBlock title="Regular price">
          {regularPrice} won per {sessionMinutes} minutes
        </ReviewTextBlock>
        <ReviewTextBlock title="Promotion">
          {promotionalPrice} won per {promotionSessionMinutes} minutes
          <br />
          Duration: {promotionStartDate} - {promotionEndDate}
        </ReviewTextBlock>
        <p className="text-center text-[10px] leading-4 text-text-weak">*Listing will be approved within 48 hours.</p>
      </ReviewCard>

      {submitBlockers.length > 0 && (
        <section className="rounded-lg border border-border-weak1 bg-bg-medium px-4 py-3">
          <h2 className="text-[13px] font-semibold leading-5">Submit is disabled because:</h2>
          <ul className="mt-2 list-disc pl-5 text-[12px] leading-5 text-text-weak">
            {submitBlockers.map((blocker) => (
              <li key={blocker}>{blocker}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

function ReviewCard({
  children,
  editLabel,
  onEdit,
  title,
}: {
  children: ReactNode;
  editLabel: string;
  onEdit: () => void;
  title: string;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-bg-brand-default bg-white">
      <header className="flex items-center justify-between bg-bg-highlight-selected px-3 py-3">
        <h2 className="text-[13px] font-semibold leading-5">{title}</h2>
        <button type="button" aria-label={editLabel} onClick={onEdit} className="text-[11px] font-semibold underline">
          Edit
        </button>
      </header>
      <div className="flex flex-col gap-4 px-3 py-3">{children}</div>
    </section>
  );
}

function ReviewTextBlock({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div>
      <h3 className="text-[12px] font-semibold leading-4">{title}</h3>
      <p className="mt-1 text-[11px] leading-4">{children}</p>
    </div>
  );
}

function StepProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="bg-bg-medium px-4 py-3">
      <div className="relative grid grid-cols-3 gap-2">
        <div className="absolute left-[16%] right-[16%] top-[6px] h-px bg-border-default" />
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={step.label} className="relative z-10 flex flex-col items-center gap-1">
              <div
                className={`flex h-2.5 w-2.5 items-center justify-center rounded-full text-[8px] leading-none ${
                  isCurrent || isCompleted ? 'bg-bg-brand-default text-white' : 'bg-border-default'
                }`}
              >
                {isCompleted ? '✓' : null}
              </div>
              <span
                className={`text-center text-[10px] leading-4 ${isCurrent ? 'font-semibold' : 'text-text-disabled'}`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FormField({
  id,
  label,
  description,
  onChange,
  value,
  rows,
  count,
}: {
  id: string;
  label: string;
  description?: string;
  onChange: (value: string) => void;
  value: string;
  rows: number;
  count: string;
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="text-[14px] font-semibold leading-5">
        {label} <span aria-hidden="true">?</span>
      </span>
      {description && <span className="text-[12px] leading-4">{description}</span>}
      <textarea
        id={id}
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        rows={rows}
        className="w-full resize-none rounded-lg border border-border-default bg-white px-3 py-3 text-[14px] leading-5 outline-none focus:border-2 focus:border-border-hover"
      />
      <span className="text-right text-[11px] text-text-weak">{count}</span>
    </label>
  );
}

function Divider() {
  return <div className="border-t border-border-weak1" />;
}

function ProofFileItem({ fileName, onRemove }: { fileName: string; onRemove: () => void }) {
  return (
    <div className="flex min-h-[52px] items-center justify-between gap-3 bg-bg-medium px-4">
      <span className="min-w-0 truncate text-[20px] font-semibold leading-6 text-text-brand-default underline">
        {fileName}
      </span>
      <button
        type="button"
        aria-label={`Remove ${fileName}`}
        onClick={onRemove}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-text-weak"
      >
        <XIcon />
      </button>
    </div>
  );
}

function AdditionalPhotoGallery({
  currentIndex,
  isEditing,
  photoUrls,
  onEdit,
  onAddPhotos,
  onMovePhoto,
  onPrevious,
  onRemovePhoto,
  onNext,
}: {
  currentIndex: number;
  isEditing: boolean;
  photoUrls: string[];
  onEdit: () => void;
  onAddPhotos: () => void;
  onMovePhoto: (fromIndex: number, toIndex: number) => void;
  onPrevious: () => void;
  onRemovePhoto: (photoIndex: number) => void;
  onNext: () => void;
}) {
  const currentPhotoUrl = photoUrls[currentIndex];
  const nextPhotoUrl = photoUrls[currentIndex + 1] ?? photoUrls[0];

  return (
    <section className="-mx-4 flex flex-col gap-6 bg-bg-medium px-4 py-8">
      <div className="flex items-center justify-center gap-8 overflow-hidden">
        <img
          src={currentPhotoUrl}
          alt={`Additional photo ${currentIndex + 1}`}
          className="h-[240px] w-[240px] shrink-0 rounded-lg object-cover"
        />
        {photoUrls.length > 1 && (
          <img
            src={nextPhotoUrl}
            alt="Next additional photo preview"
            className="h-[240px] w-[110px] shrink-0 rounded-lg object-cover"
          />
        )}
      </div>

      <div className="flex items-center justify-end gap-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Previous photo"
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="text-text-default disabled:text-text-disabled"
          >
            <LeftArrowTriangle />
          </button>
          <span className="text-[18px] font-semibold leading-6">
            {currentIndex + 1}/{photoUrls.length}
          </span>
          <button
            type="button"
            aria-label="Next photo"
            onClick={onNext}
            disabled={currentIndex === photoUrls.length - 1}
            className="text-text-default disabled:text-text-disabled"
          >
            <RightArrowTriangle />
          </button>
        </div>
        <button type="button" onClick={onEdit} className="text-[18px] font-semibold leading-6 underline">
          {isEditing ? 'Done' : 'Edit photo(s)'}
        </button>
      </div>

      {isEditing && (
        <div className="flex flex-col gap-3 rounded-lg bg-white p-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-semibold leading-5">Edit photo(s)</h3>
            <button type="button" onClick={onAddPhotos} className="text-[14px] font-semibold leading-5 underline">
              Add photo
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {photoUrls.map((photoUrl, index) => (
              <div key={`${photoUrl}-${index}`} className="flex w-[112px] shrink-0 flex-col gap-2">
                <img
                  src={photoUrl}
                  alt={`Editable additional photo ${index + 1}`}
                  className="h-[96px] w-[112px] rounded-lg object-cover"
                />
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    aria-label={`Move photo ${index + 1} left`}
                    onClick={() => onMovePhoto(index, index - 1)}
                    disabled={index === 0}
                    className="rounded border border-border-weak1 px-2 py-1 text-[12px] disabled:text-text-disabled"
                  >
                    <LeftArrowTriangle />
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove photo ${index + 1}`}
                    onClick={() => onRemovePhoto(index)}
                    className="rounded border border-border-weak1 px-2 py-1 text-[12px]"
                  >
                    <XIcon />
                  </button>
                  <button
                    type="button"
                    aria-label={`Move photo ${index + 1} right`}
                    onClick={() => onMovePhoto(index, index + 1)}
                    disabled={index === photoUrls.length - 1}
                    className="rounded border border-border-weak1 px-2 py-1 text-[12px] disabled:text-text-disabled"
                  >
                    <RightArrowTriangle />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function DateTimeSheet({
  canAdd,
  highlightedDates,
  mode,
  selectedEndDate,
  selectedStartDate,
  selectedTimeSlots,
  onAdd,
  onClose,
  onModeChange,
  onReset,
  onSelectDate,
  onTimeSlotsChange,
}: {
  canAdd: boolean;
  highlightedDates: Date[];
  mode: AvailabilitySelectionMode;
  selectedEndDate: Date | null;
  selectedStartDate: Date | null;
  selectedTimeSlots: string[];
  onAdd: () => void;
  onClose: () => void;
  onModeChange: (mode: AvailabilitySelectionMode) => void;
  onReset: () => void;
  onSelectDate: (date: Date) => void;
  onTimeSlotsChange: (timeSlots: string[]) => void;
}) {
  const activeCalendarDate = selectedEndDate ?? selectedStartDate;
  const selectedDateLabel =
    mode === 'range'
      ? selectedStartDate && selectedEndDate
        ? `${formatLongDate(selectedStartDate)} - ${formatLongDate(selectedEndDate)}`
        : selectedStartDate
          ? `${formatLongDate(selectedStartDate)} - Select end date`
          : 'Select start date'
      : selectedStartDate
        ? formatLongDate(selectedStartDate)
        : 'Select a date';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-100/70 px-5 pt-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="dateTimeSheetTitle"
        className="mb-6 max-h-[calc(100vh-32px)] w-full max-w-[560px] overflow-y-auto rounded-t-[40px] bg-white shadow-selected"
      >
        <div className="flex justify-center pt-6">
          <div className="h-1.5 w-14 rounded-full bg-text-weak" />
        </div>

        <header className="flex items-center gap-5 border-b border-border-weak1 px-7 py-7">
          <button type="button" aria-label="Close add date and time" onClick={onClose} className="text-text-default">
            <XIcon />
          </button>
          <h2 id="dateTimeSheetTitle" className="text-[24px] font-normal leading-8">
            Add date & time
          </h2>
        </header>

        <div className="px-7 py-8">
          <p className="text-[20px] font-semibold leading-8">
            {mode === 'range'
              ? 'Select a date range and choose times to apply across every date.'
              : 'Select a date, choose its available times, then pick another date to set different times.'}
          </p>

          <div className="mt-5 grid grid-cols-2 rounded-lg bg-bg-medium p-1">
            {(['single', 'range'] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={mode === option}
                onClick={() => onModeChange(option)}
                className={`h-10 rounded-md text-[14px] font-semibold ${
                  mode === option ? 'bg-white text-text-brand-default shadow-selected' : 'text-text-weak'
                }`}
              >
                {option === 'single' ? 'Single date' : 'Date range'}
              </button>
            ))}
          </div>

          <div className="mt-5">
            <div className="rounded-lg bg-bg-medium px-3 py-2">
              <div className="text-[12px] font-semibold text-text-weak">
                {mode === 'range' ? 'Selected range' : 'Selected date'}
              </div>
              <div className="mt-1 text-[14px] font-semibold">{selectedDateLabel}</div>
            </div>
          </div>

          <div className="mt-8">
            <Calendar
              highlightedDates={highlightedDates}
              selectedDate={activeCalendarDate}
              selectedRangeEnd={mode === 'range' ? selectedEndDate : null}
              selectedRangeStart={mode === 'range' ? selectedStartDate : null}
              onDateSelect={onSelectDate}
            />
            <TimeSlotPicker
              selectedDate={selectedStartDate}
              selectedSlots={selectedTimeSlots}
              onSlotsChange={onTimeSlotsChange}
            />
          </div>
        </div>

        <footer className="flex h-24 items-start justify-between border-t border-border-weak1 px-7 pt-4">
          <Button variant="link" color="secondary" size="medium" onClick={onReset} className="px-0 underline">
            Reset
          </Button>
          <Button variant="solid" color="primary" size="medium" disabled={!canAdd} onClick={onAdd} className="px-10">
            {mode === 'range' ? 'Apply to range' : 'Add'}
          </Button>
        </footer>
      </section>
    </div>
  );
}

function formatLongDate(date: Date) {
  return `${date.toLocaleString('en-US', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;
}

function getFirstAvailabilityDate(availabilities: AvailabilityState[]) {
  return getAvailabilityDates(availabilities)[0] ?? null;
}

function getAvailabilityDates(availabilities: AvailabilityState[]) {
  const datesByKey = new Map<string, Date>();

  availabilities.forEach((availability) => {
    getDatesInRange(availability.startDate, availability.endDate).forEach((date) => {
      datesByKey.set(formatDateForApi(date), date);
    });
  });

  return Array.from(datesByKey.values()).sort((firstDate, secondDate) => firstDate.getTime() - secondDate.getTime());
}

function getAvailabilitySummary(availabilities: AvailabilityState[]) {
  if (availabilities.length === 0) return '';

  const dateCount = getAvailabilityDates(availabilities).length;
  const slotCount = buildSlotRequests(availabilities).reduce((count, slot) => count + slot.times.length, 0);
  const dateLabel = dateCount === 1 ? 'date' : 'dates';
  const slotLabel = slotCount === 1 ? 'time slot' : 'time slots';

  return `${dateCount} ${dateLabel}, ${slotCount} ${slotLabel} selected`;
}

function buildTimeSlotsByDate(availabilities: AvailabilityState[]) {
  return availabilities.reduce<Record<string, string[]>>((timeSlotsByDate, availability) => {
    getDatesInRange(availability.startDate, availability.endDate).forEach((date) => {
      const dateKey = formatDateForApi(date);
      const timeSlots = new Set(timeSlotsByDate[dateKey] ?? []);
      timeSlots.add(formatApiTimeForDisplay(availability.startTime));
      timeSlotsByDate[dateKey] = Array.from(timeSlots).sort(compareDisplayTimes);
    });

    return timeSlotsByDate;
  }, {});
}

function getDatesFromTimeSlotsByDate(timeSlotsByDate: Record<string, string[]>) {
  return Object.entries(timeSlotsByDate)
    .filter(([, timeSlots]) => timeSlots.length > 0)
    .map(([dateKey]) => parseApiDate(dateKey))
    .filter((date): date is Date => Boolean(date));
}

function setTimeSlotsForDateRange(
  currentTimeSlotsByDate: Record<string, string[]>,
  startDate: Date,
  endDate: Date,
  timeSlots: string[]
) {
  const nextTimeSlotsByDate = { ...currentTimeSlotsByDate };

  getDatesInRange(startDate, endDate).forEach((date) => {
    const dateKey = formatDateForApi(date);
    const nextTimeSlots = new Set(nextTimeSlotsByDate[dateKey] ?? []);
    timeSlots.forEach((timeSlot) => nextTimeSlots.add(timeSlot));
    nextTimeSlotsByDate[dateKey] = Array.from(nextTimeSlots).sort(compareDisplayTimes);
  });

  return nextTimeSlotsByDate;
}

function getCommonTimeSlotsForDateRange(timeSlotsByDate: Record<string, string[]>, startDate: Date, endDate: Date) {
  const dates = getDatesInRange(startDate, endDate);
  if (dates.length === 0) return [];

  const [firstDate, ...remainingDates] = dates;
  const commonTimeSlots = new Set(timeSlotsByDate[formatDateForApi(firstDate)] ?? []);

  remainingDates.forEach((date) => {
    const dateTimeSlots = new Set(timeSlotsByDate[formatDateForApi(date)] ?? []);
    Array.from(commonTimeSlots).forEach((timeSlot) => {
      if (!dateTimeSlots.has(timeSlot)) {
        commonTimeSlots.delete(timeSlot);
      }
    });
  });

  return Array.from(commonTimeSlots).sort(compareDisplayTimes);
}

function buildAvailabilitiesFromTimeSlotsByDate(timeSlotsByDate: Record<string, string[]>) {
  return Object.entries(timeSlotsByDate).flatMap(([dateKey, timeSlots]) => {
    const date = parseApiDate(dateKey);
    if (!date) return [];

    return timeSlots.map((timeSlot) => ({
      endDate: date,
      endTime: addMinutesToTime(timeSlot, 30),
      label: `${formatLongDate(date)} - ${formatLongDate(date)} · ${timeSlot}`,
      startDate: date,
      startTime: formatTimeForApi(timeSlot),
    }));
  });
}

function buildAvailableDateLabels(availabilities: AvailabilityState[]) {
  const timesByRange = availabilities.reduce<Map<string, string[]>>((labelsByRange, availability) => {
    const rangeLabel = `${formatLongDate(availability.startDate)} - ${formatLongDate(availability.endDate)}`;
    const times = labelsByRange.get(rangeLabel) ?? [];
    labelsByRange.set(rangeLabel, [...times, formatApiTimeForDisplay(availability.startTime)]);
    return labelsByRange;
  }, new Map());

  return Array.from(timesByRange.entries()).map(
    ([rangeLabel, times]) => `${rangeLabel} · ${Array.from(new Set(times)).sort(compareDisplayTimes).join(', ')}`
  );
}

function formatApiTimeForDisplay(time: string) {
  const [hour = 0, minute = 0] = time.split(':').map(Number);
  return formatTimeForDisplay(new Date(2000, 0, 1, hour, minute));
}

function compareDisplayTimes(firstTime: string, secondTime: string) {
  return getDisplayTimeMinutes(firstTime) - getDisplayTimeMinutes(secondTime);
}

function getDisplayTimeMinutes(time: string) {
  const apiTime = formatTimeForApi(time);
  const [hour = 0, minute = 0] = apiTime.split(':').map(Number);
  return hour * 60 + minute;
}

async function getEditableCounselorAvailabilitySlots(counselorId: string) {
  const today = new Date();
  const months = Array.from({ length: 3 }, (_, monthOffset) => {
    const date = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    return {
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
  });

  const uniqueMonths = Array.from(new Map(months.map((month) => [`${month.year}-${month.month}`, month])).values());
  const responses = await Promise.all(
    uniqueMonths.map((month) => counselorService.getCounselorAvailability(counselorId, month))
  );
  const slots = responses.flatMap((response) => response.slots);

  return Array.from(new Map(slots.map((slot) => [getAvailabilitySlotKey(slot), slot])).values());
}

function getAvailabilitySlotKey(slot: CounselorAvailabilitySlot) {
  return [slot.availabilityId ?? 'no-id', slot.slotStartUtc, slot.status].join('|');
}

function mapCounselorProfileToFormState(
  profile: MyCounselorProfile,
  availabilitySlots: CounselorAvailabilitySlot[] = []
): {
  basicInfo: BasicInfoState;
  selectedCategories: string[];
  serviceDetails: ServiceDetailsState;
} {
  const availabilityState = mapAvailabilitySlotsToFormState(availabilitySlots);

  return {
    basicInfo: {
      additionalPhotoFiles: [],
      additionalPhotoUrls: Array.isArray(profile.photoUrls) ? profile.photoUrls : [],
      coverImageFile: null,
      coverPreviewUrl: profile.coverImageUrl || profile.profileImageUrl || defaultProfileImage,
      detail: profile.detail || '',
      professionalBackground: profile.professionalBackground || '',
      proofFiles: [],
      proofFileNames: profile.proofFileUrl ? [getFileNameFromUrl(profile.proofFileUrl)] : [],
      title: profile.title || '',
    },
    selectedCategories: normalizeCategoryLabels(profile.categories),
    serviceDetails: {
      amountOfTime: profile.promotion?.promotionSessionMinutes
        ? formatNumberInput(String(profile.promotion.promotionSessionMinutes))
        : '',
      availabilities: availabilityState.availabilities,
      availableDates: availabilityState.availableDates,
      price: profile.regularPrice ? formatNumberInput(String(profile.regularPrice)) : '',
      promotionEndDate: convertApiDateToDisplayDate(profile.promotion?.endDate || ''),
      promotionStartDate: convertApiDateToDisplayDate(profile.promotion?.startDate || ''),
      promotionalPrice: profile.promotion?.promotionalPrice
        ? formatNumberInput(String(profile.promotion.promotionalPrice))
        : '',
      sessionMinutes: profile.sessionMinutes ? formatNumberInput(String(profile.sessionMinutes)) : '',
      shouldSubmitSlots: false,
    },
  };
}

function mapAvailabilitySlotsToFormState(slots: CounselorAvailabilitySlot[]) {
  const availableSlots = slots.filter((slot) => slot.status === 'AVAILABLE');

  return availableSlots.reduce<Pick<ServiceDetailsState, 'availabilities' | 'availableDates'>>(
    (formState, slot) => {
      const slotDate = parseUtcDateTime(slot.slotStartUtc);
      const displayTime = formatTimeForDisplay(slotDate);
      const availability = {
        endDate: slotDate,
        endTime: addMinutesToTime(displayTime, 30),
        label: `${formatLongDate(slotDate)} - ${formatLongDate(slotDate)} · ${displayTime}`,
        startDate: slotDate,
        startTime: formatTimeForApi(displayTime),
      };

      return {
        availabilities: [...formState.availabilities, availability],
        availableDates: [...formState.availableDates, availability.label],
      };
    },
    { availabilities: [], availableDates: [] }
  );
}

function formatTimeForDisplay(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hour12: true,
    minute: '2-digit',
  }).format(date);
}

function normalizeCategoryLabels(categories: string[]) {
  return categories
    .map((category) => categoryLabelByCode[category] || category)
    .filter((category) => categoryOptions.includes(category));
}

function convertApiDateToDisplayDate(date: string) {
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return '';

  const [, year, month, day] = match;
  return `${month}/${day}/${year}`;
}

function getFileNameFromUrl(url: string) {
  const pathname = url.split('?')[0];
  const fileName = pathname.split('/').filter(Boolean).pop();
  return fileName ? decodeURIComponent(fileName) : 'Uploaded proof file';
}

function formatDateForApi(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function parseApiDate(date: string) {
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function convertDisplayDateToApiDate(date: string) {
  if (!date) return undefined;
  if (!isValidDisplayDate(date)) return undefined;

  const [month, day, year] = date.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function parseDisplayDate(date: string) {
  if (!isValidDisplayDate(date) || date.length === 0) return null;

  const [month, day, year] = date.split('/').map(Number);
  return new Date(year, month - 1, day);
}

function isValidDisplayDate(date: string) {
  const [monthValue, dayValue, yearValue] = date.split('/');
  if (!monthValue && !dayValue && !yearValue) return true;
  if (!monthValue || !dayValue || !yearValue) return false;
  if (monthValue.length !== 2 || dayValue.length !== 2 || yearValue.length !== 4) return false;

  const month = Number(monthValue);
  const day = Number(dayValue);
  const year = Number(yearValue);

  if (!Number.isInteger(month) || !Number.isInteger(day) || !Number.isInteger(year)) return false;
  if (month < 1 || month > 12) return false;

  const parsedDate = new Date(year, month - 1, day);
  return parsedDate.getFullYear() === year && parsedDate.getMonth() === month - 1 && parsedDate.getDate() === day;
}

function hasInvalidPromotionDates(serviceDetails: ServiceDetailsState) {
  return !isValidDisplayDate(serviceDetails.promotionStartDate) || !isValidDisplayDate(serviceDetails.promotionEndDate);
}

function hasPromotionDateOrderError(serviceDetails: ServiceDetailsState) {
  const promotionStartDate = parseDisplayDate(serviceDetails.promotionStartDate);
  const promotionEndDate = parseDisplayDate(serviceDetails.promotionEndDate);

  if (!promotionStartDate || !promotionEndDate) return false;

  return promotionStartDate.getTime() > promotionEndDate.getTime();
}

function removeNumberSeparators(value: string) {
  return value.replace(/,/g, '');
}

function toOptionalNumber(value: string) {
  const normalizedValue = removeNumberSeparators(value);
  return normalizedValue ? Number(normalizedValue) : undefined;
}

function formatTimeForApi(time: string) {
  const match = time.match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/);
  if (!match) return time;

  const [, hourValue, minute, period] = match;
  let hour = Number(hourValue);
  if (period === 'AM' && hour === 12) hour = 0;
  if (period === 'PM' && hour !== 12) hour += 12;

  return `${String(hour).padStart(2, '0')}:${minute}`;
}

function addMinutesToTime(time: string, minutesToAdd: number) {
  const [hour, minute] = formatTimeForApi(time).split(':').map(Number);
  const totalMinutes = hour * 60 + minute + minutesToAdd;
  const nextHour = Math.floor(totalMinutes / 60) % 24;
  const nextMinute = totalMinutes % 60;

  return `${String(nextHour).padStart(2, '0')}:${String(nextMinute).padStart(2, '0')}`;
}

function getServiceDetailsStepBlockers(serviceDetails: ServiceDetailsState) {
  const blockers: string[] = [];

  if (serviceDetails.availabilities.length === 0) blockers.push('Add at least one available date and time.');
  if (Number(removeNumberSeparators(serviceDetails.price)) <= 0) blockers.push('Enter a regular price.');

  return blockers;
}

function getSubmitBlockers({
  basicInfo,
  isEditMode = false,
  selectedCategories,
  serviceDetails,
}: {
  basicInfo: BasicInfoState;
  isEditMode?: boolean;
  selectedCategories: string[];
  serviceDetails: ServiceDetailsState;
}) {
  const blockers: string[] = [];

  if (basicInfo.title.trim().length === 0) blockers.push('Enter a title.');
  if (basicInfo.detail.trim().length === 0) blockers.push('Enter listing detail.');
  if (selectedCategories.length === 0) blockers.push('Select at least one category.');
  if (Number(removeNumberSeparators(serviceDetails.price)) <= 0) blockers.push('Enter a regular price.');
  if (Number(removeNumberSeparators(serviceDetails.sessionMinutes)) < 15) {
    blockers.push('Enter session minutes of at least 15.');
  }
  if (!isEditMode && serviceDetails.availabilities.length === 0)
    blockers.push('Add at least one available date and time.');
  if (hasInvalidPromotionDates(serviceDetails)) {
    blockers.push('Enter promotion dates as valid MM/DD/YYYY dates.');
  }
  if (hasPromotionDateOrderError(serviceDetails)) {
    blockers.push('Promotion start date must be before or same as end date.');
  }

  return blockers;
}

function buildCounselorProfileFormData({
  basicInfo,
  includeSlots = true,
  isEditMode = false,
  selectedCategories,
  serviceDetails,
}: {
  basicInfo: BasicInfoState;
  includeSlots?: boolean;
  isEditMode?: boolean;
  selectedCategories: string[];
  serviceDetails: ServiceDetailsState;
}) {
  const request = {
    categories: selectedCategories.map((category) => categoryCodeByLabel[category]),
    detail: basicInfo.detail,
    intro: '',
    professionalBackground: basicInfo.professionalBackground,
    promotionEndDate: convertDisplayDateToApiDate(serviceDetails.promotionEndDate),
    promotionSessionMinutes: toOptionalNumber(serviceDetails.amountOfTime),
    promotionStartDate: convertDisplayDateToApiDate(serviceDetails.promotionStartDate),
    promotionalPrice: toOptionalNumber(serviceDetails.promotionalPrice),
    regularPrice: Number(removeNumberSeparators(serviceDetails.price)),
    sessionMinutes: Number(removeNumberSeparators(serviceDetails.sessionMinutes)),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    title: basicInfo.title,
  };

  if (includeSlots) {
    Object.assign(request, { slots: buildSlotRequests(serviceDetails.availabilities) });
  }

  const existingPhotoUrls = basicInfo.additionalPhotoUrls.filter((photoUrl) => !photoUrl.startsWith('blob:'));
  if (isEditMode) {
    Object.assign(request, { existingPhotoUrls });
  }

  const formData = new FormData();
  formData.append('data', new Blob([JSON.stringify(request)], { type: 'application/json' }));

  if (basicInfo.coverImageFile) {
    formData.append('coverImage', basicInfo.coverImageFile);
  }
  if (basicInfo.proofFiles[0]) {
    formData.append('proofFile', basicInfo.proofFiles[0]);
  }
  basicInfo.additionalPhotoFiles.forEach((photoFile) => formData.append('photos', photoFile));

  return formData;
}

function buildSlotRequests(availabilities: AvailabilityState[]) {
  const timesByDate = availabilities.reduce<Map<string, Set<string>>>((slotsByDate, availability) => {
    getDatesInRange(availability.startDate, availability.endDate).forEach((dateInRange) => {
      const date = formatDateForApi(dateInRange);
      const times = slotsByDate.get(date) ?? new Set<string>();
      times.add(availability.startTime);
      slotsByDate.set(date, times);
    });
    return slotsByDate;
  }, new Map());

  return Array.from(timesByDate.entries()).map(([date, times]) => ({
    date,
    times: Array.from(times).sort(),
  }));
}

function getDatesInRange(startDate: Date, endDate: Date) {
  const dates: Date[] = [];
  const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const finalDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  while (currentDate.getTime() <= finalDate.getTime()) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

function formatNumberInput(value: string) {
  const digitsOnly = value.replace(/\D/g, '');
  return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatDateInput(value: string) {
  const digitsOnly = value.replace(/\D/g, '').slice(0, 8);
  const month = digitsOnly.slice(0, 2);
  const day = digitsOnly.slice(2, 4);
  const year = digitsOnly.slice(4, 8);

  return [month, day, year].filter(Boolean).join('/');
}

function SuffixInput({
  id,
  label,
  onChange,
  suffix,
  value,
}: {
  id: string;
  label: string;
  onChange: (value: string) => void;
  suffix: string;
  value: string;
}) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(formatNumberInput(event.currentTarget.value));
  };

  return (
    <label htmlFor={id} className="grid grid-cols-[minmax(110px,auto)_1fr_auto] items-center gap-2">
      <span className="text-[14px] font-semibold leading-5">{label}</span>
      <input
        id={id}
        aria-label={label}
        inputMode="numeric"
        pattern="[0-9,]*"
        value={value}
        onChange={handleChange}
        className="min-w-0 border-b border-border-default bg-transparent px-1 py-1 text-[14px] outline-none focus:border-border-hover"
      />
      <span className="text-[13px] font-medium text-text-weak">{suffix}</span>
    </label>
  );
}

function DateInput({
  id,
  label,
  onChange,
  value,
}: {
  id: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(formatDateInput(event.currentTarget.value));
  };

  return (
    <label htmlFor={id} className="flex min-w-0 flex-col items-center gap-1">
      <input
        id={id}
        aria-label={label}
        placeholder="MM/DD/YYYY"
        inputMode="numeric"
        pattern="[0-9/]*"
        value={value}
        onChange={handleChange}
        className="w-full min-w-0 border-b border-border-default bg-transparent px-1 py-1 text-center text-[14px] outline-none placeholder:text-text-weak focus:border-border-hover"
      />
      <span className="text-[11px] font-medium text-text-weak">{label}</span>
    </label>
  );
}
