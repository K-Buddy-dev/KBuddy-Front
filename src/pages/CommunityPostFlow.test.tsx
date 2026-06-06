import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import render from '@/utils/test/render';
import { TypeCategoryPage } from './TypeCategoryPage';
import { TitleImageDescriptionPage } from './TitleImageDescriptionPage';

const mockState = {
  categoryId: [] as number[],
  description: '',
  draftId: null,
  images: [] as File[],
  isDraftMode: false,
  isEditMode: false,
  originalType: undefined,
  title: '',
  type: '' as 'Blog' | 'Q&A' | '',
};

const mockActions = {
  reset: vi.fn(),
  setCategoryId: vi.fn(),
  setDescription: vi.fn(),
  setImages: vi.fn(),
  setTitle: vi.fn(),
  setType: vi.fn(),
};

vi.mock('@/hooks', async () => {
  const actual = await vi.importActual<typeof import('@/hooks')>('@/hooks');

  return {
    ...actual,
    useCommunityFormActionContext: () => mockActions,
    useCommunityFormStateContext: () => mockState,
  };
});

vi.mock('@/hooks/useCommunityFormContext', () => ({
  useCommunityFormActionContext: () => mockActions,
  useCommunityFormStateContext: () => mockState,
}));

vi.mock('@/hooks/usePost', () => ({
  usePost: () => ({
    createPost: vi.fn(),
    isLoading: false,
    updatePost: vi.fn(),
  }),
}));

vi.mock('@/components/community/post/Description', () => ({
  Description: () => <div>Body editor</div>,
}));

beforeEach(() => {
  vi.clearAllMocks();
  Object.assign(mockState, {
    categoryId: [],
    description: '',
    draftId: null,
    images: [],
    isDraftMode: false,
    isEditMode: false,
    originalType: undefined,
    title: '',
    type: '',
  });
});

it('guides users through post type and category selection with clear steps', async () => {
  await render(
    <MemoryRouter>
      <TypeCategoryPage />
    </MemoryRouter>
  );

  expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
  expect(screen.getByText('Choose what you want to create')).toBeInTheDocument();
  expect(screen.getByText('Share experiences, tips, and guides for life in Korea.')).toBeInTheDocument();
  expect(screen.getByText('Ask a specific question and get help from the community.')).toBeInTheDocument();
});

it('tailors the content step for Q&A creation', async () => {
  Object.assign(mockState, {
    categoryId: [5],
    type: 'Q&A',
  });

  await render(
    <MemoryRouter>
      <TitleImageDescriptionPage />
    </MemoryRouter>
  );

  expect(screen.getByText('Step 3 of 3')).toBeInTheDocument();
  expect(screen.getByLabelText('What do you need help with?')).toHaveAttribute(
    'placeholder',
    'Example: How can I extend my visa in Korea?'
  );
  expect(screen.getByText('Add details so others can understand your situation.')).toBeInTheDocument();
  expect(screen.getByText('Add photos')).toBeInTheDocument();
  expect(screen.getByText('Optional. You can add up to 5 images.')).toBeInTheDocument();
});
