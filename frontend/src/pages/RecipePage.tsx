import styles from './RecipePage.module.css'
import Button from "../components/common/Button.tsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import placeholderImg from "../assets/placeholder.png"
import axios from '../api/axios.ts'

export default function RecipePage() {
    const [name, setName] = useState("");
    const [instructions, setInstructions] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [author, setAuthor] = useState<{username: string, user_id: number}>()
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const {recipeId} = useParams<{ recipeId: string }>();
    useEffect(() => {
        const fetchRecipe = async () => {
            const response = await axios.get("/recipes/recipe", {
                params: {
                    id_recipe: recipeId,
                }
            })

            setName(response.data.name);
            setInstructions(response.data.instructions);
            setIngredients(response.data.ingredients);
            setAuthor(response.data.author)
            setImageUrl(response.data.image_url)
        }
        fetchRecipe();

    }, [recipeId]);
    return(
        <div className={styles.content}>
            <img className={styles.banner} src={imageUrl || placeholderImg} alt="example photo" />
            <div className={styles.info}>
                <h1>{name}</h1>
                <Button text={""+author?.username} type={"button"} variant={"hyperlink"}/>
            </div>
            <div className={styles.steps}>
                {instructions}
            </div>
            <div className={styles.ingredients}>
                <ul>
                    {ingredients.map((ingredient) => <li key={ingredient.id_ingredient}>
                        {ingredient.Ingredient.name} {ingredient.quantity}
                    </li>)}
                </ul>
            </div>
        </div>
    )
}