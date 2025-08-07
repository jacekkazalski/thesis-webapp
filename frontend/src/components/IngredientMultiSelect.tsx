import { Ingredient } from "../utils/types";
import { Autocomplete, TextField } from "@mui/material";

interface IngredientMultiSelectProps {
  options: Ingredient[];
  value: Ingredient[];
  onChange: (value: Ingredient[]) => void;
  label?: string;
  placeholder?: string;
  hideSelectedItems?: boolean;
}

//TODO: add ingredient categories to autocomplete, once added to the data base
export function IngredientMultiSelect({
  options,
  value,
  onChange,
  label = "Wybierz składniki",
  placeholder = "Wyszukaj składnik",
  hideSelectedItems = false,
}: IngredientMultiSelectProps) {
  return (
    <Autocomplete
      multiple
      filterSelectedOptions
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} />
      )}
      options={options}
      getOptionLabel={(option) => option.name}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      sx={{ width: "80%" }}
      renderValue={hideSelectedItems ? () => null : undefined}
    />
  );
}
