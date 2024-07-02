import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  Relation,
  JoinColumn,
} from 'typeorm';
import { Customer, Datasource, Order } from './index.js';

@Entity({
  name: 'coinbase_order',
})
export class CoinbaseOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  coinbaseId: string;

  @Column()
  code: string;

  @Column()
  checkoutUrl: string;

  @Column()
  currency: string;

  @Column()
  status: string;

  @Column()
  expireTime: string;

  @ManyToOne(() => Datasource, (datasource) => datasource.id)
  datasource: Relation<Datasource>;

  @ManyToOne(() => Customer, (customer) => customer.id)
  customer: Relation<Customer>;

  @OneToOne(() => Order)
  @JoinColumn()
  order: Relation<Order>;
}
