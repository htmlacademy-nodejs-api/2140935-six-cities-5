import { Ref } from '@typegoose/typegoose';
import { OfferEntity } from '../../../modules/offer/offer.entity.js';

export class CreateUserDto {
  public name: string;
  public email: string;
  public avatar: string;
  public password: string;
  public isPro: boolean;
  public favorites: Ref<OfferEntity>[];
}
