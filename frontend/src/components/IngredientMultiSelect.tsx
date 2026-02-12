import { Ingredient } from "../utils/types";
import { Autocomplete, TextField, createFilterOptions } from "@mui/material";

interface IngredientMultiSelectProps {
  options: Ingredient[];
  value: Ingredient[];
  onChange: (value: Ingredient[]) => void;
  label?: string;
  placeholder?: string;
}
const filterOption = createFilterOptions({
  stringify: (option: Ingredient) => `${option.name} ${option.category_name || ""}`,
  
});
export function IngredientMultiSelect({
  options,
  value,
  onChange,
  label = "Wybierz składniki",
  placeholder = "Wyszukaj składnik",
}: IngredientMultiSelectProps) {
  return (
    <Autocomplete
      multiple
      limitTags={4}
      filterSelectedOptions
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} />
      )}
      options={options}
      filterOptions={filterOption}
      groupBy={(option) => option.category_name || "Brak kategorii"}
      getOptionLabel={(option) => option.name}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      sx={{ width: "80%" }}
    />
  );
}
