import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  // get jwt token
  async signToken(id: number, email: string): Promise<Record<string, string>> {
    const token = await this.jwtService.signAsync(
      { sub: id, email },
      {
        expiresIn: '15m',
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );

    return {
      access_token: token,
    };
  }

  // find an user by email
  findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  // login
  async login(
    loginUserDto: LoginUserDto,
  ): Promise<Record<string, string> | null> {
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

    // return jwt token
    return this.signToken(user.id, user.email);
  }

  // register
  async register(
    registerUserDto: RegisterUserDto,
  ): Promise<Record<string, string> | null> {
    const { username, email, password } = registerUserDto;

    // check if an user already exists by the given email.
    const existingUser = await this.findOneByEmail(email);

    // throw an error if an user already exists by the given email.
    if (existingUser) {
      throw new ConflictException('User already exists!');
    }

    // hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // create the new user
    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    // save the new user
    await this.userRepository.save(newUser);

    // return jwt token
    return this.signToken(newUser.id, newUser.email);
  }
}
