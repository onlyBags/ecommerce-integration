import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Datasource } from './Datasource.js';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  username: string;

  @Column({ length: 1000 })
  apiKey: string;

  @OneToMany(() => Datasource, (datasource) => datasource.user)
  datasource: Datasource[];

  @Column()
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
