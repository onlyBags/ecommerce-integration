import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import {
  Dimensions,
  Category,
  Tag,
  Image,
  Attribute,
  MetaData,
  Links,
  Datasource,
} from './index.js';

@Entity({
  name: 'wc_product',
})
export class WoocommerceProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  productId: number;

  @ManyToOne(() => Datasource, (datasource) => datasource.woocommerceProduct)
  datasource: Datasource;

  @Index()
  @Column()
  syncedAt: Date;

  @Index()
  @Column({ type: 'int' })
  datasourceId: number;

  @Column({ type: 'varchar' })
  @Index()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  @Index()
  slug: string;

  @Column({ type: 'varchar', nullable: true })
  permalink: string;

  @Column({ type: 'varchar', nullable: true })
  dateCreated: string;

  @Column({ type: 'varchar', nullable: true })
  dateCreatedGmt: string;

  @Column({ type: 'varchar', nullable: true })
  dateModified: string;

  @Column({ type: 'varchar', nullable: true })
  dateModifiedGmt: string;

  @Column({ type: 'varchar', nullable: true })
  type: string;

  @Column({ type: 'varchar', nullable: true })
  status: string;

  @Column({ type: 'boolean', nullable: true })
  featured: boolean;

  @Column({ type: 'varchar', nullable: true })
  catalogVisibility: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  shortDescription: string;

  @Column({ type: 'varchar', nullable: true })
  sku: string;

  @Column({ type: 'varchar', nullable: true })
  price: string;

  @Column({ type: 'varchar', nullable: true })
  regularPrice: string;

  @Column({ type: 'varchar', nullable: true })
  salePrice: string;

  @Column({ type: 'varchar', nullable: true })
  dateOnSaleFrom: string;

  @Column({ type: 'varchar', nullable: true })
  dateOnSaleFromGmt: string;

  @Column({ type: 'varchar', nullable: true })
  dateOnSaleTo: string;

  @Column({ type: 'varchar', nullable: true })
  dateOnSaleToGmt: string;

  @Column({ type: 'varchar', nullable: true })
  priceHtml: string;

  @Column({ type: 'boolean', nullable: true })
  onSale: boolean;

  @Column({ type: 'boolean', nullable: true })
  purchasable: boolean;

  @Column({ type: 'int', nullable: true })
  totalSales: number;

  @Column({ type: 'boolean', nullable: true })
  virtual: boolean;

  @Column({ type: 'boolean', nullable: true })
  downloadable: boolean;

  @Column({ type: 'varchar', nullable: true })
  downloads: string;

  @Column({ type: 'int', nullable: true })
  downloadLimit: number;

  @Column({ type: 'int', nullable: true })
  downloadExpiry: number;

  @Column({ type: 'varchar', nullable: true })
  externalUrl: string;

  @Column({ type: 'varchar', nullable: true })
  buttonText: string;

  @Column({ type: 'varchar', nullable: true })
  taxStatus: string;

  @Column({ type: 'varchar', nullable: true })
  taxClass: string;

  @Column({ type: 'boolean', nullable: true })
  manageStock: boolean;

  @Column({ type: 'varchar', nullable: true })
  stockQuantity: string;

  @Column({ type: 'varchar', nullable: true })
  stockStatus: string;

  @Column({ type: 'varchar', nullable: true })
  backorders: string;

  @Column({ type: 'boolean', nullable: true })
  backordersAllowed: boolean;

  @Column({ type: 'boolean', nullable: true })
  backordered: boolean;

  @Column({ type: 'boolean', nullable: true })
  soldIndividually: boolean;

  @Column({ type: 'varchar', nullable: true })
  weight: string;

  @Column({ type: 'boolean', nullable: true })
  shippingRequired: boolean;

  @Column({ type: 'boolean', nullable: true })
  shippingTaxable: boolean;

  @Column({ type: 'varchar', nullable: true })
  shippingClass: string;

  @Column({ type: 'int', nullable: true })
  shippingClassId: number;

  @Column({ type: 'boolean', nullable: true })
  reviewsAllowed: boolean;

  @Column({ type: 'varchar', nullable: true })
  averageRating: string;

  @Column({ type: 'int', nullable: true })
  ratingCount: number;

  @Column({ type: 'varchar', nullable: true })
  relatedIds: string;

  @Column({ type: 'varchar', nullable: true })
  upsellIds: string;

  @Column({ type: 'varchar', nullable: true })
  crossSellIds: string;

  @Column({ type: 'int', nullable: true })
  parentId: number;

  @Column({ type: 'varchar', nullable: true })
  purchaseNote: string;

  @Column({ type: 'varchar', nullable: true })
  defaultAttributes: any[];

  @Column({ type: 'varchar', nullable: true })
  variations: string;

  @Column({ type: 'varchar', nullable: true })
  groupedProducts: string;

  @Column({ type: 'int', nullable: true })
  menuOrder: number;

  @Column({ type: 'varchar', nullable: true })
  jetpackPublicizeConnections: string;

  @OneToOne(() => Dimensions, (dimensions) => dimensions.woocommerceProduct)
  dimensions: Dimensions;

  @OneToMany(() => Image, (image) => image.woocommerceProduct)
  images: Image[];

  @OneToMany(() => Category, (category) => category.woocommerceProduct)
  // @JoinTable({ name: 'wc_product_x_category' })
  categories: Category[];

  @OneToMany(() => Tag, (tag) => tag.woocommerceProduct)
  // @JoinTable({
  //   name: 'wc_product_x_tag',
  // })
  tags: Tag[];

  @ManyToMany(() => Attribute, (attribute) => attribute.woocommerceProduct)
  @JoinTable({
    name: 'wc_product_x_attribute',
  })
  attributes: Attribute[];

  @OneToMany(() => MetaData, (metaData) => metaData.woocommerceProduct)
  // @JoinTable({
  //   name: 'wc_product_x_meta_data',
  // })
  metaData: MetaData[];
}
