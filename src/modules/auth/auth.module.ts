import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { getJwtConfigAsync } from 'src/configs/jwt.config';
import { MailModule } from '../mail/mail.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OtpVerification } from 'src/entities/otp_verification.entity';

@Module({
  imports: [
    JwtModule.registerAsync(getJwtConfigAsync),
    UserModule,
    MailModule,
    MikroOrmModule.forFeature([OtpVerification]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
