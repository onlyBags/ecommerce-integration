import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Relation,
} from 'typeorm';
import { Customer } from './Customer.js';

@Entity({
  name: 'customer_billing',
})
export class Billing {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer)
  customer: Relation<Customer>;

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

  @Column({ nullable: false, default: 'no@email.com' })
  email: string;

  @Column({ nullable: true })
  phone: string;
}
