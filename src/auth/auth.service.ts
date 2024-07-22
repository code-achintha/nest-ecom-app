import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    // find user by email
    const user = await this.findOneByEmail(email);

    // throw an error if user not found
    if (!user) {
      throw new ForbiddenException('Invalid Credentials!');
    }

    // compare passwords if user exists
    const matchPasswords = await bcryptjs.compare(password, user.password);

    // throw an error if passwords not matches
    if (!matchPasswords) {
      throw new ForbiddenException('Invalid Credentials!');
    }

    // return the user
    return user;
  }

  async register(registerUserDto: RegisterUserDto) {
    const { username, email, password } = registerUserDto;

    // check if an user already exists by the given email.
    const existingUser = await this.findOneByEmail(email);

    // throw an error if an user already exists by the given email.
    if (existingUser) {
      throw new ConflictException('User already exists!');
    }

    // hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // create and save the new user
    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    // save and return the user
    return this.userRepository.save(newUser);
  }
}
