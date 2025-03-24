import styles from './RecipePage.module.css'
import Button from "../components/common/Button.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import placeholderImg from "../assets/placeholder.png"
import axios from '../api/axios.ts'
import {faEdit, faHeart, faTrash} from "@fortawesome/free-solid-svg-icons";
import {faStar, faUser} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Ingredient} from "../utils/types.ts";
import useAxiosCustom from "../hooks/useAxiosCustom.tsx";

export default function RecipePage() {
    const [name, setName] = useState("");
    const [instructions, setInstructions] = useState("");
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [author, setAuthor] = useState<{username: string, id_user: number}>()
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const {recipeId} = useParams<{ recipeId: string }>();

    const navigate = useNavigate();
    const axiosCustom = useAxiosCustom();

    const handleFavourite = async () => {
        try {
           await axiosCustom.post(`/recipes/favourites`,
                JSON.stringify({id_recipe: recipeId}))
        } catch (err) {
            console.log(err)
        }
    }

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
                <Button
                    text={"" + author?.username}
                    icon={faUser}
                    type={"button"}
                    variant={"hyperlink"}
                    onClick={() => navigate(`user/${author?.id_user}`)}
                />
                <div>
                    <FontAwesomeIcon icon={faStar}/>
                    <FontAwesomeIcon icon={faStar}/>
                    <FontAwesomeIcon icon={faStar}/>
                    <FontAwesomeIcon icon={faStar}/>
                    <FontAwesomeIcon icon={faStar}/>
                </div>
                <Button
                    type={"button"}
                    variant={"primary"}
                    icon={faHeart}
                    className={styles.favButton}
                    onClick={handleFavourite}
                />
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