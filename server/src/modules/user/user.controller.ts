import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwtAuth.guard';
import { AuthorizedRequest } from '../../types/authorizedRequest';
import { UserInfoDto } from '../../types/dto/user/getUserDto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  async get(@Req() req: AuthorizedRequest): Promise<UserInfoDto> {
    return await this.userService.findOmitPassword(req.user);
  }
}
