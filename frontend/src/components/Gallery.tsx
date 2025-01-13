import styles from './Gallery.module.css'
import Button from "./common/Button.tsx";
import {useEffect, useState} from "react";
import RecipeCard from "./common/RecipeCard.tsx";
import axios from "../api/axios.ts";
import {RecipeCardData} from "../services/types.ts";

export default function Gallery(){
    const [viewType, setViewType] = useState<"gallery" | "list">("gallery")
    const [recipes, setRecipes] = useState<RecipeCardData[]>([]);
    //TODO: Pagination, recipe interface
    useEffect(() => {
        const fetchRecipes = async () => {
            const response = await axios.get("/recipes")
            console.log(response.data.data)
            setRecipes(response.data.data)
        }
        fetchRecipes();
    }, []);
    return(
        <div className={styles.content}>
            <div className={styles.options}>
                <Button text={"Sortuj wg"} type={"button"} variant={"ingredient"}/>
                Sposób wyświetlania:
                <Button text={"G"} type={"button"} variant={"primary"}/>
                <Button text={"L"} type={"button"} variant={"primary"}/>
            </div>
            <div className={`${styles[viewType]}`}>
                {recipes.map((recipe) => (<RecipeCard key={recipe.id_recipe} recipe={recipe}/>))}

            </div>

        </div>
    )
}