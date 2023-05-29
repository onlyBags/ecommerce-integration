import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { encrypt } from '../utils/index.js';
import { User } from './User.js';
import { WoocommerceProduct } from './WoocommerceProduct.js';

@Entity()
export class Datasource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @ManyToOne(() => User, (user) => user.datasource)
  user: User;

  @OneToMany(
    () => WoocommerceProduct,
    (woocommerceProduct) => woocommerceProduct.datasource
  )
  woocommerceProduct: WoocommerceProduct[];

  @Column()
  platform: 'Woocommerce' | 'Magento';

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

  @Column()
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
