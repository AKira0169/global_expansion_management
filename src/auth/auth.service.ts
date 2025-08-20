import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { TokenPayload } from 'src/types/token.payload';
import type { Response } from 'express';
import { CookieConfigService } from 'src/config/cookies/cookie-config.service';
import { UsersService } from 'src/modules/users/users.service';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private cookieConfigService: CookieConfigService,
  ) {}

  async validateUser({ email, password }: SignInDto) {
    const user = await this.userService.findByEmail(email);
    if (user && (await user.validatePassword(password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid email or password');
  }

  login(user: User, res: Response) {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
    };
    const accessToken = this.jwtService.sign(payload);

    res.cookie('accessToken', accessToken, this.cookieConfigService.cookieOptions.accessToken);

    return {
      accessToken: accessToken,
    };
  }

  async signUp(signUpDto: SignUpDto) {
    const user = await this.userService.create(signUpDto);
    return user;
  }
}
