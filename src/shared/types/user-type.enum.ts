export const UserType = {
  Default: 'default',
  Pro: 'pro',
} as const;

export type UserTypeType = typeof UserType[keyof typeof UserType];
