import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
export class Self {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  @Unique(['href'])
  href: string;
}
