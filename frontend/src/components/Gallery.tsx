import {useEffect, useState} from "react";
import RecipeCard from "./common/RecipeCard.tsx";
import axios from "../api/axios.ts";
import {Ingredient, Recipe} from "../utils/types.ts";
import {
    Box, Grid, Stack, MenuItem, Select, FormControl, FormHelperText, ToggleButtonGroup,
    ToggleButton, Tooltip, Autocomplete, TextField
} from "@mui/material";
import {FormatListBulleted, ViewModule} from "@mui/icons-material";

export default function Gallery() {
    const [viewType, setViewType] = useState<"gallery" | "list">("gallery")
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
    const [chosenIngredients, setChosenIngredients] = useState<Ingredient[]>([]);
    const [sortBy, setSortBy] = useState("rating")
    //TODO: Pagination
    const handleViewTypeChange = (_: any, newViewType:((prevState: "gallery" | "list") => "gallery" | "list") | null) => {
        if (newViewType != null) {
            setViewType(newViewType)
        }
    }
    useEffect(() => {
        const fetchRecipes = async () => {
            const response = await axios.get("/recipes", {params: {sortBy}});
            console.log(response.data.data)
            setRecipes(response.data.data)
        }
        const fetchIngredients = async () => {
            const response = await axios.get("/ingredients")
            setAllIngredients(response.data.data)
        }
        fetchRecipes();
        fetchIngredients();
    }, [sortBy, chosenIngredients]);
    return (
        <Box>
            <Stack direction="column" p={2} spacing={2}>
                <Stack direction="row" spacing={2}>

                    <FormControl size="small" sx={{minWidth: 160}}>
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
                    <Stack direction="column"><ToggleButtonGroup value={viewType} exclusive size="small"
                                                                 onChange={handleViewTypeChange}>
                        <Tooltip title="Galeria"><ToggleButton value="gallery">
                            <ViewModule/>
                        </ToggleButton></Tooltip>
                        <Tooltip title="Lista"><ToggleButton value={"list"}>
                            <FormatListBulleted/>
                        </ToggleButton></Tooltip>
                    </ToggleButtonGroup>
                        <FormHelperText>Sposób wyświetlania</FormHelperText></Stack>

                </Stack>
                <Stack spacing={2} direction="row">
                    <IngredientMultiSelect options={allIngredients} value={chosenIngredients}
                                           onChange={setChosenIngredients}/>
                    {/*<Button variant="contained" color="secondary">Szukaj</Button>*/}
                </Stack>
            </Stack>
            <Grid container spacing={2}>
                {recipes.map((recipe) => (
                    <Grid size={{xs: 12, sm: 6, md: 4, lg: 3, xl: 2}} key={recipe.id_recipe}>
                        <RecipeCard recipe={recipe}/>
                    </Grid>
                ))}
            </Grid>

        </Box>
    )
}


interface IngredientMultiSelectProps {
    options: Ingredient[];
    value: Ingredient[];
    onChange: (value: Ingredient[]) => void;
    label?: string;
    placeholder?: string;
}

//TODO: add ingredient categories to autocomplete, once added to the data base
function IngredientMultiSelect({
                                   options,
                                   value,
                                   onChange,
                                   label = "Wybierz składniki",
                                   placeholder = "Wyszukaj składnik"
                               }: IngredientMultiSelectProps) {
    return (
        <Autocomplete
            multiple
            filterSelectedOptions
            renderInput={(params) =>
                (<TextField {...params} label={label} placeholder={placeholder}/>)}
            options={options}
            getOptionLabel={(option) => option.name}
            value={value}
            onChange={(_, newValue) => onChange(newValue)}
            sx={{width: "80%"}}
            // renderValue={(selected, getItemProps) =>
            //     selected.map((option, index) => (
            //         <Chip
            //             label={option.name}
            //             {...getItemProps({index})}
            //             key={option.id_ingredient}
            //         />
            //     ))
            //}
        />
    )

}