import { IsInt, Min, Max, IsMongoId, IsString, Length } from 'class-validator';
import { CreateCommentMessages } from './create-comment.messages.js';

export class CreateCommentDto {
  @IsString({ message: CreateCommentMessages.text.invalidFormat })
  @Length(5, 1024, { message: 'min is 5, max is 1024 '})
  public text: string;

  @IsInt({ message: CreateCommentMessages.rating.invalidFormat })
  @Min(1, { message: CreateCommentMessages.rating.invalidValue })
  @Max(5, { message: CreateCommentMessages.rating.invalidValue })
  public rating: number;

  public offerId: string;

  @IsMongoId({ message: CreateCommentMessages.userId.invalidFormat })
  public userId: string;
}
