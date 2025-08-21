import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService) {}

  async sendWelcome(to: string, name: string) {
    await this.mailer.sendMail({
      to,
      subject: 'Welcome to Widgetjoy 🎉',
      template: 'welcome', // welcome.hbs
      context: {
        userName: name,
        loginUrl: 'https://abcd.com/login',
        userEmail: to,
      },
    });
  }

  async sendRegisterOtp(to: string, name: string, otpCode: number) {
    await this.mailer.sendMail({
      to,
      subject: 'Verify your email | Udemy clone',
      template: 'register-otp',
      context: {
        userName: name,
        otpCode,
        userEmail: to,
      },
    });
  }

  async sendPlain(to: string, subject: string, text: string) {
    await this.mailer.sendMail({ to, subject, text });
  }
}
