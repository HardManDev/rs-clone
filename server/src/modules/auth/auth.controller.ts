import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  Post,
  Query,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginUserRequestDto,
  RegisterUserRequestDto,
  RegisterUserResponseDto,
} from '../../types/dto/user/authUserDto';
import { AuthProvider } from '../../types/enums/authProviders';
import { Response } from 'express';
import { UserAlreadyExists } from '../../errors/userAlreadyExists';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Res() res: Response,
    @Query() { provider }: { provider: AuthProvider },
    @Body() user: RegisterUserRequestDto,
  ): Promise<RegisterUserResponseDto> {
    try {
      if (!provider || provider === AuthProvider.LOCAL) {
        const registeredUser = await this.authService.register(
          {
            ...user,
          },
          AuthProvider.LOCAL,
        );

        res.cookie('auth_token', registeredUser.accessToken, {
          sameSite: 'none',
          secure: true,
        });

        res.status(HttpStatus.OK).send(registeredUser);
        return registeredUser;
      }
    } catch (e: unknown) {
      if (e instanceof UserAlreadyExists) {
        throw new ConflictException(e.message);
      }

      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
    }

    throw new BadRequestException('Invalid auth provider.');
  }

  @Post('login')
  async login(
    @Res() res: Response,
    @Query() { provider }: { provider: AuthProvider },
    @Body() user: LoginUserRequestDto,
  ): Promise<LoginUserRequestDto> {
    try {
      if (!provider || provider === AuthProvider.LOCAL) {
        const registeredUser = await this.authService.login(
          {
            ...user,
          },
          AuthProvider.LOCAL,
        );

        res.cookie('auth_token', registeredUser.accessToken);

        res.status(HttpStatus.OK).send(registeredUser);
        return registeredUser;
      }
    } catch (e: unknown) {
      if (e instanceof UnauthorizedException) {
        throw new UnauthorizedException(e.message);
      }

      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
    }

    throw new BadRequestException('Invalid auth provider.');
  }
}
