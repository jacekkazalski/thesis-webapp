import Button from "../components/common/Button.tsx";
import useAxiosPrivate from "../hooks/useAxiosPrivate.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import TextInput from "../components/common/TextInput.tsx";
import styles from "./AddRecipePage.module.css"
import IngredientSearchBox from "../components/common/IngredientSearchBox.tsx";
import {AxiosError} from "axios";

export default function AddRecipePage() {
    const [name, setName] = useState("");
    const [instructions, setInstructions] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [chosenIngredients, setChosenIngredients] = useState<{ id_ingredient: number, name: string }[]>([]);
    const [ingredients, setIngredients] = useState<{id_ingredient: number, quantity: string}[]>([]);
    const [errorMsg, setErrorMsg] = useState("");

    const MAX_FILE_SIZE = 4;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE * 1024 * 1024;

    const instructionsRef = useRef<HTMLTextAreaElement>(null)

    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const location = useLocation()


    // Update ingredient array for the request
    useEffect(() => {
        setIngredients(chosenIngredients.map(ingredient => ({
            id_ingredient: ingredient.id_ingredient,
            quantity: ""
        })))
        console.log(ingredients)
    }, [chosenIngredients]);
    // Update array with quantity on input change
    const handleQuantityChange = (ingredientId: number, quantity: string) => {
        setIngredients(prev => prev.map(ing =>
        ing.id_ingredient === ingredientId
        ? {...ing, quantity: quantity} : ing))
    }
    // Remove ingredient from chosen ingredients
    const handleRemoveIngredient = (ingredientId: number) => {
        const ingToRemove = chosenIngredients.find(ing => ing.id_ingredient == ingredientId);
        if (ingToRemove) {
            setChosenIngredients(prevIngredients =>
                    prevIngredients.filter(ing => ing.id_ingredient !== ingredientId)
            )
        }
    }
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (file.size > MAX_FILE_SIZE_BYTES) {
                setErrorMsg(`Maksymalny rozmiar pliku to ${MAX_FILE_SIZE} MB`)
                return;
            }
            setSelectedImage(event.target.files[0]);
            setErrorMsg("")
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setErrorMsg("")
        if(chosenIngredients.length < 1) {
            setErrorMsg("Musisz wybrać przynajmniej jeden składnik")
            return;
        }

        try{
            const formData = new FormData();
            formData.append("name", name);
            formData.append("instructions", instructions);
            formData.append("ingredients", JSON.stringify(ingredients));
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            const response = await axiosPrivate.post("/recipes/create",
                formData,
                {
                    headers: {'Content-Type': 'multipart/form-data'}
                }
            )
            setName("")
            setInstructions("")
            setChosenIngredients([])
            setSelectedImage(null)

            const recipeId = response.data.data.id_recipe
            navigate(`/recipe/${recipeId}`)
        } catch(error){
            // If refresh token expired navigate to login and replace from location to get back
            console.log('ref exp')
            console.log(error)
            if(error instanceof AxiosError){
                if(error.response?.status === 403){
                    navigate('/login', {state: {from: location}, replace: true})
                }
            }


        }
    }
    return(
        <div className={styles.wrapper}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h1>Dodaj przepis</h1>
                {errorMsg && <p className={styles.errormsg}>{errorMsg}</p>}
                <TextInput
                    label={"Nazwa przepisu"}
                    type={"text"}
                    placeholder={"Nazwa przepisu"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={styles.title}
                />

                <label htmlFor={"instructions"} className={styles.instructionsLabel}>Sposób przygotowania</label>
                <textarea
                    value={instructions}
                    id={"instructions"}
                    ref={instructionsRef}
                    placeholder={"Sposób przygotowania..."}
                    onChange={(e) => {
                        setInstructions(e.target.value)
                        if (instructionsRef.current) {
                            instructionsRef.current.style.height = "auto"
                            instructionsRef.current.style.height = `${instructionsRef.current.scrollHeight}px`
                        }
                    }}
                    className={styles.instructions}
                    rows={1}
                />
                <div className={styles.addPhoto}>
                    <label
                        className={styles.fileButton}
                        htmlFor={"fileInput"}>
                        Dodaj zdjęcie
                    </label>
                    <input
                        className={styles.fileInput}
                        id={"fileInput"}
                        type={"file"}
                        accept={"image/*"}
                        onChange={handleFileChange}
                    />
                    <span>{selectedImage?.name || "Nie wybrano pliku"}</span>
                </div>
                <div className={styles.addIngredients}>
                    <h2>Składniki</h2>
                    <IngredientSearchBox
                        chosenIngredients={chosenIngredients}
                        setChosenIngredients={setChosenIngredients}
                    />
                    {chosenIngredients.map((ingredient) =>
                        <div className={styles.ingredientRow} key={ingredient.id_ingredient}>
                            <Button
                                text={ingredient.name}
                                type={"button"}
                                variant={"ingredient"}
                                onClick={() => handleRemoveIngredient(ingredient.id_ingredient)}
                            />
                            <TextInput
                                label={""}
                                type={"text"}
                                placeholder={"Ilość"}
                                onChange={(e) => handleQuantityChange(ingredient.id_ingredient, e.target.value)}
                            />
                        </div>)}
                </div>

                <Button text={"Dodaj przepis"} type={"submit"} variant={"primary"} className={styles.submit}/>
            </form>

        </div>
    )
}