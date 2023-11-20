import { IsInt, Min, Max, IsString, Length } from 'class-validator';
import { CreateCommentMessages } from './create-comment.messages.js';
import { TextLength, RatingValue } from '../../../const/index.js';

export class CreateCommentDto {
  @IsString({ message: CreateCommentMessages.text.invalidFormat })
  @Length(TextLength.Min, TextLength.Max, { message: `min is ${TextLength.Min}, max is ${TextLength.Max}`})
  public text: string;

  @IsInt({ message: CreateCommentMessages.rating.invalidFormat })
  @Min(RatingValue.Min, { message: CreateCommentMessages.rating.invalidValue })
  @Max(RatingValue.Max, { message: CreateCommentMessages.rating.invalidValue })
  public rating: number;

  public offerId: string;

  public userId: string;
}
