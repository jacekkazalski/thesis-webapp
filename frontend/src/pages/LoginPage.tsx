import TextInput from "../components/common/TextInput.tsx";
import Button from "../components/common/Button.tsx";
import styles from "./LoginPage.module.css"

export default function LoginPage() {
    return(
        <div>
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
            <Button text={"Zaloguj"} type={"submit"}/>

        </form>
    )
}