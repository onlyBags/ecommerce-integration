import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
export class MetaDaum {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  @Unique(['key'])
  key: string;

  @Column({ type: 'text' })
  value: string;
}
