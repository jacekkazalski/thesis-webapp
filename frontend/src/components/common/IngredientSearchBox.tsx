import TextInput from "./TextInput.tsx";
import styles from "./IngredientSearchBox.module.css"
import Button from "./Button.tsx";

export default function IngredientSearchBox() {
    return(
        <div className={styles.wrapper}>
            <TextInput
                label={"Wyszukaj skłądnik"}
                type={"text"}
                placeholder={"Wyszukaj składnik"}
            />
            <IngredientSearchResults/>
        </div>
    )
}
function IngredientSearchResults(){
    return(
        <div className={styles.searchresults}>
            <Button text={"Ingredient name"} type={"button"} variant={"ingredient"}/>
            <Button text={"Ingredient name"} type={"button"} variant={"ingredient"}/>
            <Button text={"Ingredient name"} type={"button"} variant={"ingredient"}/>
            <Button text={"Ingredient name"} type={"button"} variant={"ingredient"}/>
        </div>
    )
}