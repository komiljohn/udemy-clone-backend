import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

function getJwtConfig(configService: ConfigService): JwtModuleOptions {
  return {
    secret: configService.get('JWT_SECRET'),
    signOptions: {
      expiresIn: configService.get('JWT_ACCESS_TOKEN_TTL'),
    },
    verifyOptions: {
      ignoreExpiration: true,
    },
  };
}

export const getJwtConfigAsync: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: getJwtConfig,
};
