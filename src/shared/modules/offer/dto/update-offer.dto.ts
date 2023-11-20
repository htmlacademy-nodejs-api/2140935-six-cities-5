import { City, Property, Goods, Location } from '../../../types/index.js';
import { IsArray, ArrayMinSize, ArrayMaxSize, IsBoolean, IsObject, IsEnum, IsInt, IsOptional, Max, MaxLength, Min, MinLength } from 'class-validator';
import { CreateOfferValidationMessage } from './create-offer.messages.js';
import { IMAGES_NUMBER, PREVIEW_MAX_LENGTH, GOODS_MIN_COUNT, OfferTitleLength, DescriptionLength, RoomsNumber, GuestsNumber, PriceValue } from '../../../const/index.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(OfferTitleLength.Min, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(OfferTitleLength.Max, { message: CreateOfferValidationMessage.title.maxLength })
  public title?: string;

  @IsOptional()
  @MinLength(DescriptionLength.Min, { message: CreateOfferValidationMessage.description.minLength })
  @MaxLength(DescriptionLength.Max, { message: CreateOfferValidationMessage.description.maxLength })
  public description?: string;

  @IsOptional()
  @IsEnum(City, { message: CreateOfferValidationMessage.city.invalid })
  public city?: City;

  @IsOptional()
  @MaxLength(PREVIEW_MAX_LENGTH, { message: CreateOfferValidationMessage.images.maxLength })
  public preview?: string;

  @IsOptional()
  @IsArray({ message: CreateOfferValidationMessage.images.invalid })
  @ArrayMinSize(IMAGES_NUMBER, { message: CreateOfferValidationMessage.images.invalid })
  @ArrayMaxSize(IMAGES_NUMBER, { message: CreateOfferValidationMessage.images.invalid })
  public images?: string[];

  @IsOptional()
  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(Property, { message: CreateOfferValidationMessage.property.invalidFormat })
  public property?: Property;

  @IsOptional()
  @IsInt({ message: CreateOfferValidationMessage.roomsCount.invalidFormat })
  @Min(RoomsNumber.Min, { message: CreateOfferValidationMessage.roomsCount.invalidFormat })
  @Max(RoomsNumber.Max, { message: CreateOfferValidationMessage.roomsCount.invalidFormat })
  public roomsCount?: number;

  @IsOptional()
  @IsInt({ message: CreateOfferValidationMessage.guestsCount.invalidFormat })
  @Min(GuestsNumber.Min, { message: CreateOfferValidationMessage.guestsCount.invalidFormat })
  @Max(GuestsNumber.Max, { message: CreateOfferValidationMessage.guestsCount.invalidFormat })
  public guestsCount?: number;

  @IsOptional()
  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(PriceValue.Min, { message: CreateOfferValidationMessage.price.minValue })
  @Max(PriceValue.Max, { message: CreateOfferValidationMessage.price.maxValue })
  public price?: number;

  @IsOptional()
  @IsArray({ message: CreateOfferValidationMessage.goods.invalidFormat })
  @ArrayMinSize(GOODS_MIN_COUNT, { message: CreateOfferValidationMessage.goods.minSize })
  @IsEnum(Goods, { each: true, message: CreateOfferValidationMessage.goods.invalidValue })
  public goods?: Goods[];

  @IsOptional()
  @IsObject({ message: CreateOfferValidationMessage.location.invalidObject })
  public location?: Location;
}
