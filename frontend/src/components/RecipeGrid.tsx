import { Recipe } from "../utils/types";
import { Grid } from "@mui/material";
import RecipeCard from "./common/RecipeCard";

interface RecipeGridProps {
  recipes: Recipe[];
}

export default function RecipeGrid({ recipes }: RecipeGridProps) {
  return (
    <Grid container spacing={2} p={2}>
      {recipes.map((recipe) => (
        <Grid
          size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
          key={recipe.id_recipe}
        >
          <RecipeCard recipe={recipe} />
        </Grid>
      ))}
    </Grid>
  );
}
