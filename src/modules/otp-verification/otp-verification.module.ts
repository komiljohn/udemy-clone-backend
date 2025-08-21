import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OtpVerification } from 'src/entities/otp_verification.entity';
import { OtpVerificationService } from './otp-verification.service';

@Module({
  imports: [MikroOrmModule.forFeature([OtpVerification])],
  providers: [OtpVerificationService],
})
export class OtpVerificationModule {}
