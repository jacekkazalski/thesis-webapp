import { Paper, Stack, Typography } from "@mui/material";
import { IngredientMultiSelect } from "../components/IngredientMultiSelect";
import { Ingredient } from "../utils/types";
import { useEffect, useState } from "react";
import useAxiosCustom from "../hooks/useAxiosCustom";
import { all } from "axios";

export default function SettingsPage() {
    const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
    const [pantryIngredients, setPantryIngredients] = useState<Ingredient[]>([]);
    const [dietIngredients, setDietIngredients] = useState<Ingredient[]>([]);
    const axiosPrivate = useAxiosCustom();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ingredientsRes, userIngRes] = await Promise.all([
                    axiosPrivate.get("/ingredients"),
                    axiosPrivate.get("users/ingredients")
                ]);
                const allIngs = ingredientsRes.data.data;
                setAllIngredients(allIngs);
                const pantryIds = userIngRes.data.data.pantry_ingredients.map((i: { id_ingredient: any; }) => i.id_ingredient);
                const dietIds = userIngRes.data.data.diet_ingredients.map((i: { id_ingredient: any; }) => i.id_ingredient);
                const pantry = allIngs.filter((ing: { id_ingredient: number; }) => pantryIds.includes(ing.id_ingredient));
                const diet = allIngs.filter((ing: { id_ingredient: number; }) => dietIds.includes(ing.id_ingredient));
                setPantryIngredients(pantry);
                setDietIngredients(diet);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <Paper elevation={3}>
                <Typography variant="h3" p={2}> Ustawienia </Typography>
                <Stack direction="column" spacing={4} p={2}>
                    <Typography variant="h5"> Składniki w spiżarni </Typography>
                    <Typography variant="body1">Wybierz składniki, które zawsze masz w domu. Będą one automatycznie zawarte w każdym wyszukiwaniu.</Typography>
                    <IngredientMultiSelect
                        options={allIngredients}
                        value={pantryIngredients}
                        onChange={setPantryIngredients}
                    />
                    <Typography variant="h5">Wykluczone składniki </Typography>
                    <Typography variant="body1">Wybierz składniki, których nie możesz lub nie chcesz uwzględniać w swoich wyszukiwaniach.</Typography>
                    <IngredientMultiSelect
                        options={allIngredients}
                        value={dietIngredients}
                        onChange={setDietIngredients}
                    />
                </Stack>
            </Paper>
        </>
    );
}