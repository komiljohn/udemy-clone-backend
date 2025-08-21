import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

import { JwtGuard } from 'src/guards/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthResponse } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-otp')
  async requestOtp(@Body() dto: RegisterDto) {
    return this.authService.requestOtp(dto);
  }

  @Post('confirm-otp')
  @ApiBody({
    schema: {
      properties: { otp: { type: 'number' }, email: { type: 'string' } },
    },
  })
  async confirmOtp(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: { otp: number; email: string },
  ) {
    return this.authService.confirmOtp(res, dto);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ type: AuthResponse })
  @ApiBody({ type: LoginDto })
  @Post('login')
  login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto,
  ): Promise<AuthResponse> {
    return this.authService.login(res, dto);
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ type: AuthResponse })
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    return this.authService.refresh(req, res);
  }

  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ description: 'User logged out' })
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ type: User })
  @Get('me')
  @UseGuards(JwtGuard)
  getMe(@Req() req: Request & { user: User }) {
    return req.user;
  }
}
