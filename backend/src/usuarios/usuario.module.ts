import { Module } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [UsuarioController],
  providers: [UsuarioService, PrismaService],
  imports: [],
  exports: [],
})
export class UsuarioModule {}
