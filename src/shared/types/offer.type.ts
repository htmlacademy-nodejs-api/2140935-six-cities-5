import { City, Property, Goods, User } from './index.js';

export type Offer = {
  title: string;
  description: string;
  offerDate: Date;
  city: City;
  preview: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  property: Property;
  roomsCount: number;
  guestsCount: number;
  price: number;
  goods: Goods[];
  user: User;
  commentCount: number;
  location: {
    latitude: number,
    longitude: number
  };
}
