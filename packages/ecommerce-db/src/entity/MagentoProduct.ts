import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Relation,
} from 'typeorm';

import {
  MagentoCategoryLink,
  MagentoMediaGalleryEntry,
  MagentoCustomAttribute,
  MagentoProductLink,
  MagentoExtensionAttributes,
} from './index.js';

@Entity()
export class MagentoProduct {
  @PrimaryGeneratedColumn()
  id: number;

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

  @OneToMany(() => MagentoCategoryLink, (categoryLink) => categoryLink.product)
  categoryLinks: Relation<MagentoCategoryLink[]>;

  @OneToMany(
    () => MagentoMediaGalleryEntry,
    (mediaGalleryEntry) => mediaGalleryEntry.product
  )
  mediaGalleryEntries: Relation<MagentoMediaGalleryEntry[]>;

  @OneToMany(
    () => MagentoCustomAttribute,
    (customAttribute) => customAttribute.product
  )
  customAttributes: Relation<MagentoCustomAttribute[]>;

  @OneToMany(() => MagentoProductLink, (productLink) => productLink.product)
  productLinks: Relation<MagentoProductLink[]>;

  @ManyToOne(
    () => MagentoExtensionAttributes,
    (extensionAttributes) => extensionAttributes.products
  )
  @JoinColumn({ name: 'extensionAttributesId' })
  extensionAttributes: Relation<MagentoExtensionAttributes>;
}
