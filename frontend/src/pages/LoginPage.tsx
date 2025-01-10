import TextInput from "../components/common/TextInput.tsx";
import Button from "../components/common/Button.tsx";
import styles from "./LoginPage.module.css"
import React, {useState} from "react";
import useAuth from "../hooks/useAuth.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import apiClient from "../utils/apiClient.tsx";

export default function LoginPage() {
    return(
            <LoginForm/>
    )
}

function LoginForm(){
    const {setAuth} = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/"

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setError("")
        try {
            const data = await apiClient("/auth/login", {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    email: email,
                    password: password,
                })
            });
            const accessToken = data.accessToken;
            const username = data.username;
            setAuth({accessToken: accessToken, username: username, email: email})
            setEmail('')
            setPassword('')
            navigate(from, {replace: true})
        } catch (err) {
            if (err.message === "Invalid email or password") {
                setError("Błędny login lub hasło")
            } else {
                setError("Błąd logowania")
            }
        }

    }
    return (
        <form className={styles['login-form']} onSubmit={handleSubmit}>
            <h2>Logowanie</h2>
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
                label={"Hasło"}
                type={"password"}
                placeholder={"Hasło"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <Button variant={"primary"} text={"Zaloguj"} type={"submit"}/>

        </form>
    )
}