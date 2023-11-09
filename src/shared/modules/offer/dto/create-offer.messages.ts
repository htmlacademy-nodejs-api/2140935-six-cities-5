export const CreateOfferValidationMessage = {
  title: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  offerDate: {
    invalidFormat: 'offerDate must be a valid ISO date',
  },
  city: {
    invalid: 'Only a city from a given list is allowed',
  },
  images: {
    maxLength: 'Too long for field «image»',
    invalid:  '6 images required',
  },
  isPremium: {
    invalidFormat: 'isPremium must be true or false',
  },
  isFavorite: {
    invalidFormat: 'isFavorite must be true or false',
  },
  rating: {
    invalidFormat: 'The rating must be a number from 1 to 5. Numbers with 1 decimal place are allowed.',
  },
  property: {
    invalidFormat: 'Only a item from a given list is allowed',
  },
  roomsCount: {
    invalidFormat: 'The roomsCount must be a number from 1 to 8.',
  },
  guestsCount: {
    invalidFormat: 'The guestsCount must be a number from 1 to 10.',
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 100000',
  },
  goods: {
    invalidFormat: 'Value must be an array',
    minSize: 'At least 1 item is required',
    invalidValue: 'Only an item from a given list is allowed',
  },
  userId: {
    invalidId: 'userId field must be a valid id',
  },
  location: {
    invalidObject: 'Location must be an object',
  },
} as const;
