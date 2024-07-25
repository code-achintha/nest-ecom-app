import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User | null> {
    const { username, email, password } = createUserDto;

    // encrypt password
    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });
    
    return this.userRepository.save(user);
  }

  findOne(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }
}
