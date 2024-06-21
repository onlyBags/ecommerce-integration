import { Article } from './article.js';

export interface SlotRes {
  id: number;
  name: string;
  enabled: boolean;
  article: Article;
  posX: number;
  posY: number;
  posZ: number;
  sizeX: number;
  sizeY: number;
  sizeZ: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  image: string;
}
