import IngredientSearchBox from "../common/IngredientSearchBox.tsx";
import styles from "./Sidebar.module.css"
import {useNavigate} from "react-router-dom";

export default function Sidebar(){
    const navigate = useNavigate();
    return(
        <div className={styles.sidebar}>
            <a className={styles.navbutton} onClick={() => navigate("/")}>Strona główna</a>
            <a className={styles.navbutton}>Dodaj przepis</a>
            <a className={styles.navbutton}>Ostatnio dodane</a>
            <a className={styles.navbutton}>Losuj przepis</a>

            <p>Filtrowanie</p>
            <IngredientSearchBox/>
        </div>
    )
}

