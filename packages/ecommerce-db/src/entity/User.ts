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

  @Column({
    transformer: encrypt,
  })
  clientKey: string;

  @Column({
    transformer: encrypt,
  })
  clientSecret: string;

  @Column()
  isActive: boolean;
}
