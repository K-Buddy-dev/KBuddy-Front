export const serviceCategories = [
  { code: '', label: 'All' },
  { code: 'VISA_IMMIGRATION', label: 'Visa' },
  { code: 'KOREAN_LANGUAGE', label: 'Korean' },
  { code: 'HOUSING', label: 'Housing' },
  { code: 'BANKING_FINANCE', label: 'Banking' },
  { code: 'MOBILE_INTERNET', label: 'Mobile' },
  { code: 'HEALTHCARE', label: 'Healthcare' },
  { code: 'EDUCATION', label: 'Education' },
  { code: 'JOB_CAREER', label: 'Job' },
  { code: 'DAILY_LIFE', label: 'Daily Life' },
  { code: 'TRANSPORTATION', label: 'Transportation' },
  { code: 'SHOPPING_LOCAL', label: 'Shopping & Local' },
  { code: 'LEGAL_ADMIN', label: 'Legal & Admin' },
  { code: 'TRAVEL_LOCAL_GUIDE', label: 'Travel & Local Guide' },
  { code: 'RELATIONSHIP_CULTURE', label: 'Culture & Relationships' },
  { code: 'EMERGENCY_HELP', label: 'Emergency Help' },
  { code: 'OTHERS', label: 'Others' },
] as const;

export type ServiceCategoryCode = (typeof serviceCategories)[number]['code'];
