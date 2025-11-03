import axios from "axios";
import { Recipe } from "../utils/types";

export const recipeService = {
  getRecipe: (recipeId: string) =>
    axios.get("/recipes/recipe", { params: { id_recipe: recipeId } }),
};
