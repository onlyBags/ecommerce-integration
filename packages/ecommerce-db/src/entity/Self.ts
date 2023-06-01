import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity({
  name: 'wc_self',
})
export class Self {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  href: string;
}
