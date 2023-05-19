import { encrypt } from '../utils/index.js';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  platform: 'Woocommerce' | 'Magento';

  @Column({ length: 1000 })
  baseUrl: string;

  @Column({ length: 1000 })
  apiKey: string;

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
}
