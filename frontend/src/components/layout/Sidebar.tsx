import IngredientSearchBox from "../common/IngredientSearchBox.tsx";
import styles from "./Sidebar.module.css"

export default function Sidebar(){
    return(
        <div className={styles.sidebar}>
            <a className={styles.navbutton}>Strona główna</a>
            <a className={styles.navbutton}>Dodaj przepis</a>
            <a className={styles.navbutton}>Ostatnio dodane</a>
            <a className={styles.navbutton}>Losuj przepis</a>

            <p>Filtrowanie</p>
            <IngredientSearchBox/>
        </div>
    )
}

