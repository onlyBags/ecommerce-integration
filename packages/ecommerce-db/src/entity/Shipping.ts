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
  name: 'customer_shipping',
})
export class Shipping {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // shippingId: number;

  @ManyToOne(() => Customer, (customer) => customer.shipping)
  customer: Customer;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  address1: string;

  @Column({ nullable: true })
  address2: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  postcode: string;

  @Column()
  country: string;
}
