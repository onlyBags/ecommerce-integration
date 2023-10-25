import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToMany,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Customer } from './Customer.js';

@Entity({
  name: 'order',
})
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @Column()
  orderId: number;

  @Column()
  status: string;

  @Column({ default: 'USD' })
  currency: string;

  @Column()
  total: number;

  @Column()
  orderKey: string;

  @Column()
  iceValue: number;

  @Column()
  iceValueTimestamp: Date;
}
