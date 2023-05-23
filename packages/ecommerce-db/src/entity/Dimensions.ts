import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Dimensions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  length: string;

  @Column({ type: 'varchar' })
  width: string;

  @Column({ type: 'varchar' })
  height: string;
}
