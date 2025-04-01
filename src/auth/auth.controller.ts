import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
  HttpStatus,
  UnauthorizedException,
  UseInterceptors,
  BadRequestException,
  UploadedFile as NestUploadedFile,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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
      throw new UnauthorizedException('Invalid email or password');
    }

    const { access_token, user: userData } = this.authService.login(user);

    // Setting the cookie with the token
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      token: access_token,
      user: userData,
    };
  }

  @Post('register')
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: diskStorage({
        destination: './uploads/profiles',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, '${uniqueSuffix}-${file.originalname}');
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async register(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() profileImage: Express.Multer.File,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Add profile image path to user data if a file was uploaded
    let userData = createUserDto;

    if (profileImage) {
      userData = {
        ...createUserDto,
        picture: '/uploads/profiles/${profileImage.filename}',
      };
    }

    const newUser = await this.authService.register(userData);

    const { access_token, user } = this.authService.login(newUser);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      token: access_token,
      user,
    };
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

    // Setting the cookie with the token
    res.cookie('access_token', access_token, {
      httpOnly: true, // Only the server can read the cookie.
      secure: true, // The cookie only works in HTTPS.
      sameSite: 'lax', // Protects against CSRF attacks.
      maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 1 day.
    });

    // redirect to frontend
    return res.redirect('http://localhost:3000');
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  verifyToken(@Request() req, @Res() res: Response) {
    return {
      valid: true,
      user: req.user,
    };
  }
}

// Helper function for file uploads
function UploadedFile() {
  return NestUploadedFile();
}
