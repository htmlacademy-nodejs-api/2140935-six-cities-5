import { defaultClasses, getModelForClass, modelOptions, prop, Ref, Severity } from '@typegoose/typegoose';
import { Facility, City, Property } from '../../types/index.js';
import { UserEntity } from '../user/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({
    require: true,
    minlength: OfferTitleLength.Min,
    maxlength: OfferTitleLength.Max,
  })
  public title!: string;

  @prop({
    require: true,
    minlength: DescriptionLength.Min,
    maxlength: DescriptionLength.Max,
  })
  public description!: string;

  @prop({
    require: true,
    default: new Date(),
  })
  public publishedDate!: Date;

  @prop({
    type: () => String,
    enum: City,
    require: true,
  })
  public city!: City;

  @prop({
    require: true,
  })
  public preview!: string;

  @prop({
    type: () => [String],
    require: true,
    default: [],
  })
  public photos!: string[];

  @prop({
    require: true,
    default: false,
  })
  public premium!: boolean;

  @prop({
    require: true,
    default: false,
  })
  public isFavorite!: boolean;

  @prop({
    require: true,
    min: RatingValue.Min,
    max: RatingValue.Max,
  })
  public rating!: number;

  @prop({
    type: () => String,
    enum: Property,
    require: true,
  })
  public property!: Property;

  @prop({
    require: true,
    min: RoomsNumber.Min,
    max: RoomsNumber.Max,
  })
  public roomsCount!: number;

  @prop({
    require: true,
    min: GuestsNumber.Min,
    max: GuestsNumber.Max,
  })
  public guestsCount!: number;

  @prop({
    require: true,
    min: PriceValue.Min,
    max: PriceValue.Max,
  })
  public price!: number;

  @prop({
    type: () => [String],
    enum: Facility,
    require: true,
    default: []
  })
  public facilities!: Facility[];

  @prop({
    ref: UserEntity,
    require: true,
  })
  public author!: Ref<UserEntity>;

  @prop({
    default: 0,
  })
  public commentCount?: number;

  @prop({
    require: true,
  })
  public location!: Location;
}

export const OfferModel = getModelForClass(OfferEntity);
