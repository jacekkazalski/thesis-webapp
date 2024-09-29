import TextInput from "../common/TextInput.tsx";
import Button from "../common/Button.tsx";
import styles from "./NavBar.module.css";

export default function NavBar(){
    return(
        <div className={styles.navbar}>
            <h2>Co w lodówce</h2>
            <TextInput label={"Szukaj"} type={"text"} placeholder={"Szukaj..."}/>
            <Button variant={"primary"} text={"Logowanie"} type={"button"}/>
            <Button variant={"primary"} text={"Rejestracja"} type={"button"}/>
        </div>
    )
}