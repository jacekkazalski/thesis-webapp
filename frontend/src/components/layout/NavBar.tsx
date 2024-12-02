import TextInput from "../common/TextInput.tsx";
import Button from "../common/Button.tsx";
import styles from "./NavBar.module.css";
import {useNavigate} from "react-router-dom";

export default function NavBar(){
    const navigate = useNavigate();
    return(
        <div className={styles.navbar}>
            <div className={styles.logo}>
                <h2 onClick={() => navigate("/")}>Co w lodówce</h2>
            </div>
            <div className={styles.searchbar}>
                <TextInput label={"Szukaj"} type={"text"} placeholder={"Szukaj..."}/>
            </div>

            <div className={styles.buttons}>
                <Button
                    variant={"primary"}
                    text={"Logowanie"}
                    type={"button"}
                    onClick={() => navigate('/login')}/>
                <Button
                    variant={"primary"}
                    text={"Rejestracja"}
                    type={"button"}
                    onClick={() => navigate('/register')}/>
            </div>

        </div>
    )
}