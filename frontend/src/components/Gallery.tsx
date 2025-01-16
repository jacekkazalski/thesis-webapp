import styles from './Gallery.module.css'
import Button from "./common/Button.tsx";
import {useEffect, useState} from "react";
import RecipeCard from "./common/RecipeCard.tsx";
import axios from "../api/axios.ts";
import {Recipe} from "../services/types.ts";
import {faList,faTable} from "@fortawesome/free-solid-svg-icons";

export default function Gallery(){
    const [viewType, setViewType] = useState<"gallery" | "list">("gallery")
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    //TODO: Pagination

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
                <Button icon={faList} type={"button"} variant={"primary"} onClick={() => setViewType("list")}/>
                <Button icon={faTable} type={"button"} variant={"primary"} onClick={() => setViewType("gallery")}/>
            </div>
            <div className={`${styles[viewType]}`}>
                {recipes.map((recipe) => (<RecipeCard key={recipe.id_recipe} variant={viewType} recipe={recipe}/>))}

            </div>

        </div>
    )
}