import { IMAGES_NUMBER, GOODS_MIN_COUNT, OfferTitleLength, DescriptionLength, RoomsNumber, GuestsNumber, PriceValue } from '../../../const/index.js';

export const CreateOfferValidationMessage = {
  title: {
    minLength: `Minimum title length must be ${OfferTitleLength.Min}`,
    maxLength: `Maximum title length must be ${OfferTitleLength.Max}`,
  },
  description: {
    minLength: `Minimum description length must be ${DescriptionLength.Min}`,
    maxLength: `Maximum description length must be ${DescriptionLength.Max}`,
  },
  offerDate: {
    invalidFormat: 'offerDate must be a valid ISO date',
  },
  city: {
    invalid: 'Only a city from a given list is allowed',
  },
  images: {
    maxLength: 'Too long for field «image»',
    invalid:  `${IMAGES_NUMBER} images required`,
  },
  isPremium: {
    invalidFormat: 'isPremium must be true or false',
  },
  isFavorite: {
    invalidFormat: 'isFavorite must be true or false',
  },
  property: {
    invalidFormat: 'Only a item from a given list is allowed',
  },
  roomsCount: {
    invalidFormat: `The roomsCount must be a number from ${RoomsNumber.Min} to ${RoomsNumber.Max}.`,
  },
  guestsCount: {
    invalidFormat: `The guestsCount must be a number from ${GuestsNumber.Min} to ${GuestsNumber.Max}.`,
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: `Minimum price is ${PriceValue.Min}`,
    maxValue: `Maximum price is ${PriceValue.Max}`,
  },
  goods: {
    invalidFormat: 'Value must be an array',
    minSize: `At least ${GOODS_MIN_COUNT} item is required`,
    invalidValue: 'Only an item from a given list is allowed',
  },
  userId: {
    invalidId: 'userId field must be a valid id',
  },
  location: {
    invalidObject: 'Location must be an object',
  },
} as const;
