import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { OtpVerification } from 'src/entities/otp_verification.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class OtpVerificationService {
  constructor(
    @InjectRepository(OtpVerification)
    private readonly otpVerificationRepo: EntityRepository<OtpVerification>,
    private readonly em: EntityManager,
  ) {}

  private readonly logger = new Logger(OtpVerificationService.name);

  // Run cleanup every hour
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    const now = new Date();

    const deleted = await this.em.nativeDelete(OtpVerification, {
      expiresAt: { $lt: now },
    });

    if (deleted > 0) {
      this.logger.log(`🧹 Cleaned up ${deleted} expired OTPs`);
    }
  }
}
