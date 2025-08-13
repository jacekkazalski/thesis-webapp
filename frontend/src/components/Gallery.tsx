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
} from "@mui/material";
import { FormatListBulleted, ViewModule } from "@mui/icons-material";
import { IngredientMultiSelect } from "./IngredientMultiSelect";
import RecipeGrid from "./RecipeGrid";

export default function Gallery() {
  const [viewType, setViewType] = useState<"gallery" | "list">("gallery");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [chosenIngredients, setChosenIngredients] = useState<Ingredient[]>([]);
  const [sortBy, setSortBy] = useState("rating");
  //TODO: Pagination
  const handleViewTypeChange = (
    newViewType: ((prevState: "gallery" | "list") => "gallery" | "list") | null,
  ) => {
    if (newViewType != null) {
      setViewType(newViewType);
    }
  };
  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await axios.get("/recipes", { params: { sortBy } });
      console.log(response.data.data);
      setRecipes(response.data.data);
    };
    const fetchIngredients = async () => {
      const response = await axios.get("/ingredients");
      setAllIngredients(response.data.data);
    };
    fetchRecipes();
    fetchIngredients();
  }, [sortBy, chosenIngredients]);
  return (
    <Box>
      <Stack direction="column" p={2} spacing={2}>
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
          {/*<Button variant="contained" color="secondary">Szukaj</Button>*/}
        </Stack>
      </Stack>
      <RecipeGrid recipes={recipes} />
    </Box>
  );
}
