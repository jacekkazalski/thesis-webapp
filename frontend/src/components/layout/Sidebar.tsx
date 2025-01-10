import IngredientSearchBox from "../common/IngredientSearchBox.tsx";
import styles from "./Sidebar.module.css"
import {useNavigate} from "react-router-dom";
import Button from "../common/Button.tsx";
import Checkbox from "../common/Checkbox.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHouse, faPlus, faClock, faDice } from "@fortawesome/free-solid-svg-icons";
import useRefreshToken from "../../hooks/useRefreshToken.tsx";

export default function Sidebar(){
    const navigate = useNavigate();
    const refresh = useRefreshToken()
    return(
        <div className={styles.sidebar}>
            <a className={styles.navbutton} onClick={() => navigate("/")}><FontAwesomeIcon icon={faHouse}/> Strona główna</a>
            <a className={styles.navbutton}onClick={() => navigate("/create")}><FontAwesomeIcon icon={faPlus}/> Dodaj przepis</a>
            <a className={styles.navbutton}><FontAwesomeIcon icon={faClock}/> Ostatnio dodane</a>
            <a className={styles.navbutton} onClick={() => navigate("/recipe")}><FontAwesomeIcon icon={faDice}/> Losuj przepis</a>
            <Button text={"Refresh token"} type={"button"} variant={"primary"} onClick={() => refresh()}/>
            <div>Filtrowanie</div>
            <IngredientSearchBox/>
            <Checkbox text={"Tylko przepisy z wybranymi składnikami"}/>
            <Button text={"Szukaj"} type={"submit"} variant={"primary"}/>
        </div>
    )
}

