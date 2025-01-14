import TextInput from "../components/common/TextInput.tsx";
import Button from "../components/common/Button.tsx";
import styles from "./LoginPage.module.css"
import React, {useState} from "react";
import useAuth from "../hooks/useAuth.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "../api/axios.ts"
import {AxiosError} from "axios";

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
            const response = await axios.post("/auth/login",
                JSON.stringify({email, password}),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            )
            const accessToken = response?.data?.accessToken;
            const username = response?.data?.username;
            setAuth({accessToken: accessToken, username: username, email: email})
            setEmail('')
            setPassword('')
            navigate(from, {replace: true})
        } catch (err) {
            if(err instanceof AxiosError) {
                if (err.response?.data.message === "Invalid email or password") {
                    setError("Błędny login lub hasło")
                }
                else {
                    setError("Błąd logowania")
                }
            } else {
                setError("Błąd logowania")
            }
        }

    }
    return (
        <form className={styles['login-form']} onSubmit={handleSubmit}>
            <h2>Logowanie</h2>
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