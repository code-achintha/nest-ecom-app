import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto';
import { User } from 'src/users/entities/user.entity';
import * as bcryptjs from 'bcryptjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  // validate user
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOne(email);

    if (!user) return null;

    // compare passwords
    const matchPasswords = await bcryptjs.compare(password, user.password);

    if (!matchPasswords) return null;

    return user;
  }

  // login
  async login(loginUserDto: LoginUserDto): Promise<User | null> {
    const { email, password } = loginUserDto;

    // validate user
    const user = await this.validateUser(email, password);

    // throw an error if user not found
    if (!user) throw new ForbiddenException('Invalid Credentials!');

    // return user
    return user;
  }

  // register
  async register(registerUserDto: RegisterUserDto): Promise<User | null> {
    const { email } = registerUserDto;

    // check if an user already exists by the given email.
    const existingUser = await this.usersService.findOne(email);

    // throw an error if an user already exists by the given email.
    if (existingUser) throw new ConflictException('User already exists!');

    // create the new user
    const user = await this.usersService.create(registerUserDto);

    // return user
    return user;
  }
}
