import TextInput from "./TextInput.tsx";
import styles from "./IngredientSearchBox.module.css"
import Button from "./Button.tsx";
import React, {useEffect, useState} from "react";
import axios from "../../api/axios.ts";

export default function IngredientSearchBox({chosenIngredients, setChosenIngredients} : {
    chosenIngredients: {id_ingredient: number, name: string}[],
    setChosenIngredients: React.Dispatch<React.SetStateAction<{id_ingredient: number, name: string}[]>>
}) {
    const [allIngredients, setAllIngredients] = useState([]);
    const [search, setSearch] = useState("");
    useEffect(() => {
        const fetchIngredients = async () => {
            const response = await axios.get("/ingredients")
            setAllIngredients(response.data.data);
        }
        fetchIngredients();
    }, []);

    const handleAddIngredient = (ingredientId: number) => {
        const ingToAdd = allIngredients.find((ingredient) => ingredient.id_ingredient === ingredientId);
        if (!chosenIngredients.some(ing => ing.id_ingredient == ingredientId) && ingToAdd) {
            setChosenIngredients([...chosenIngredients, ingToAdd]);
        }
    };
    const filteredIngredients = allIngredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(search.toLowerCase()))
    return(
        <div className={styles.wrapper}>
            <div className={styles.searchresultswrapper}>
                <TextInput
                    label={""}
                    type={"text"}
                    placeholder={"Wyszukaj składnik"}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <IngredientSearchResults
                    handleAddIngredient={handleAddIngredient}
                    searchIngredients={filteredIngredients}/>
            </div>
        </div>

    )
}

function IngredientSearchResults({handleAddIngredient, searchIngredients}: {
    handleAddIngredient: (ingredientId: number) => void,
    searchIngredients?: { id_ingredient: number, name: string }[]
}) {
    return (
        <div className={styles.searchresults}>
            {searchIngredients?.
            map((ingredient) =>
                <Button
                    key={ingredient.id_ingredient}
                    text={ingredient.name}
                    type={"button"}
                    variant={"ingredient"}
                    onClick={() => handleAddIngredient(ingredient.id_ingredient)}
                />)}
        </div>
    )
}