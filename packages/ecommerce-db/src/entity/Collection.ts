import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity({
  name: 'wc_collection',
})
export class Collection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  href: string;
}
