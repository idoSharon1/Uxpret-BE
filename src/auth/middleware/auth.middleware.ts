import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // List of paths that do not require matching
    const publicPaths = [
      '/',
      '/api/website/analyze',
      '/auth/login',
      '/auth/register',
      '/auth/google',
      '/auth/google/callback',
    ];

    // Check if the request path is in the public paths list
    if (publicPaths.some((path) => req.path.startsWith(path))) {
      return next();
    }

    try {
      // Try to get the token from the Authorization header or the cookie
      const token =
        req.headers.authorization?.split(' ')[1] || req.cookies?.access_token;

      if (this.configService.get<string>('RUNNIGN_MODE') === 'development') {
        req.user = {
          userId: '67e92091e4ef47c4fb3809ab',
          username: '67e92091e4ef47c4fb3809ab',
          email: '67e92091e4ef47c4fb3809ab@gmail.com',
        };

        next();
      }

      if (!token) {
        throw new UnauthorizedException('Authentication required');
      }

      // Verify the token
      const payload = this.jwtService.verify(token, {
        secret:
          this.configService.get<string>('JWT_SECRET') ||
          process.env.JWT_SECRET,
      });

      // Check if the user exists
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Add the user to the request object
      req.user = {
        userId: payload.sub,
        username: user.username,
        email: user.email,
      };

      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
