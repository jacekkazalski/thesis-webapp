import styles from "./LoginPage.module.css";
import TextInput from "../components/common/TextInput.tsx";
import Button from "../components/common/Button.tsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "../api/axios.ts";
import {AxiosError} from "axios";


export default function RegistrationPage() {
    return (
        <div>
            <RegistrationForm/>
        </div>
    )
}

function RegistrationForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");

        if(password.length < 8) {
            setError("Hasło musi mieć przynajmniej 8 znaków")
            return
        }
        if(password !== confirmPassword){
            setError("Hasła nie zgadzają się")
            return
        }

        try {
            await axios.post("/auth/signup",
                JSON.stringify({
                    email: email,
                    password: password,
                    confirmPassword: confirmPassword,
                    username: username,
                }), {
                    headers: {'Content-Type': 'application/json'},
                }
            );
            setSuccess(true)
        } catch (err) {
            if(err instanceof AxiosError){
                if(err.response?.data.message === "Email already exists") {
                    setError("Email już istnieje");
                }
                else if(err.response?.data.message === "Username already exists") {
                    setError("Zajęta nazwa użytkownika");
                }
                else if(err.response?.data.message === "Invalid email") {
                    setError("Niepoprawny adres email");
                }
                else {
                    setError(err.message);
                }
            } else {
                setError("Rejestracja nieudana");
            }
        }


    }
    return (
        <>
            {success ? (
                <div>
                    <h2>Rejestracja udana</h2>
                    <Button
                        text={"Zaloguj się"}
                        type={"button"}
                        variant={"primary"}
                        onClick={() => navigate("/login")}
                    />
                </div>) : (
                <form className={styles['login-form']} onSubmit={handleSubmit}>
                    <h2>Rejestracja</h2>
                    {error && <p className={styles.errormsg}>{error}</p>}
                    <TextInput
                        label={"E-mail"}
                        type={"text"}
                        placeholder={"E-mail"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextInput
                        label={"Nazwa użytkownika"}
                        type={"text"}
                        placeholder={"Nazwa użytkownika"}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <TextInput
                        label={"Hasło"}
                        type={"password"}
                        placeholder={"Hasło"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <TextInput
                        label={"Potwierdź hasło"}
                        type={"password"}
                        placeholder={"Potwierdź hasło"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <Button variant={"primary"} text={"Zarejestruj"} type={"submit"}/>



                </form>)}
        </>

    )
}