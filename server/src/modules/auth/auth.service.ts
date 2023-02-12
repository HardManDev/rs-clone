import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import {
  LoginUserRequestDto,
  LoginUserResponseDto,
  RegisterUserRequestDto,
  RegisterUserResponseDto,
} from '../../types/dto/user/authUserDto';
import { AuthProvider } from '../../types/enums/authProviders';
import { IUser } from '../../types/interfaces/user';
import { UserJwtPayload } from '../../types/interfaces/userJwtPayload';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly saltRounds =
    Number(process.env.PASWORD_HASH_SALT_ROUNDS) || 10;

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

  async login(
    user: LoginUserRequestDto,
    authProvider: AuthProvider,
  ): Promise<LoginUserResponseDto> {
    switch (authProvider) {
      case AuthProvider.LOCAL:
        return await this.loginLocal(user);
    }
  }

  private async registerLocal(
    user: RegisterUserRequestDto,
  ): Promise<RegisterUserResponseDto> {
    if (!user.password) {
      throw new BadRequestException(
        'For a local authorization provider, a password must be provided.',
      );
    }

    const encryptedPassword = await bcrypt.hash(user.password, this.saltRounds);
    const newUser = await this.userService.create({
      authProvider: AuthProvider.LOCAL,
      ...user,
      password: encryptedPassword,
    });
    const accessToken = this.createJwtToken(newUser);

    return {
      _id: newUser._id,
      username: newUser.username,
      authProvider: newUser.authProvider,
      accessToken,
    };
  }

  private async loginLocal(
    user: LoginUserRequestDto,
  ): Promise<LoginUserResponseDto> {
    let targetUser: IUser;
    let accessToken: string;

    if (!user.password) {
      throw new BadRequestException(
        'For a local authorization provider, a password must be provided.',
      );
    }

    try {
      targetUser = await this.userService.findByUserNameAndAuthProvider(
        user.username,
        AuthProvider.LOCAL,
      );
      accessToken = this.createJwtToken(targetUser);
    } catch (e: unknown) {
      throw new UnauthorizedException('User not found or password incorrect.');
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!(await bcrypt.compare(user.password, targetUser.password!))) {
      throw new UnauthorizedException('User not found or password incorrect.');
    }

    return {
      _id: targetUser._id,
      username: targetUser.username,
      authProvider: targetUser.authProvider,
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
