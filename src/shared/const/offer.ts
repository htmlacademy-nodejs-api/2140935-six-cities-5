export const DEFAULT_OFFERS_COUNT = 60;
export const MAX_PREMIUM_OFFERS_COUNT = 3;
export const IMAGES_NUMBER = 6;
export const PREVIEW_MAX_LENGTH = 256;
export const GOODS_MIN_COUNT = 1;

export enum OfferTitleLength {
  Min = 10,
  Max = 100,
}

export enum DescriptionLength {
  Min = 20,
  Max = 1024,
}

export enum RoomsNumber {
  Min = 1,
  Max = 8,
}

export enum GuestsNumber {
  Min = 1,
  Max = 10,
}

export enum PriceValue {
  Min = 100,
  Max = 100000,
}

export const Cities = {
  Paris: {
    latitude: 48.85661,
    longitude:  2.351499
  },

  Cologne: {
    latitude: 50.938361,
    longitude: 6.959974
  },

  Brussels: {
    latitude: 50.846557,
    longitude: 4.351697
  },

  Amsterdam: {
    latitude: 52.370216,
    longitude: 4.895168
  },

  Hamburg: {
    latitude: 53.550341,
    longitude: 10.000654
  },

  Dusseldorf: {
    latitude: 53.550341,
    longitude: 10.000654
  },
} as const;
