import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToMany,
  OneToMany,
  ManyToOne,
  Relation,
  OneToOne,
} from 'typeorm';
import { Customer, OrderLog } from './index.js';

@Entity({
  name: 'order',
})
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => OrderLog, (orderLog) => orderLog.id)
  orderLog: Relation<OrderLog>;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Relation<Customer>;

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

  @Column({ default: 0 })
  iceValue: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  iceValueTimestamp: Date;
}
