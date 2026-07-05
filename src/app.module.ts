import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HackathonsModule } from './hackathons/hackathons.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule, HackathonsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
