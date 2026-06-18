import { screen } from '@testing-library/react';
import render from '@/utils/test/render';
import { CommunityFormActionContext, CommunityFormStateContext } from '@/hooks/useCommunityFormContext';
import { TypeSelector } from './TypeSelector';

it('offers Buddy Profile as a post type with friend-focused copy', async () => {
  await render(
    <CommunityFormStateContext.Provider
      value={{
        categoryId: [],
        title: '',
        description: '',
        images: [],
        type: '',
        draftId: null,
        isDraftMode: false,
        isEditMode: false,
        detailBackUrl: '',
        originalType: null,
      }}
    >
      <CommunityFormActionContext.Provider
        value={{
          setCategoryId: () => undefined,
          setTitle: () => undefined,
          setDescription: () => undefined,
          setImages: () => undefined,
          setType: () => undefined,
          setDraftId: () => undefined,
          setIsDraftMode: () => undefined,
          setisEditMode: () => undefined,
          setDetailBackUrl: () => undefined,
          setOriginalType: () => undefined,
          reset: () => undefined,
        }}
      >
        <TypeSelector />
      </CommunityFormActionContext.Provider>
    </CommunityFormStateContext.Provider>
  );

  expect(screen.getByRole('radio', { name: /Buddy Profile/i })).toBeInTheDocument();
  expect(screen.getByText(/find friends, language partners, or hobby buddies/i)).toBeInTheDocument();
});
