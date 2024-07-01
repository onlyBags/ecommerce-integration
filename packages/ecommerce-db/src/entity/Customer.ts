import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Unique,
  Relation,
} from 'typeorm';
import { Order } from './Order.js';
import { BinanceOrder } from './BinanceOrder.js';

@Entity()
@Unique(['wallet'])
export class Customer {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  wallet: string;

  // @OneToMany(() => Order, (order) => order.id)
  // orders: Relation<Order[]>;

  // @OneToMany(() => Shipping, (shipping) => shipping.id)
  // shipping: Relation<Shipping[]>;

  @Column({ default: 'no@mail.com' })
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
