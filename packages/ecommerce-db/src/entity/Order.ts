import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { Customer, OrderLog } from './index.js';

@Entity({
  name: 'order',
})
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.id)
  customer: Relation<Customer>;

  @OneToOne(() => OrderLog, (orderLog) => orderLog.id)
  @JoinColumn()
  orderLog: Relation<OrderLog>;

  @Column()
  storeOrderId: number;

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
