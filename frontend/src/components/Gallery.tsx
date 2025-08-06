import {useEffect, useState} from "react";
import RecipeCard from "./common/RecipeCard.tsx";
import axios from "../api/axios.ts";
import {Recipe} from "../utils/types.ts";
import {
    Box, Grid, Stack, MenuItem, Select, FormControl, FormHelperText, ButtonGroup, Button, ToggleButtonGroup,
    ToggleButton, Tooltip
} from "@mui/material";
import {FormatListBulleted, ViewListOutlined, ViewModule, ViewModuleOutlined} from "@mui/icons-material";

export default function Gallery(){
    const [viewType, setViewType] = useState<"gallery" | "list">("gallery")
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [sortBy, setSortBy] = useState("rating")
    //TODO: Pagination
    const handleViewTypeChange = (_event: any, newViewType: string | ((prevState: "gallery" | "list") => "gallery" | "list") | null) => {
        if (newViewType!=null) {
            setViewType(newViewType)
        }
    }
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
            <Box p={2}>
                <Stack direction="row" spacing={2}>

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
                    <Stack direction="column"><ToggleButtonGroup value={viewType} exclusive size="small" onChange={handleViewTypeChange}>
                        <Tooltip title="Galeria"><ToggleButton value="gallery">
                            <ViewModule/>
                        </ToggleButton></Tooltip>
                        <Tooltip title="Lista"><ToggleButton value={"list"}>
                            <FormatListBulleted/>
                        </ToggleButton></Tooltip>
                    </ToggleButtonGroup>
                        <FormHelperText>Sposób wyświetlania</FormHelperText></Stack>

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