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
import { Shipping } from './Shipping.js';
import { Billing } from './Billing.js';
import { Order } from './Order.js';

@Entity()
@Unique(['wallet'])
export class Customer {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  wallet: string;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @OneToMany(() => Shipping, (shipping) => shipping.customer)
  shipping: Relation<Shipping[]>;

  @OneToMany(() => Billing, (billing) => billing.customer)
  billing: Relation<Billing[]>;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
