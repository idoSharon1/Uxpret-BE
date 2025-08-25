import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const { access_token, user: userData } = this.authService.login(user);

    // Setting the cookie with the token
    res.cookie('access_token', access_token, {
      maxAge: 24 * 60 * 60 * 1000,
    });

    return userData;
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const newUser = await this.authService.register(createUserDto);

    const { access_token, user } = this.authService.login(newUser);

    res.cookie('access_token', access_token, {
      maxAge: 24 * 60 * 60 * 1000,
    });

    return user;
  }

  // start of google auth
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  //Google (callback)
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Request() req, @Res() res: Response) {
    const { access_token, user } = this.authService.googleLogin(req.user);
    console.log(JSON.stringify(user));

    return res.redirect(
      `${process.env.FRONTEND_URL}?access_token=${access_token}&user=${JSON.stringify(user)}` ||
        'http://localhost:3000?access_token=${access_token}&user=${JSON.stringify(user)}',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
