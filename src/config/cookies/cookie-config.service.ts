import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

@Injectable()
export class CookieConfigService {
  public readonly cookieOptions: {
    accessToken: CookieOptions;
  };

  constructor(private configService: ConfigService) {
    this.cookieOptions = {
      accessToken: {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: parseInt(this.configService.getOrThrow('ACCESSTOKEN_COOKIE_EXPIRES_IN'), 10),
      },
    };
  }
}
