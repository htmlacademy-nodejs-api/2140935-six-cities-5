import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/rdo/user.rdo.js';

export class FullOfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public offerDate: string;

  @Expose()
  public city: string;

  @Expose()
  public preview: string;

  @Expose()
  public images: string[];

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public property: string;

  @Expose()
  public roomsCount: number;

  @Expose()
  public guestsCount: number;

  @Expose()
  public price: number;

  @Expose()
  public goods: string[];

  @Expose({ name: 'userId'})
  @Type(() => UserRdo)
  public user: UserRdo;

  @Expose()
  public commentCount: number;

  @Expose()
  public location: { latitude: number; longitude: number };
}
