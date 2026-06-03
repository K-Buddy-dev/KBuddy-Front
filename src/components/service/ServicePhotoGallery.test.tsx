import { screen } from '@testing-library/react';
import render from '@/utils/test/render';
import { ServicePhotoGallery } from './ServicePhotoGallery';

it('renders a single service photo without the fixed mosaic canvas spacing', async () => {
  await render(<ServicePhotoGallery photoUrls={['https://example.com/photo.jpg']} />);

  const image = screen.getByAltText('Gallery 1');

  expect(image).toHaveAttribute('src', 'https://example.com/photo.jpg');
  expect(image).toHaveClass('w-full');
  expect(image).not.toHaveClass('absolute');
});
