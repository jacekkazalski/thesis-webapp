import {useEffect, useState} from "react";
import RecipeCard from "./common/RecipeCard.tsx";
import axios from "../api/axios.ts";
import {Recipe} from "../utils/types.ts";
import {Box, Grid, Stack, Button, MenuItem, Select, FormControl, FormHelperText} from "@mui/material";

export default function Gallery(){
    const [viewType, setViewType] = useState<"gallery" | "list">("gallery")
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [sortBy, setSortBy] = useState("rating")
    //TODO: Pagination

    useEffect(() => {
        const fetchRecipes = async () => {
            const response = await axios.get("/recipes", { params: { sortBy } });
            console.log(response.data.data)
            setRecipes(response.data.data)
        }
        fetchRecipes();
    }, [sortBy]);
    return(
        <Box>
            <Box>
                <Stack direction="row" spacing={1}>
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <Select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            defaultValue="rating"
                        >
                            <MenuItem value="rating">Najwyżej oceniane</MenuItem>
                            <MenuItem value="ingredients">Pasujące składniki</MenuItem>
                            <MenuItem value="id_recipe">Najnowsze</MenuItem>
                        </Select>
                        <FormHelperText>Sortuj przepisy</FormHelperText>
                    </FormControl>
                </Stack>
            </Box>
            <Grid container spacing={2}>
                {recipes.map((recipe) => (
                    <Grid size={{xs: 12, sm:6, md: 4, lg: 3, xl: 2}} key={recipe.id_recipe}>
                        <RecipeCard recipe={recipe}/>
                    </Grid>
                ))}
            </Grid>

        </Box>
    )
}