import styles from './RecipeCard.module.css'
import Button from "./Button.tsx";
import {Recipe} from "../../services/types.ts";
import  {mockUsers, mockRatings} from '../../services/mockdata.ts'
interface Props{
    recipe: Recipe
}
export default function RecipeCard({recipe}: Props) {
    const user = mockUsers.find((user) => user.id_user === recipe.added_by);
    const ratings = mockRatings.filter((rating) => rating.id_recipe == recipe.id_recipe);
    const avgRating =
        ratings.length > 0
            ? ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length
            : 0;
    return(
        <div className={styles.content}>
            <img
                src={recipe.image_path}
                alt="recipe image"
            />
            <div className={styles.name}>
                <h3>{recipe.name}</h3>
            </div>
            <div className={styles.author}>
                <Button text={`${user.username}`} type={"button"} variant={"hyperlink"}/>
            </div>
            <div className={styles.rating}>
                {avgRating}/5
            </div>
            <div className={styles.ingredients}>
                Składniki 5/5
            </div>
        </div>
    )
}