import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
export class Collection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  @Unique(['href'])
  href: string;
}
