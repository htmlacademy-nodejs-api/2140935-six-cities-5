import { City, Property, Goods, Location } from '../../../types/index.js';
import { IsArray, ArrayMinSize, ArrayMaxSize, IsBoolean, IsObject, IsEnum, IsInt, IsOptional, Max, MaxLength, Min, MinLength } from 'class-validator';
import { CreateOfferValidationMessage } from './create-offer.messages.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(10, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.title.maxLength })
  public title?: string;

  @IsOptional()
  @MinLength(20, { message: CreateOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: CreateOfferValidationMessage.description.maxLength })
  public description?: string;

  @IsOptional()
  @IsEnum(City, { message: CreateOfferValidationMessage.city.invalid })
  public city?: City;

  @IsOptional()
  @MaxLength(256, { message: CreateOfferValidationMessage.images.maxLength })
  public preview?: string;

  @IsOptional()
  @IsArray({ message: CreateOfferValidationMessage.images.invalid })
  @ArrayMinSize(6, { message: CreateOfferValidationMessage.images.invalid })
  @ArrayMaxSize(6, { message: CreateOfferValidationMessage.images.invalid })
  public images?: string[];

  @IsOptional()
  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsOptional()
  @IsInt({ message: CreateOfferValidationMessage.rating.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.rating.invalidFormat })
  @Max(5, { message: CreateOfferValidationMessage.rating.invalidFormat })
  public rating?: number; //TODO сейчас дробные рейтинги не проходят

  @IsOptional()
  @IsEnum(Property, { message: CreateOfferValidationMessage.property.invalidFormat })
  public property?: Property;

  @IsOptional()
  @IsInt({ message: CreateOfferValidationMessage.roomsCount.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.roomsCount.invalidFormat })
  @Max(8, { message: CreateOfferValidationMessage.roomsCount.invalidFormat })
  public roomsCount?: number;

  @IsOptional()
  @IsInt({ message: CreateOfferValidationMessage.guestsCount.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.guestsCount.invalidFormat })
  @Max(10, { message: CreateOfferValidationMessage.guestsCount.invalidFormat })
  public guestsCount?: number;

  @IsOptional()
  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.price.minValue })
  @Max(100000, { message: CreateOfferValidationMessage.price.maxValue })
  public price?: number;

  @IsOptional()
  @IsArray({ message: CreateOfferValidationMessage.goods.invalidFormat })
  @ArrayMinSize(1, { message: CreateOfferValidationMessage.goods.minSize })
  @IsEnum(Goods, { each: true, message: CreateOfferValidationMessage.goods.invalidValue })
  public goods?: Goods[];

  @IsOptional()
  @IsObject({ message: CreateOfferValidationMessage.location.invalidObject })
  public location?: Location; //TODO не проверяются значения внтури объекта
}
