export interface Recipe {
    id_recipe: number;
    name: string;
    instructions: string;
    image_path?: string;
    added_by: number;
}

export interface Ingredient {
    id_ingredient: number;
    name: string;
    quantity?: string;
}

export interface Rating {
    id_user: number;
    id_recipe: number;
    value: number;
}

export interface Category {
    id_category: number;
    name: string;
}
export interface User {
    id_user: number;
    username: string,
    password: string,
    email: string,
    id_diet: 3,
}
export interface AuthState {
    email?: string;
    username?: string;
    accessToken?: string;
}