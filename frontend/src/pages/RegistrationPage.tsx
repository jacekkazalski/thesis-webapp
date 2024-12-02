import styles from "./LoginPage.module.css";
import TextInput from "../components/common/TextInput.tsx";
import Button from "../components/common/Button.tsx";


export default function RegistrationPage() {
    return(
        <div>
            <RegistrationForm/>
        </div>
    )
}
function RegistrationForm() {
    return (
        <form className={styles['login-form']}>
            <h2>Co w lodówce</h2>
            <h1>Rejestracja</h1>
            <TextInput label={"E-mail"} type={"text"} placeholder={"E-mail"}/>
            <TextInput label={"Hasło"} type={"text"} placeholder={"Hasło"}/>
            <TextInput label={"Powtórz hasło"} type={"text"} placeholder={"Powtórz hasło"}/>
            <Button variant={"primary"} text={"Zarejestruj"} type={"submit"}/>

        </form>
    )
}