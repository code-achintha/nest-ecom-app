import { Injectable } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto';

@Injectable()
export class AuthService {
  login(loginUserDto: LoginUserDto) {
    return { message: 'login' };
  }

  register(registerUserDto: RegisterUserDto) {
    return { message: 'register' };
  }
}
