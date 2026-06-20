import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class CriarUsuarioDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do usuário precisa ser informado' })
  nome!: string;

  @IsEmail({}, { message: 'O formato do e-mail é inválido.' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
  senha!: string;

  @IsString()
  @IsNotEmpty({ message: 'O código de convite é obrigatório.' })
  convite!: string;
}

//_ITEM: VAI RETORNAR ISSO AQUI SE DER O EMAIL VIER VAZIO, POR EXEMPLO
//__ITEM:{
//__ITEM:  "message": [
//__ITEM:    "O formato do e-mail é inválido."
//__ITEM:  ],
//__ITEM:  "error": "Bad Request",
//__ITEM:  "statusCode": 400
//__ITEM:}
//_ITEM: ESSA E A MENSAGEM QUE VAI RETORNAR DIRETO PARA O FRONTEND
