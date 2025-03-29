import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      const userObj = (user as any).toObject ? (user as any).toObject() : user;
      const { password, ...result } = userObj;
      return result;
    }
    return null;
  }

  login(user: any) {
    const payload = {
      username: user.username,
      email: user.email,
      sub: user._id,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async register(userData: any) {
    const existingUsername = await this.usersService.findOne(userData.username);
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    const existingEmail = await this.usersService.findByEmail(userData.email);
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    try {
      const user = await this.usersService.createUser(userData);

      // Converting a mongoose document to a regular object and removing the password
      const userObject =
        typeof (user as any)?.toObject === 'function'
          ? (user as any).toObject()
          : user;
      const { password, ...result } = userObject;

      return result;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('User already exists');
      }
      throw error;
    }
  }

  async validateOrCreateGoogleUser(googleUser: any): Promise<User> {
    let user = await this.usersService.findByEmail(googleUser.email);

    if (!user) {
      const username = googleUser.email.split('@')[0];
      let uniqueUsername = username;
      let counter = 1;

      // Make sure the username is unique
      while (await this.usersService.findOne(uniqueUsername)) {
        uniqueUsername = `${username}${counter}`;
        counter++;
      }

      user = await this.usersService.createUser({
        username: uniqueUsername,
        email: googleUser.email,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        googleId: googleUser.googleId,
        picture: googleUser.picture,
      });
    } else {
      // Update Google ID details and photo if the user already exists
      if (googleUser.googleId && !user.googleId) {
        // Using email instead of id
        if (user.email) {
          user = await this.usersService.updateUserByEmail(user.email, {
            googleId: googleUser.googleId,
            picture: googleUser.picture || user.picture,
          });
        }
      }
    }

    return user!;
  }

  googleLogin(user: any) {
    const payload = { email: user.email, sub: user._id || user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id || user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
      },
    };
  }
}
