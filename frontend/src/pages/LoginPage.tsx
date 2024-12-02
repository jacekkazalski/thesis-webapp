import TextInput from "../components/common/TextInput.tsx";
import Button from "../components/common/Button.tsx";
import styles from "./LoginPage.module.css"
import NavBar from "../components/layout/NavBar.tsx";

export default function LoginPage() {
    return(
        <div>
            <NavBar/>
            <LoginForm/>
        </div>
    )
}

function LoginForm(){
    return (
        <form className={styles['login-form']}>
            <h2>Co w lodówce</h2>
            <h1>Logowanie</h1>
            <TextInput label={"E-mail"} type={"text"} placeholder={"E-mail"} />
            <TextInput label={"Hasło"} type={"text"} placeholder={"Hasło"} />
            <Button variant={"primary"} text={"Zaloguj"} type={"submit"}/>

        </form>
    )
}