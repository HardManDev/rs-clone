import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import {
  RegisterUserRequestDto,
  RegisterUserResponseDto,
} from '../../types/dto/user/authUserDto';
import { AuthProvider } from '../../types/enums/authProviders';
import { IUser } from '../../types/interfaces/user';
import { UserJwtPayload } from '../../types/interfaces/userJwtPayload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(
    user: RegisterUserRequestDto,
    authProvider: AuthProvider,
  ): Promise<RegisterUserResponseDto> {
    switch (authProvider) {
      case AuthProvider.LOCAL:
        return await this.registerLocal(user);
    }
  }

  private async registerLocal(
    user: RegisterUserRequestDto,
  ): Promise<RegisterUserResponseDto> {
    const newUser = await this.userService.create({
      authProvider: AuthProvider.LOCAL,
      ...user,
    });
    const accessToken = this.createJwtToken(newUser);

    return {
      _id: newUser._id,
      username: newUser.username,
      authProvider: newUser.authProvider,
      accessToken,
    };
  }

  private createJwtToken(user: IUser): string {
    const payload: UserJwtPayload = {
      id: user._id,
      username: user.username,
      authProvider: user.authProvider,
    };

    return this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET') || 'super-secret-key',
      expiresIn: this.config.get('JWT_EXPIRES_IN') || '24h',
    });
  }
}
