export interface IProductItem {
  id: string;
  name: string;
  description: string;
  image: string;
}
export interface IProduct {
  data: IProductItem[];
  items: number;
  pages: number;
}
