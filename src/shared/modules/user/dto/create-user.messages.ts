import { UserNameLength, UserPasswordLength } from '../../../const/index.js';

export const CreateUserMessages = {
  name: {
    invalidFormat: 'name is required',
    lengthField: `min length is ${UserNameLength.Min}, max is ${UserNameLength.Max}`,
  },
  email: {
    invalidFormat: 'email must be a valid address'
  },
  avatar: {
    invalidFormat: '.jpg or .png image URL required',
  },
  password: {
    invalidFormat: 'password is required',
    lengthField: `min length for password is ${UserPasswordLength.Min}, max is ${UserPasswordLength.Max}`
  },
  userType: {
    invalidFormat: 'must be pro or standard',
  },
} as const;
