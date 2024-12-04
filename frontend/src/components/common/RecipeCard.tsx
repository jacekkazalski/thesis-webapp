import examplePhoto from '../../assets/spaghetti.jpg'
import styles from './RecipeCard.module.css'
import Button from "./Button.tsx";

export default function RecipeCard(){
    return(
        <div className={styles.content}>
            <img
                src={examplePhoto}
                alt="Recipe Card"
            />
            <div className={styles.name}>
                <h3>Recipe Name</h3>
            </div>
            <div className={styles.author}>
                <Button text={"Autor"} type={"button"} variant={"hyperlink"}/>
            </div>
            <div className={styles.rating}>
                Ocena 5/5
            </div>
            <div className={styles.ingredients}>
                Składniki 5/5
            </div>
        </div>
    )
}