
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string; // This will now store the category ID or name string
  description: string;
  image: string;
  stock: number;
  createdAt: any;
}

export interface CategoryItem {
  id: string;
  name: string;
}

export interface CartItem extends Product {
  quantity: number;
}
