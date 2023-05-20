import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { UserKey } from './UserKey.js';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  username: string;

  @Column({ length: 1000 })
  apiKey: string;

  @OneToMany(() => UserKey, (userKey) => userKey.user)
  keys: UserKey[];

  @Column()
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
