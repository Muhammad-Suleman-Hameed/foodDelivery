export enum MealCategory {
  FAST_FOOD = 'Fast Food',
  DRINKS = 'Drinks',
  DEALS = 'Deals',
  DESSERT = 'Dessert',
}

export interface Meal {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  category: MealCategory;
  isAvailable: boolean;
  restaurantId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMealInput {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category: MealCategory;
  isAvailable?: boolean;
}
