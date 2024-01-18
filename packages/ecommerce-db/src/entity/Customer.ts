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

  // @OneToMany(() => Billing, (billing) => billing.id)
  // billing: Relation<Billing[]>;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
