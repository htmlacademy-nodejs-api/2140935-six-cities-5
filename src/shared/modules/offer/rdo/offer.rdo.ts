import { Expose } from 'class-transformer';
import { City, Property } from '../../../types/index.js';

export class OfferRdo {
  @Expose()
  public title: string;

  @Expose()
  public offerDate: string;

  @Expose()
  public city: City;

  @Expose()
  public preview: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public property: Property;

  @Expose()
  public price: number;

  @Expose()
  public commentCount: number;
}
