import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { UserParam } from 'src/Decorator/user-param.decorator';
import type { Response } from 'express';
import { User } from 'src/modules/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@UserParam() user: User, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(user, res);
  }
}
