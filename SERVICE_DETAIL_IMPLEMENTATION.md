# Service Detail Page Implementation

This document describes the implementation of the Service Detail Page for the K-Buddy application.

## Overview

The Service Detail Page displays detailed information about a service/marketplace item when a user clicks on a service card. The page includes service information, reviews, photos, and an inquiry section.

## Files Created

### Page Component

- **`src/pages/ServiceDetailPage.tsx`** - Main page component that orchestrates all sections and manages state

### Service Components

- **`src/components/service/StarRating.tsx`** - Displays star ratings (full, half, empty stars)
- **`src/components/service/ServiceReviewList.tsx`** - List container for reviews with rating summary
- **`src/components/service/ServiceReviewItem.tsx`** - Individual review item with expandable text
- **`src/components/service/ServicePhotoGallery.tsx`** - Photo gallery with masonry layout
- **`src/components/service/ServiceInquiry.tsx`** - Inquiry/comments section
- **`src/components/service/ServiceInquiryItem.tsx`** - Individual inquiry/comment item

### Updated Files

- **`src/components/service/index.ts`** - Added exports for new components
- **`src/components/service/ServiceCard.tsx`** - Added navigation to detail page on click
- **`src/pages/index.ts`** - Added ServiceDetailPage export
- **`src/App.tsx`** - Added route for `/service/:id`

## Features Implemented

### 1. Top Navigation Bar

- Back button to return to service list
- Service title
- Bookmark toggle
- Share button
- Menu (three dots)

### 2. Hero Section

- Service image with gradient overlay
- Category badge (1:1 Chat)
- Service title and seller information
- Star rating display
- Category tags
- Duration and price in highlighted box

### 3. Tab Navigation

Sticky tab bar with four sections:

- **Info** - Service description
- **Review** - Customer reviews
- **Photo** - Photo gallery
- **Inquiry** - Q&A section

### 4. Info Tab (Default)

Combines all sections in a single scrollable view:

- Service description
- Preview of reviews (top 3)
- Preview of photo gallery
- Preview of inquiry section

### 5. Review Section

- Overall rating summary with star visualization
- Review count
- Individual reviews with:
  - User profile image
  - Username and date
  - Star rating
  - Review title
  - Expandable review text ("Read more" functionality)
  - Optional review images
- "View more review" button

### 6. Photo Gallery

- Masonry-style photo layout
- Photo count display
- "View more photo" button

### 7. Inquiry Section

- Comment/reply system
- User avatars
- Verified seller badge
- Private comment indicator with lock icon
- Reply functionality
- Timestamp display
- "Ask the seller" button

### 8. Bottom CTA Bar

Fixed bottom bar with:

- Price and duration display
- Minimum duration requirement text
- "Request" button (primary action)

## Design System Compliance

All components follow the existing design system:

### Colors

- Text colors: `text-default`, `text-weak`, `text-strong`, `text-brand-default`
- Background colors: `bg-default`, `bg-medium`, `bg-brand-default`
- Border colors: `border-default`, `border-weak1`, `border-weak2`

### Typography

- Font family: Roboto
- Sizes: `body-100-medium`, `body-200-light`, `title-200-medium`, `label-300-heavy`, etc.
- Consistent letter-spacing and line-height as per design

### Spacing

- Padding: 16px (px-4) for main content areas
- Gaps: 2px, 4px, 8px, 12px, 16px, 24px
- Section dividers: 8px height with `bg-border-weak2`

### Components

- Reuses existing Button component with variants
- Consistent rounded corners (8px for buttons, images)
- Shadow utilities for elevation

## Responsive Design

The page is designed for mobile-first with:

- Max width of 600px for desktop
- Sticky header and tab navigation
- Fixed bottom CTA bar
- Proper spacing for touch targets

## State Management

The page manages several pieces of state:

- `activeTab` - Currently selected tab
- `isBookmarked` - Bookmark status
- `showDetailModal` - Menu modal visibility
- `showAllReviews` - Toggle for expanding review list
- `replyingTo` - Currently active reply thread

## Navigation

- **Route**: `/service/:id`
- **Entry point**: Clicking any ServiceCard navigates to detail page
- **Exit**: Back button returns to previous page

## Mock Data

Currently using mock data for demonstration:

- Service information
- Reviews (3 sample reviews)
- Photos (6 sample photos)
- Inquiries (sample comments and replies)

## Future Enhancements

1. **API Integration**

   - Fetch service details from backend
   - Load reviews, photos, and inquiries from API
   - Implement bookmark persistence
   - Handle form submissions for inquiries

2. **Features**

   - Image lightbox/viewer for photos
   - Review sorting and filtering
   - Pagination for reviews and inquiries
   - Form for submitting new inquiries
   - Review submission functionality

3. **Optimizations**

   - Lazy loading for images
   - Infinite scroll for reviews
   - Skeleton loaders
   - Image optimization

4. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Screen reader support
   - Focus management

## Usage Example

```tsx
// Navigate to service detail page
<ServiceCard
  id="123"
  title="Live chat assistance"
  onClick={() => navigate('/service/123')}
  {...otherProps}
/>

// Or the ServiceCard now handles navigation automatically
<ServiceCard
  id="123"
  title="Live chat assistance"
  {...otherProps}
/>
```

## Component Props

### ServiceDetailPage

No props required - uses React Router's `useParams()` to get service ID

### StarRating

```tsx
interface StarRatingProps {
  rating: number; // Rating value (0-5)
  size?: 'small' | 'medium'; // Star size
}
```

### ServiceReviewList

```tsx
interface ServiceReviewListProps {
  rating: number; // Overall rating
  reviewCount: number; // Total number of reviews
  showAll?: boolean; // Show all reviews or limited view
}
```

## Testing

To test the implementation:

1. Navigate to `/service` page
2. Click on any service card
3. Verify navigation to detail page
4. Test all four tabs (Info, Review, Photo, Inquiry)
5. Test expandable features (Read more, View more buttons)
6. Test bookmark toggle
7. Verify back navigation

## Notes

- All components use existing design system components and utilities
- Follows project structure and naming conventions
- TypeScript types are properly defined
- Components are modular and reusable
- Mobile-first responsive design
- Matches the Figma design specifications
