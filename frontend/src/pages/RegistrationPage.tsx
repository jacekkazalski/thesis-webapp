import styles from "./LoginPage.module.css";
import TextInput from "../components/common/TextInput.tsx";
import Button from "../components/common/Button.tsx";
import {useState} from "react";


export default function RegistrationPage() {
    return(
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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await fetch("http://localhost:3000/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    confirmPassword: confirmPassword,
                    username: username,
                })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Signup failed");
            }
        } catch (error) {
            setError(error.message);
        }
    }
    return (
        <form className={styles['login-form']} onSubmit={handleSubmit}>
            <h2>Co w lodówce</h2>
            <h1>Rejestracja</h1>
            <TextInput
                label={"E-mail"}
                type={"text"}
                placeholder={"E-mail"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextInput
                label={"Nazwa użytkownika"}
                type={"text"}
                placeholder={"Nazwa użytkownika"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextInput
                label={"Hasło"}
                type={"text"}
                placeholder={"Hasło"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <TextInput
                label={"Powtórz hasło"}
                type={"text"}
                placeholder={"Powtórz hasło"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button variant={"primary"} text={"Zarejestruj"} type={"submit"}/>

            {error && <p style={{ color: "red" }}>{error}</p>}

        </form>
    )
}