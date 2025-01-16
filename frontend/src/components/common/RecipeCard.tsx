import styles from './RecipeCard.module.css'
import Button from "./Button.tsx";
import {Recipe} from "../../services/types.ts";
import {useNavigate} from "react-router-dom";
import placeholderImg from "../../assets/placeholder.png"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar, faUser} from "@fortawesome/free-regular-svg-icons";
interface Props{
    recipe: Recipe
    variant: "gallery" | "list"
}
export default function RecipeCard({recipe, variant}: Props) {
    const navigate = useNavigate();
    //TODO: list view css
    const variantClass = styles[variant]
    return(
        <div className={variantClass} onClick={() => navigate(`/recipe/${recipe.id_recipe}`) }>
            <img
                src={recipe.image_url || placeholderImg}
                alt="recipe image"
            />
            <div className={styles.name}>
                <h3>{recipe.name}</h3>
            </div>
            <div className={styles.author}>
                <Button
                    text={`${recipe.author.username}`}
                    icon={faUser}
                    type={"button"}
                    variant={"hyperlink"}
                />
            </div>
            <div className={styles.rating}>
                <FontAwesomeIcon icon={faStar}/>
                <FontAwesomeIcon icon={faStar}/>
                <FontAwesomeIcon icon={faStar}/>
                <FontAwesomeIcon icon={faStar}/>
                <FontAwesomeIcon icon={faStar}/>
            </div>
            <div className={styles.ingredients}>
                Składniki 5/5
            </div>
        </div>
    )
}