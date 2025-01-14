import styles from './RecipeCard.module.css'
import Button from "./Button.tsx";
import {Recipe} from "../../services/types.ts";
import {useNavigate} from "react-router-dom";
import placeholderImg from "../../assets/placeholder.png"
interface Props{
    recipe: Recipe
}
export default function RecipeCard({recipe}: Props) {
    const navigate = useNavigate();

    return(
        <div className={styles.content} onClick={() => navigate(`/recipe/${recipe.id_recipe}`) }>
            <img
                src={recipe.image_url || placeholderImg}
                alt="recipe image"
            />
            <div className={styles.name}>
                <h3>{recipe.name}</h3>
            </div>
            <div className={styles.author}>
                <Button text={`${recipe.author.username}`} type={"button"} variant={"hyperlink"}/>
            </div>
            <div className={styles.rating}>
                /5
            </div>
            <div className={styles.ingredients}>
                Składniki 5/5
            </div>
        </div>
    )
}