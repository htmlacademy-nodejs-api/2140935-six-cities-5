import { IsArray, IsEnum, IsInt, IsBoolean, Max, MaxLength, Min, MinLength, IsObject, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { City, Property, Goods, Location } from '../../../types/index.js';
import { CreateOfferValidationMessage } from './create-offer.messages.js';

export class CreateOfferDto {
  @MinLength(10, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.title.maxLength })
  public title!: string;

  @MinLength(20, { message: CreateOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: CreateOfferValidationMessage.description.maxLength })
  public description!: string;

  public offerDate!: Date;

  @IsEnum(City, { message: CreateOfferValidationMessage.city.invalid })
  public city!: City;

  @MaxLength(256, { message: CreateOfferValidationMessage.images.maxLength })
  public preview!: string;

  @IsArray({ message: CreateOfferValidationMessage.images.invalid })
  @ArrayMinSize(6, { message: CreateOfferValidationMessage.images.invalid })
  @ArrayMaxSize(6, { message: CreateOfferValidationMessage.images.invalid })
  public images!: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium!: boolean;

  public isFavorite!: boolean;

  public rating!: number;

  @IsEnum(Property, { message: CreateOfferValidationMessage.property.invalidFormat })
  public property!: Property;

  @IsInt({ message: CreateOfferValidationMessage.roomsCount.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.roomsCount.invalidFormat })
  @Max(8, { message: CreateOfferValidationMessage.roomsCount.invalidFormat })
  public roomsCount!: number;

  @IsInt({ message: CreateOfferValidationMessage.guestsCount.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.guestsCount.invalidFormat })
  @Max(10, { message: CreateOfferValidationMessage.guestsCount.invalidFormat })
  public guestsCount!: number;

  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.price.minValue })
  @Max(100000, { message: CreateOfferValidationMessage.price.maxValue })
  public price!: number;

  @IsArray({ message: CreateOfferValidationMessage.goods.invalidFormat })
  @ArrayMinSize(1, { message: CreateOfferValidationMessage.goods.minSize })
  @IsEnum(Goods, { each: true, message: CreateOfferValidationMessage.goods.invalidValue })
  public goods!: Goods[];

  public userId!: string;

  public commentCount!: number;

  @IsObject({ message: CreateOfferValidationMessage.location.invalidObject })
  public location!: Location; //TODO не проверяются значения внтури объекта
}
