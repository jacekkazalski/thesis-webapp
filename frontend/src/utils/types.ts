export interface Recipe {
  id_recipe: number;
  name: string;
  instructions: string;
  image_url?: string;
  rating?: number;
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
}

export interface Ingredient {
  id_ingredient: number;
  name: string;
  quantity?: string;
}
export interface User {
  id_user: number;
  username: string;
}
