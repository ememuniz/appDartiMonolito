import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'O formato do e-mail é inválido.' })
  @IsNotEmpty({ message: 'O e-mail precisa ser informado.' })
  email!: string;
  @IsNotEmpty({ message: 'A senha precisa ser informada.' })
  senha!: string;
}
