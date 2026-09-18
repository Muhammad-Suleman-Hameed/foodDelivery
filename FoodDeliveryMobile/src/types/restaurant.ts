export interface Restaurant {
  id: number;
  name: string;
  description?: string | null;
  cuisine: string;
  imageUrl?: string | null;
  address: string;
  rating: number;
  ratingCount: number;
  deliveryTime: string;
  deliveryFee: number;
  dealBadge?: string | null;
  ownerId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRestaurantInput {
  name: string;
  description?: string;
  cuisine?: string;
  imageUrl?: string;
  address: string;
  deliveryTime?: string;
  deliveryFee?: number;
  dealBadge?: string;
}
