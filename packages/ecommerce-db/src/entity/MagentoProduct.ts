import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Relation,
  Index,
} from 'typeorm';

import {
  MagentoCategoryLink,
  MagentoMediaGalleryEntry,
  MagentoCustomAttribute,
  MagentoProductLink,
  MagentoExtensionAttributes,
  Datasource,
  Slot,
} from './index.js';

@Entity()
export class MagentoProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @ManyToOne(() => Datasource, (datasource) => datasource.magentoProduct)
  datasource: Relation<Datasource>;

  @Index()
  @Column({ type: 'int' })
  datasourceId: number;

  @Column()
  sku: string;

  @Column()
  name: string;

  @Column()
  attributeSetId: number;

  @Column('float')
  price: number;

  @Column()
  status: number;

  @Column()
  visibility: number;

  @Column()
  typeId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('float')
  weight: number;

  @OneToMany(
    () => MagentoMediaGalleryEntry,
    (mediaGalleryEntry) => mediaGalleryEntry.magentoProduct
  )
  mediaGalleryEntries: Relation<MagentoMediaGalleryEntry[]>;

  @OneToMany(
    () => MagentoCustomAttribute,
    (customAttribute) => customAttribute.product
  )
  customAttributes: Relation<MagentoCustomAttribute[]>;

  @OneToMany(() => MagentoProductLink, (productLink) => productLink.product)
  productLinks: Relation<MagentoProductLink[]>;

  @OneToOne(() => MagentoExtensionAttributes)
  @JoinColumn()
  extensionAttributes: Relation<MagentoExtensionAttributes>;

  // @OneToMany(() => Slot, (slot) => slot.magentoProduct)
  // slot: Relation<Slot[]>;
}
