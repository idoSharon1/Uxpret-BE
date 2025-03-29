import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Check if the token is sent in the header HTTP Authorization
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        // Check if the token is sent in the cookie
        (request: Request) => {
          const cookie = request.cookies?.access_token;
          if (!cookie) {
            return null;
          }
          return cookie;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return {
        userId: payload.sub,
        username: user.username,
        email: user.email,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
