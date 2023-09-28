import { Cities } from './cities.enum.js';
import { PropertyType } from './property.enum.js';
import { Facilities } from './facilities.enum.js';
import { User } from './user.type.js';

export type Offer = {
  title: string;
  description: string;
  date: Date;
  city: Cities;
  preview: string;
  photos: string[];
  premium: boolean;
  favorite: boolean;
  rating: number;
  type: PropertyType;
  rooms: number;
  guests: number;
  price: number;
  convienience: Facilities;
  author: User;
  commentsCount: number;
  location: {
    latitude: number,
    longitude: number
  };
}
