import { IsArray, IsEnum, IsInt, IsBoolean, Max, MaxLength, Min, MinLength, IsObject, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { City, Property, Goods, Location } from '../../../types/index.js';
import { CreateOfferValidationMessage } from './create-offer.messages.js';
import { IMAGES_NUMBER, PREVIEW_MAX_LENGTH, GOODS_MIN_COUNT, OfferTitleLength, DescriptionLength, RoomsNumber, GuestsNumber, PriceValue } from '../../../const/index.js';

export class CreateOfferDto {
  @MinLength(OfferTitleLength.Min, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(OfferTitleLength.Max, { message: CreateOfferValidationMessage.title.maxLength })
  public title!: string;

  @MinLength(DescriptionLength.Min, { message: CreateOfferValidationMessage.description.minLength })
  @MaxLength(DescriptionLength.Max, { message: CreateOfferValidationMessage.description.maxLength })
  public description!: string;

  public offerDate!: Date;

  @IsEnum(City, { message: CreateOfferValidationMessage.city.invalid })
  public city!: City;

  @MaxLength(PREVIEW_MAX_LENGTH, { message: CreateOfferValidationMessage.images.maxLength })
  public preview!: string;

  @IsArray({ message: CreateOfferValidationMessage.images.invalid })
  @ArrayMinSize(IMAGES_NUMBER, { message: CreateOfferValidationMessage.images.invalid })
  @ArrayMaxSize(IMAGES_NUMBER, { message: CreateOfferValidationMessage.images.invalid })
  public images!: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium!: boolean;

  public isFavorite!: boolean;

  public rating!: number;

  @IsEnum(Property, { message: CreateOfferValidationMessage.property.invalidFormat })
  public property!: Property;

  @IsInt({ message: CreateOfferValidationMessage.roomsCount.invalidFormat })
  @Min(RoomsNumber.Min, { message: CreateOfferValidationMessage.roomsCount.invalidFormat })
  @Max(RoomsNumber.Max, { message: CreateOfferValidationMessage.roomsCount.invalidFormat })
  public roomsCount!: number;

  @IsInt({ message: CreateOfferValidationMessage.guestsCount.invalidFormat })
  @Min(GuestsNumber.Min, { message: CreateOfferValidationMessage.guestsCount.invalidFormat })
  @Max(GuestsNumber.Max, { message: CreateOfferValidationMessage.guestsCount.invalidFormat })
  public guestsCount!: number;

  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(PriceValue.Min, { message: CreateOfferValidationMessage.price.minValue })
  @Max(PriceValue.Max, { message: CreateOfferValidationMessage.price.maxValue })
  public price!: number;

  @IsArray({ message: CreateOfferValidationMessage.goods.invalidFormat })
  @ArrayMinSize(GOODS_MIN_COUNT, { message: CreateOfferValidationMessage.goods.minSize })
  @IsEnum(Goods, { each: true, message: CreateOfferValidationMessage.goods.invalidValue })
  public goods!: Goods[];

  public userId!: string;

  public commentCount!: number;

  @IsObject({ message: CreateOfferValidationMessage.location.invalidObject })
  public location!: Location;
}
