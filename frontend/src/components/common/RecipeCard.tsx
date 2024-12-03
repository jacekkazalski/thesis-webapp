import examplePhoto from '../../assets/spaghetti.jpg'
import styles from './RecipeCard.module.css'

export default function RecipeCard(){
    return(
        <div className={styles.content}>
            <img
                src={examplePhoto}
                alt="Recipe Card"
            />
            <div>
                Recipe Name
            </div>
            <div>
                Autor
            </div>
            <div>
                Ocena 5/5
            </div>
            <div>
                Składniki 5/5
            </div>
        </div>
    )
}