import TextInput from "../common/TextInput.tsx";
import Button from "../common/Button.tsx";
import styles from "./NavBar.module.css";

export default function NavBar(){
    return(
        <div className={styles.navbar}>
            <div className={styles.logo}>
                <h2>Co w lodówce</h2>
            </div>
            <div className={styles.searchbar}>
                <TextInput label={"Szukaj"} type={"text"} placeholder={"Szukaj..."}/>
            </div>

            <div className={styles.buttons}>
                <Button variant={"primary"} text={"Logowanie"} type={"button"}/>
                <Button variant={"primary"} text={"Rejestracja"} type={"button"}/>
            </div>

        </div>
    )
}