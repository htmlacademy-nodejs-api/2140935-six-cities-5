import { Expose } from 'class-transformer';

export class OfferRdo {
  @Expose()
  public title: string;

  @Expose()
  public offerDate: string;

  @Expose()
  public city: string;

  @Expose()
  public preview: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public property: string;

  @Expose()
  public price: number;

  @Expose()
  public commentCount: number;
}
