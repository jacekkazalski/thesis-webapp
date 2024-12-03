import IngredientSearchBox from "../common/IngredientSearchBox.tsx";
import styles from "./Sidebar.module.css"
import {useNavigate} from "react-router-dom";
import Button from "../common/Button.tsx";
import Checkbox from "../common/Checkbox.tsx";

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
            <Checkbox text={"Tylko przepisy z wybranymi składnikami"}/>
            <Button text={"Szukaj"} type={"submit"} variant={"primary"}/>
        </div>
    )
}

