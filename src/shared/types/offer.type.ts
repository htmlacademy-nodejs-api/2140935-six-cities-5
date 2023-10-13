import { City } from './city.enum.js';
import { Property } from './property.enum.js';
import { Facility } from './facility.enum.js';
import { User } from './user.type.js';

export type Offer = {
  title: string;
  description: string;
  publishedDate: Date;
  city: City;
  preview: string;
  photos: string[];
  premium: boolean;
  favorite: boolean;
  rating: number;
  property: Property;
  roomsCount: number;
  guestsCount: number;
  price: number;
  facilities: Facility[];
  author: User;
  commentsCount: number;
  location: {
    latitude: number,
    longitude: number
  };
}
