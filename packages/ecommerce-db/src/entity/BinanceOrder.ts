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
  name: 'BinanceOrder',
})
export class BinanceOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  prepayId: string;

  @Column()
  qrcodeLink: string;

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
