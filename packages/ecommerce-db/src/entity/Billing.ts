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
  name: 'user_billing',
})
export class Billing {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.billing)
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

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;
}
