import styles from './Gallery.module.css'
import Button from "./common/Button.tsx";
import {useState} from "react";
import RecipeCard from "./common/RecipeCard.tsx";

export default function Gallery(){
    const [viewType, setViewType] = useState<"gallery" | "list">("gallery")
    return(
        <div className={styles.content}>
            <div className={styles.options}>
                <Button text={"Sortuj wg"} type={"button"} variant={"ingredient"}/>
                Sposób wyświetlania:
                <Button text={"G"} type={"button"} variant={"primary"}/>
                <Button text={"L"} type={"button"} variant={"primary"}/>
            </div>
            <div className={`${styles[viewType]}`}>
                <RecipeCard/>
                <RecipeCard/>
                <RecipeCard/>
                <RecipeCard/>
                <RecipeCard/>
                <RecipeCard/>
                <RecipeCard/>
                <RecipeCard/>
            </div>

        </div>
    )
}