import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants, JwtUserInfo, limits } from './constants';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './auth.decorators';

@Injectable()
export class AuthCookieGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['token'] as string;
    console.log(token);
    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync<JwtUserInfo>(token, {
        secret: jwtConstants.secret,
      });
      request['user'] = payload;

      const controllerRole = this.reflector.getAllAndOverride<limits[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!controllerRole?.includes(payload.limits)) {
        throw new UnauthorizedException();
      }
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
