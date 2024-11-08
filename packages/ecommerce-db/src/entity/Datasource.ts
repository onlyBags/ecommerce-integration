import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import { encrypt } from '../utils/index.js';
import { User } from './User.js';
import { WoocommerceProduct } from './WoocommerceProduct.js';
import { Slot } from './Slot.js';
import { Order } from './Order.js';
import { MagentoProduct } from './MagentoProduct.js';
import { BinanceOrder } from './BinanceOrder.js';

@Entity()
export class Datasource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column({ length: 100 })
  wallet: string;

  @ManyToOne(() => User, (user) => user.datasource)
  user: User;

  @OneToMany(
    () => WoocommerceProduct,
    (woocommerceProduct) => woocommerceProduct.datasource
  )
  woocommerceProduct: Relation<WoocommerceProduct[]>;

  @OneToMany(
    () => MagentoProduct,
    (magentoProduct) => magentoProduct.datasource
  )
  magentoProduct: Relation<MagentoProduct[]>;

  @OneToMany(() => Order, (order) => order.id)
  orders: Relation<Order[]>;

  @OneToMany(() => Order, (order) => order.id)
  binanceOrder: Relation<BinanceOrder[]>;

  @OneToMany(() => Slot, (slot) => slot.datasource)
  slot: Relation<Slot[]>;

  @Column()
  platform: 'woocommerce' | 'magento';

  @Column({ length: 1000 })
  baseUrl: string;

  @Column({
    transformer: encrypt,
  })
  consumerKey: string;

  @Column({
    transformer: encrypt,
  })
  consumerSecret: string;

  @Column({
    nullable: true,
    transformer: encrypt,
  })
  accessToken: string;

  @Column({
    nullable: true,
    transformer: encrypt,
  })
  accessTokenSecret: string;

  @Column({
    transformer: encrypt,
  })
  webhookSecret: string;

  @Column()
  isActive: boolean;

  @Column({ length: 3, default: 'USD' })
  currencyCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 1.0 })
  dollarRatio: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
