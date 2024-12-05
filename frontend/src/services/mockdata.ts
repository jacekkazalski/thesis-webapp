import { Recipe, Ingredient, Rating, User } from './types';

export const mockRecipes: Recipe[] = [
    {
        id_recipe: 1,
        name: "Spaghetti Carbonara",
        instructions: "Cook pasta. Mix eggs and cheese. Combine with bacon.",
        image_path: "/../assets/spaghetti.jpg",
        added_by: 1,
    },
    {
        id_recipe: 2,
        name: "Chicken Curry",
        instructions: "Cook chicken. Add curry spices. Simmer with coconut milk.",
        added_by: 2,
    },
];

export const mockIngredients: Ingredient[] = [
    { id_ingredient: 1, name: "Spaghetti", quantity: "200g" },
    { id_ingredient: 2, name: "Bacon", quantity: "100g" },
    { id_ingredient: 3, name: "Eggs", quantity: "2" },
];

export const mockRatings: Rating[] = [
    { id_user: 1, id_recipe: 1, value: 5 },
    { id_user: 2, id_recipe: 1, value: 4 },
    { id_user: 1, id_recipe: 2, value: 3 },
    { id_user: 2, id_recipe: 2, value: 2 },
];
export const mockUsers: User[] = [
    {id_user: 1, username:'jankowal', email:'aa', password:'ab', id_diet:3},
    {id_user: 2, username:'bubidfod', email:'aa', password:'ab', id_diet:3}
]