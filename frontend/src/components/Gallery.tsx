import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Ingredient, Recipe } from "../utils/types";
import {
  Box,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { FormatListBulleted, ViewModule } from "@mui/icons-material";
import { IngredientMultiSelect } from "./IngredientMultiSelect";
import RecipeGrid from "./RecipeGrid";
import { useSearchParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

export default function Gallery() {
  const [viewType, setViewType] = useState<"gallery" | "list">("gallery");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [chosenIngredients, setChosenIngredients] = useState<Ingredient[]>([]);
  const [sortBy, setSortBy] = useState("highest_rated");
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const handleViewTypeChange = (
    newViewType: ((prevState: "gallery" | "list") => "gallery" | "list") | null,
  ) => {
    if (newViewType != null) {
      setViewType(newViewType);
    }
  };
  useEffect(() => {
    const fetchRecipes = async () => {
      const ingredientIds = chosenIngredients.map( (i) => i.id_ingredient)
      const response = await axios.get("/recipes", {
        params: { sortBy, search: searchQuery, ingredient: ingredientIds },
      });
      console.log(response.data.data);
      setRecipes(response.data.data);
    };
    const fetchIngredients = async () => {
      const response = await axios.get("/ingredients");
      setAllIngredients(response.data.data);
    };
    fetchRecipes();
    fetchIngredients();
  }, [sortBy, chosenIngredients, searchQuery]);
  return (
    <Box>
      <Stack direction="column" p={2} spacing={2}>
        <Stack direction="row" spacing={2}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              defaultValue="ingredients"
            >
              <MenuItem value="ingredients">Pasujące składniki</MenuItem>
              <MenuItem value="highest_rated">Najwyżej oceniane</MenuItem>  
              <MenuItem value="newest">Najnowsze</MenuItem>
            </Select>
            <FormHelperText>Sortuj przepisy</FormHelperText>
          </FormControl>
          <Stack direction="column">
            <ToggleButtonGroup
              value={viewType}
              exclusive
              size="small"
              onChange={(_, value) => handleViewTypeChange(value)}
            >
              <Tooltip title="Galeria">
                <ToggleButton value="gallery">
                  <ViewModule />
                </ToggleButton>
              </Tooltip>
              <Tooltip title="Lista">
                <ToggleButton value={"list"}>
                  <FormatListBulleted />
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>
            <FormHelperText>Sposób wyświetlania</FormHelperText>
          </Stack>
        </Stack>
        <Stack spacing={2} direction="row">
          <IngredientMultiSelect
            options={allIngredients}
            value={chosenIngredients}
            onChange={setChosenIngredients}
          />
        </Stack>
      </Stack>
      <RecipeGrid recipes={recipes} />
    </Box>
  );
}
