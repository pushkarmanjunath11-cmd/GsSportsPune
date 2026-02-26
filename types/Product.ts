export type Product = {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  featured?: boolean;
  sizes?: Record<string, number>;
};``