export * from './dashboard.js';

export interface DGLResponse<T> {
  data: T;
  status: number;
  message: string;
}
