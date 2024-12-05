import TextInput from "./TextInput.tsx";
import styles from "./IngredientSearchBox.module.css"
import Button from "./Button.tsx";
import {mockIngredients} from "../../services/mockdata.ts";
import {useState} from "react";

export default function IngredientSearchBox() {
    const [chosenIngredients, setChosenIngredients] = useState<number[]>([]);
    const handleAddIngredient = (ingredientId: number) => {
        if (!chosenIngredients.includes(ingredientId)) {
            setChosenIngredients([...chosenIngredients, ingredientId]);
        }
    };
    const handleRemoveIngredient = (ingredientId: number) => {
        setChosenIngredients(chosenIngredients.filter((id) => id !== ingredientId));
    };
    return(
        <div className={styles.wrapper}>
            <div className={styles.searchresultswrapper}>
                <TextInput
                    label={"Wyszukaj skłądnik"}
                    type={"text"}
                    placeholder={"Wyszukaj składnik"}
                />
                <IngredientSearchResults handleAddIngredient={handleAddIngredient}/>
            </div>
            <ChosenIngredients handleRemoveIngredient={handleRemoveIngredient} chosenIngredients={chosenIngredients}/>
        </div>

    )
}

function IngredientSearchResults({handleAddIngredient}: {handleAddIngredient: (ingredientId: number) => void}) {
    return (
        <div className={styles.searchresults}>
            {mockIngredients.
            map((ingredient) =>
                <Button
                    text={ingredient.name}
                    type={"button"}
                    variant={"ingredient"}
                    onClick={() => handleAddIngredient(ingredient.id_ingredient)}
                />)}
        </div>
    )
}
function ChosenIngredients(
    {
        chosenIngredients, handleRemoveIngredient
    }: {
        chosenIngredients: number[];
        handleRemoveIngredient: (id: number) => void;
    }){
    return(
        <div className={styles.choseningredients}>
            <div className={styles.title}>Wybrane składniki</div>
            {chosenIngredients.map((ingredientId: number) => {
                const ingredient = mockIngredients.find((ingredient) => ingredientId == ingredient.id_ingredient)
                return(
                    <Button
                        text={ingredient.name}
                        type={"button"}
                        variant={"ingredient"}
                        onClick={() => handleRemoveIngredient(ingredient.id_ingredient)}
                    />
                )
            })}

        </div>
    )
}