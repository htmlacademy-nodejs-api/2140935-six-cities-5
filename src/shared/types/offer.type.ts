import { Cities } from './cities.enum.js';
import { PropertyType } from './property.enum.js';
import { Facilities } from './facilities.enum.js';
import { User } from './user.type.js';

export type Offer = {
  title: string;
  description: string;
  publishedDate: Date;
  city: Cities;
  preview: string;
  photos: string[];
  premium: boolean;
  favorite: boolean;
  rating: number;
  type: PropertyType;
  roomsCount: number;
  guestsCount: number;
  price: number;
  facilities: Facilities[];
  author: User;
  commentsCount: number;
  location: {
    latitude: number,
    longitude: number
  };
}
