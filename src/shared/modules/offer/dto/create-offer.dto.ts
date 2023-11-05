import { City, Property, Goods, Location } from '../../../types/index.js';

export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public offerDate!: Date;
  public city!: City;
  public preview!: string;
  public images!: string[];
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public rating!: number;
  public property!: Property;
  public roomsCount!: number;
  public guestsCount!: number;
  public price!: number;
  public goods!: Goods[];
  public userId!: string;
  public location!: Location;
}
