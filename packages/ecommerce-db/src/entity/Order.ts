import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Relation,
  OneToMany,
} from 'typeorm';
import { Customer, OrderLog, Datasource, BinanceOrder } from './index.js';

@Entity({
  name: 'order',
})
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Datasource, (datasource) => datasource.slot)
  datasource: Relation<Datasource>;

  @Column({ default: 'BAG' })
  paymentMethod: string;

  @ManyToOne(() => Customer, (customer) => customer.id)
  customer: Relation<Customer>;

  @OneToOne(() => OrderLog, (orderLog) => orderLog.id)
  @JoinColumn()
  orderLog: Relation<OrderLog>;

  @Column()
  storeOrderId: string;

  @Column()
  status: string;

  @Column({ default: 'USD' })
  currency: string;

  @Column()
  total: number;

  @Column()
  orderKey: string;

  @Column({ type: 'decimal', default: 0, precision: 10, scale: 8 })
  totalIce: number;

  @Column({ type: 'decimal', default: 0, precision: 10, scale: 8 })
  iceValue: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  iceValueTimestamp: Date;
}
