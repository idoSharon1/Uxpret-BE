import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    const currentClientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const currentClientSecret = configService.get<string>(
      'GOOGLE_CLIENT_SECRET',
    );
    const callback =
      configService.get<string>('GOOGLE_CALLBACK_URL') ||
      'http://localhost:3000/auth/google/callback';

    if (!currentClientID || !currentClientSecret) {
      throw new Error('Missing Google OAuth credentials');
    }

    super({
      clientID: currentClientID,
      clientSecret: currentClientSecret,
      callbackURL: callback,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const { name, emails, photos, id } = profile;

    const user = {
      email: emails && emails.length > 0 ? emails[0].value : '',
      firstName: name?.givenName || '',
      lastName: name?.familyName || '',
      picture: photos && photos.length > 0 ? photos[0].value : '',
      googleId: id,
      accessToken,
    };

    return await this.authService.validateOrCreateGoogleUser(user);
  }
}
