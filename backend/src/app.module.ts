import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UsuarioModule } from './usuarios/usuario.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UsuarioModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
