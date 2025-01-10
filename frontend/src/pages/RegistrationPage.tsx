import styles from "./LoginPage.module.css";
import TextInput from "../components/common/TextInput.tsx";
import Button from "../components/common/Button.tsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";


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
            setSuccess(true)
        } catch (err) {
            if(err.message === "Email already exists") {
                setError("Email już istnieje");
            }
            else if(err.message === "Username already exists") {
                setError("Zajęta nazwa użytkownika");
            }
            else {
                setError(err.message);
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
                    {error && <p style={{color: "red"}}>{error}</p>}
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
                        type={"text"}
                        placeholder={"Hasło"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <TextInput
                        label={"Potwierdź hasło"}
                        type={"text"}
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