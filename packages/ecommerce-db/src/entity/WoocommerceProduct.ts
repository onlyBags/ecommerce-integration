import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Dimensions } from './Dimensions.js';
import { Category } from './Category.js';
import { Tag } from './Tag.js';
import { Image } from './Image.js';
import { Attribute } from './Attribute.js';
import { MetaDaum } from './MetaDaum.js';
import { Links } from './Links.js';

@Entity()
export class WoocommerceProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'int' })
  datasourceId: number;

  @Column({ type: 'varchar' })
  @Index()
  name: string;

  @Column({ type: 'varchar' })
  @Index()
  slug: string;

  @Column({ type: 'varchar' })
  permalink: string;

  @Column({ type: 'varchar' })
  dateCreated: string;

  @Column({ type: 'varchar' })
  dateCreatedGmt: string;

  @Column({ type: 'varchar' })
  dateModified: string;

  @Column({ type: 'varchar' })
  dateModifiedGmt: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'boolean' })
  featured: boolean;

  @Column({ type: 'varchar' })
  catalogVisibility: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  shortDescription: string;

  @Column({ type: 'varchar' })
  sku: string;

  @Column({ type: 'varchar' })
  price: string;

  @Column({ type: 'varchar' })
  regularPrice: string;

  @Column({ type: 'varchar' })
  salePrice: string;

  @Column({ type: 'varchar', nullable: true })
  dateOnSaleFrom: string;

  @Column({ type: 'varchar', nullable: true })
  dateOnSaleFromGmt: string;

  @Column({ type: 'varchar', nullable: true })
  dateOnSaleTo: string;

  @Column({ type: 'varchar', nullable: true })
  dateOnSaleToGmt: string;

  @Column({ type: 'varchar' })
  priceHtml: string;

  @Column({ type: 'boolean' })
  onSale: boolean;

  @Column({ type: 'boolean' })
  purchasable: boolean;

  @Column({ type: 'int' })
  totalSales: number;

  @Column({ type: 'boolean' })
  virtual: boolean;

  @Column({ type: 'boolean' })
  downloadable: boolean;

  @Column({ type: 'varchar', nullable: true })
  downloads: string;

  @Column({ type: 'int' })
  downloadLimit: number;

  @Column({ type: 'int' })
  downloadExpiry: number;

  @Column({ type: 'varchar' })
  externalUrl: string;

  @Column({ type: 'varchar' })
  buttonText: string;

  @Column({ type: 'varchar' })
  taxStatus: string;

  @Column({ type: 'varchar' })
  taxClass: string;

  @Column({ type: 'boolean' })
  manageStock: boolean;

  @Column({ type: 'varchar', nullable: true })
  stockQuantity: string;

  @Column({ type: 'varchar' })
  stockStatus: string;

  @Column({ type: 'varchar' })
  backorders: string;

  @Column({ type: 'boolean' })
  backordersAllowed: boolean;

  @Column({ type: 'boolean' })
  backordered: boolean;

  @Column({ type: 'boolean' })
  soldIndividually: boolean;

  @Column({ type: 'varchar' })
  weight: string;

  @ManyToOne((type) => Dimensions, (dimensions) => dimensions.id)
  dimensions: Dimensions;

  @Column({ type: 'boolean' })
  shippingRequired: boolean;

  @Column({ type: 'boolean' })
  shippingTaxable: boolean;

  @Column({ type: 'varchar' })
  shippingClass: string;

  @Column({ type: 'int' })
  shippingClassId: number;

  @Column({ type: 'boolean' })
  reviewsAllowed: boolean;

  @Column({ type: 'varchar' })
  averageRating: string;

  @Column({ type: 'int' })
  ratingCount: number;

  @Column({ type: 'varchar', nullable: true })
  relatedIds: string;

  @Column({ type: 'varchar', nullable: true })
  upsellIds: string;

  @Column({ type: 'varchar', nullable: true })
  crossSellIds: string;

  @Column({ type: 'int' })
  parentId: number;

  @Column({ type: 'varchar' })
  purchaseNote: string;

  @OneToMany((type) => Category, (category) => category.id)
  categories: Category[];

  @OneToMany((type) => Tag, (tag) => tag.id)
  tags: Tag[];

  @OneToMany((type) => Image, (image) => image.id)
  images: Image[];

  @OneToMany((type) => Attribute, (attribute) => attribute.id)
  attributes: Attribute[];

  @Column({ type: 'varchar', nullable: true })
  defaultAttributes: any[];

  @Column({ type: 'varchar', nullable: true })
  variations: string;

  @Column({ type: 'varchar', nullable: true })
  groupedProducts: string;

  @Column({ type: 'int' })
  menuOrder: number;

  @OneToMany((type) => MetaDaum, (metaDaum) => metaDaum.id)
  metaData: MetaDaum[];

  @Column({ type: 'varchar', nullable: true })
  jetpackPublicizeConnections: string;

  @ManyToOne((type) => Links, (links) => links.id)
  _links: Links;
}
