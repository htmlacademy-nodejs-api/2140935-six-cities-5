import { TextLength, RatingValue } from '../../../const/index.js';

export const CreateCommentMessages = {
  text: {
    invalidFormat: 'text is required',
    lengthField: `min length is ${TextLength.Min}, max is ${TextLength.Max}`
  },
  rating:  {
    invalidFormat: 'rating must be a number',
    invalidValue: `min length is ${RatingValue.Min}, max is ${RatingValue.Max}`
  },
  offerId: {
    invalidFormat: 'offerId field must be a valid id'
  },
  userId: {
    invalidFormat: 'userId field must be a valid id'
  },
} as const;
