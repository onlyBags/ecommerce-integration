import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { encrypt } from '../utils/index.js';
import { User } from './User.js';

@Entity()
export class UserKey {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.keys)
  user: User;

  @Column()
  platform: 'Woocommerce' | 'Magento';

  @Column({ length: 1000 })
  baseUrl: string;

  @Column({
    transformer: encrypt,
  })
  consumerKey: string;

  @Column({
    transformer: encrypt,
  })
  consumerSecret: string;

  @Column()
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
