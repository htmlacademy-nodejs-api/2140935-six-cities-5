//import { Ref } from '@typegoose/typegoose';
//import { OfferEntity } from '../modules/offer/offer.entity.js';

export type User = {
  name: string;
  email: string;
  avatar: string;
  isPro: boolean;
  //favorites: Ref<OfferEntity>[];
}
