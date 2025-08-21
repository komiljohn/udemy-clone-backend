import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { mikroOrmConfigFactory } from './configs/mikro-orm.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TopicModule } from './modules/topic/topic.module';
import { CourseModule } from './modules/course/course.module';
import { MailModule } from './modules/mail/mail.module';
import { OtpVerificationModule } from './modules/otp-verification/otp-verification.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    PassportModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mikroOrmConfigFactory,
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    TopicModule,
    CourseModule,
    MailModule,
    OtpVerificationModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
