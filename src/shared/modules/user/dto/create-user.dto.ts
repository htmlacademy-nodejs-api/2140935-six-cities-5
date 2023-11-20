import { IsEmail, IsString, Length } from 'class-validator';
import { CreateUserMessages } from './create-user.messages.js';
import { UserType } from '../../../types/index.js';
import { UserNameLength, UserPasswordLength } from '../../../const/index.js';

export class CreateUserDto {
  @IsString({ message: CreateUserMessages.name.invalidFormat })
  @Length(UserNameLength.Min, UserNameLength.Max, { message: CreateUserMessages.name.lengthField })
  public name!: string;

  @IsEmail({}, { message: CreateUserMessages.email.invalidFormat })
  public email!: string;

  @IsString({ message: CreateUserMessages.password.invalidFormat })
  @Length(UserPasswordLength.Min, UserPasswordLength.Max, { message: CreateUserMessages.password.lengthField })
  public password!: string;

  public userType!: UserType;

  public favorites: string[];
}
