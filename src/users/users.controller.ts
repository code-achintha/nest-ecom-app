import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  @UseGuards(AuthGuard('local'))
  @Get('me')
  getMe(@Request() req: Request) {
    return 'hello';
  }
}
