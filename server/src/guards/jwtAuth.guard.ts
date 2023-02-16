import { PassportStrategy } from '@nestjs/passport';
import { Observable } from 'rxjs';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtStrategy } from '../modules/auth/strategies/jwtStrategy';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserJwtPayload } from '../types/interfaces/userJwtPayload';
import * as process from 'process';

@Injectable()
export class JwtAuthGuard extends PassportStrategy(JwtStrategy) {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean | Promise<boolean> | Observable<boolean>> {
    try {
      await this.authenticate(context.switchToHttp().getRequest());

      return true;
    } catch (e: unknown) {
      throw new UnauthorizedException();
    }
  }

  async authenticate(req: Request): Promise<void> {
    const token = req.cookies?.auth_token;

    if (!token) {
      throw new Error('Invalid token');
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || 'super-secret-key',
    ) as UserJwtPayload;

    req.user = await this.validate(payload);
  }
}
