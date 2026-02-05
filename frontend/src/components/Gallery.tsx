import { useEffect, useState } from "react";
import useAxiosCustom from "../hooks/useAxiosCustom";
import { Ingredient, Recipe } from "../utils/types";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  useMediaQuery,
  Pagination,
} from "@mui/material";
import { FormatListBulleted, ViewModule } from "@mui/icons-material";
import { IngredientMultiSelect } from "./IngredientMultiSelect";
import RecipeGrid from "./RecipeGrid";
import { useSearchParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useAuth from "../hooks/useAuth";
import { useLocation } from "react-router-dom";


export default function Gallery() {
  const { auth } = useAuth();
  const axiosInstance = useAxiosCustom();
  const [viewType, setViewType] = useState<"gallery" | "list">("gallery");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [chosenIngredients, setChosenIngredients] = useState<Ingredient[]>([]);
  const [sortBy, setSortBy] = useState("ingredients");
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 24;
  const searchQuery = searchParams.get("search") || "";
  const location = useLocation();

  const [pantryChecked, setPantryChecked] = useState<boolean>(false);
  const [dietChecked, setDietChecked] = useState<boolean>(false);
  const [matchChecked, setMatchChecked] = useState<boolean>(false);

  useEffect(() => {
    const logged = !!auth?.accessToken;
    setPantryChecked(logged);
    setDietChecked(logged);
  }, [auth]);
  useEffect(() => {
  if (!(location.state as any)?.reset) return;

  const logged = !!auth?.accessToken;

  setChosenIngredients([]);
  setSortBy("ingredients");
  setMatchChecked(false);
  setPantryChecked(logged);
  setDietChecked(logged);
  setPage(1);
  
}, [(location.state as any)?.reset, auth]);


  const handleViewTypeChange = (
    newViewType: ((prevState: "gallery" | "list") => "gallery" | "list") | null,
  ) => {
    if (newViewType != null) {
      setViewType(newViewType);
    }
  };
  useEffect(() => {
    const fetchRecipes = async () => {
      const ingredientIds = chosenIngredients.map((i) => i.id_ingredient)
      const response = await axiosInstance.get("/recipes", {
        params: {
          sortBy,
          search: searchQuery,
          ingredient: ingredientIds,
          useSaved: pantryChecked ? 1 : 0,
          useDiet: dietChecked ? 1 : 0,
          matchOnly: matchChecked ? 1 : 0,
          page,
          limit: PAGE_SIZE
        },
      });
      console.log(response.data.data);
      setRecipes(response.data.data);
    };
    const fetchIngredients = async () => {
      const response = await axiosInstance.get("/ingredients");
      setAllIngredients(response.data.data);
    };
    fetchRecipes();
    fetchIngredients();
  }, [sortBy, chosenIngredients, searchQuery, pantryChecked, dietChecked, matchChecked, page]);
  useEffect(() => {
    setPage(1);
  }, [sortBy, chosenIngredients, searchQuery, pantryChecked, dietChecked, matchChecked]);
  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, [page]);


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
          <Stack direction="row" alignItems="start">
            <FormControlLabel
              control={
                <Checkbox
                  checked={matchChecked}
                  onChange={(e) => setMatchChecked(e.target.checked)}
                />
              }
              label="Tylko wybrane składniki"
            />
            {auth?.accessToken ? (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={pantryChecked}
                      onChange={(e) => setPantryChecked(e.target.checked)}
                    />
                  }
                  label="Spiżarnia"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={dietChecked}
                      onChange={(e) => setDietChecked(e.target.checked)}
                    />
                  }
                  label="Dieta"
                />
              </>
            ) : (
              <>
                <Tooltip title="Musisz być zalogowany, aby użyć tej opcji">
                  <span>
                    <FormControlLabel
                      control={<Checkbox checked={false} disabled />}
                      label="Spiżarnia"
                    />
                  </span>
                </Tooltip>
                <Tooltip title="Musisz być zalogowany, aby użyć tej opcji">
                  <span>
                    <FormControlLabel
                      control={<Checkbox checked={false} disabled />}
                      label="Dieta"
                    />
                  </span>
                </Tooltip>
              </>
            )}
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
      <Stack alignItems="center" my={2}>
        <Pagination
          page={page}
          onChange={(_event, value) => setPage(value)}
          count={recipes.length < PAGE_SIZE ? page : page + 1}
          color="primary"
        />
      </Stack>
    </Box>
  );
}
