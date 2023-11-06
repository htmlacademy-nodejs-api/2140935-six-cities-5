import { City, Property, Goods, Location } from '../../../types/index.js';

export class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public city?: City;
  public preview?: string;
  public images?: string[];
  public isPremium?: boolean;
  public rating?: number;
  public property?: Property;
  public roomsCount?: number;
  public guestsCount?: number;
  public price?: number;
  public goods?: Goods[];
  public location?: Location;
}
