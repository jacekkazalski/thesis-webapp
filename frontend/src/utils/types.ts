export interface Recipe {
  id_recipe: number;
  name: string;
  instructions: string;
  image_url?: string;
  rating?: number;
  matched_ingredients?: number;
  total_ingredients?: number;
  created_at?: string;
  author: {
    username: string;
    id_user: number;
  };
  ingredients: Ingredient[];
}
export interface AuthState {
  id_user: number;
  email?: string;
  username?: string;
  accessToken?: string;
  role?: string;
}

export interface UncheckedRecipe {
  id_recipe: number;
  name: string;
  image_url?: string | null;
  created_at?: string;
  author: {
    id_user: number;
    username: string;
  };
}

export interface Ingredient {
  id_ingredient: number;
  name: string;
  quantity?: string;
  category_name?: string;
  category_id?: number;
}
export interface User {
  id_user: number;
  username: string;
}
