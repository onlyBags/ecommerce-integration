import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
export class Attribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  @Unique(['name'])
  name: string;

  @Column({ type: 'int' })
  position: number;

  @Column({ type: 'boolean' })
  visible: boolean;

  @Column({ type: 'boolean' })
  variation: boolean;

  @Column({ type: 'varchar', nullable: true })
  options: string;
}
