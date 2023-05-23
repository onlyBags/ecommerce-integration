import { Entity, Column, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Dimensions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  @Index()
  length: string;

  @Column({ type: 'varchar' })
  @Index()
  width: string;

  @Column({ type: 'varchar' })
  @Index()
  height: string;
}
