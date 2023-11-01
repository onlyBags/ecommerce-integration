import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Relation,
  OneToOne,
} from 'typeorm';

import { Customer, User } from './index.js';
import { stringToBool } from '../utils/index.js';

@Entity()
export class OrderLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  transactionHash: string;

  @Column({ type: 'varchar', length: 20 })
  orderStatus: string;

  @ManyToOne(() => Customer, (customer) => customer.wallet)
  customer: Relation<Customer>;

  @ManyToOne(() => User, (user) => user.id)
  user: Relation<User>;

  @Column({ type: 'double', nullable: true })
  amount: string;

  @Column({ type: 'boolean', default: false, transformer: stringToBool })
  isValidated: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
