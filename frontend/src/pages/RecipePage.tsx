import styles from './RecipePage.module.css'
import Button from "../components/common/Button.tsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import placeholderImg from "../assets/placeholder.png"
import profileImg from "../assets/profile.png"
import axios from '../api/axios.ts'
import {faEdit, faHeart, faTrash} from "@fortawesome/free-solid-svg-icons";
import {faStar} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Ingredient} from "../services/types.ts";

export default function RecipePage() {
    const [name, setName] = useState("");
    const [instructions, setInstructions] = useState("");
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
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
            <img className={styles.banner} src={imageUrl || placeholderImg} alt="example photo"/>
            <div className={styles.info}>

                <h1>{name}</h1>
                <img src={profileImg} alt={"profile picture"} width={40}/>
                <Button text={"" + author?.username} type={"button"} variant={"hyperlink"}/>
                <div>
                    <FontAwesomeIcon icon={faStar}/>
                    <FontAwesomeIcon icon={faStar}/>
                    <FontAwesomeIcon icon={faStar}/>
                    <FontAwesomeIcon icon={faStar}/>
                    <FontAwesomeIcon icon={faStar}/>
                </div>
                <Button type={"button"} variant={"primary"} icon={faHeart} className={styles.favButton}/>
                <Button type={"button"} variant={"primary"} icon={faTrash}/>
                <Button type={"button"} variant={"primary"} icon={faEdit}/>
            </div>
            <div className={styles.ingredientsAndSteps}>
            <div className={styles.ingredients}>
                    {ingredients.map((ingredient) => (
                        <div className={styles.ingredientRow} key={ingredient.id_ingredient}>
                            {ingredient.name} {ingredient.quantity}
                        </div>
                    ))}
                </div>
                <div className={styles.steps}>
                    {instructions}
                </div>
            </div>


        </div>
    )
}