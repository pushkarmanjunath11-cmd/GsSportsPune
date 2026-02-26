export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;

  // support both
  image?: string;
  images?: string[];

  sizes?: Record<string, number>;
  featured?: boolean;
};
