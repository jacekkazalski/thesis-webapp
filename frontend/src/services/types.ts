
export interface Recipe {
    id_recipe: number,
    name: string,
    instructions: string;
    image_url?: string;
    author: {
        username: string,
        id_user: number
    }
}
export interface AuthState {
    email?: string;
    username?: string;
    accessToken?: string;
}