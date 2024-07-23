import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Exclude()
  @Column({ nullable: false })
  password: string;

  @Exclude()
  @CreateDateColumn({
    name: 'created_at'
  })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({
    name: 'updated_at'
  })
  updatedAt: Date;
}
