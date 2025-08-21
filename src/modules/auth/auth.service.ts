import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcryptjs';
import type { Request, Response } from 'express';
import isDev from 'src/utils/is-dev.util';
import { JwtPayload } from 'src/interfaces/jwt.interface';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { MailService } from '../mail/mail.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { OtpVerification } from 'src/entities/otp_verification.entity';
import { EntityRepository } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class AuthService {
  private readonly jwtAccessTokenTtl: string;
  private readonly jwtRefreshTokenTtl: string;
  private readonly cookieDomain: string;

  constructor(
    private readonly em: EntityManager,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    @InjectRepository(OtpVerification)
    private readonly otpVerificationRepo: EntityRepository<OtpVerification>,
  ) {
    this.jwtAccessTokenTtl = configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_TTL',
    );
    this.jwtRefreshTokenTtl = configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_TTL',
    );
    this.cookieDomain = configService.getOrThrow<string>('COOKIE_DOMAIN');
  }

  private generateToken(userId: string) {
    const payload = { id: userId };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.jwtAccessTokenTtl,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.jwtRefreshTokenTtl,
    });

    return { accessToken, refreshToken };
  }

  private auth(res: Response, id: string) {
    const { accessToken, refreshToken } = this.generateToken(id);

    this.setCookie(res, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60));

    return { accessToken };
  }

  private setCookie(res: Response, value: string, expires: Date) {
    res.cookie('refreshToken', value, {
      expires,
      httpOnly: true,
      domain: this.cookieDomain,
      secure: !isDev(this.configService),
      sameSite: isDev(this.configService) ? 'none' : 'lax',
    });
  }

  logout(res: Response) {
    res.clearCookie('refreshToken');
    return 'Logged out';
  }

  async validateUser(id: string) {
    const user = await this.userService.findOne(id);

    if (!user) throw new UnauthorizedException('User not found');

    return user;
  }

  async requestOtp(dto: RegisterDto) {
    // verify the uniqueness of email
    const existUser = await this.userService.findOneByEmail(dto.email);

    if (existUser) {
      throw new ConflictException('User with this email already exists');
    }

    const otp = await this.otpVerificationRepo.findOne({ email: dto.email });

    if (otp) {
      throw new NotFoundException('Previous sent OTP is still valid');
    }

    const randomOtp = Math.floor(100000 + Math.random() * 900000); // 6 digit
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const hashedPassword = await hash(dto.password, 10);

    const otpVerification = this.otpVerificationRepo.create({
      email: dto.email,
      otp: randomOtp,
      passwordHash: hashedPassword,
      expiresAt: expiresAt,
      name: dto.name,
    });

    await this.em.persistAndFlush(otpVerification);

    // send code
    await this.mailService.sendRegisterOtp(dto.email, dto.name, randomOtp);

    return { message: 'OTP code is sent to your email' };
  }

  async confirmOtp(res: Response, dto: { otp: number; email: string }) {
    const otp = await this.otpVerificationRepo.findOne({ email: dto.email });

    if (!otp) {
      throw new NotFoundException(
        'Your OTP code seems like to be expired. Please request a new one.',
      );
    }

    const user = await this.userService.create({
      email: dto.email,
      name: otp.name,
      password: otp.passwordHash,
    });

    return this.auth(res, user.id);
  }

  async refresh(req: Request, res: Response) {
    const cookies = req.cookies as Record<string, string>;

    const refreshToken = cookies['refreshToken'];

    if (!refreshToken) throw new UnauthorizedException();

    const payload: JwtPayload =
      await this.jwtService.verifyAsync<JwtPayload>(refreshToken);

    const user = await this.userService.findOneOrFail(payload.id);

    return this.auth(res, user.id);
  }

  async login(res: Response, dto: LoginDto) {
    const user = await this.userService.findOneByEmail(dto.email);

    if (!user) {
      throw new NotFoundException('Invalid email or password');
    }

    const isPasswordValid = await compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new NotFoundException('Invalid email or password');
    }

    return this.auth(res, user.id);
  }
}
