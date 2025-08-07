import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { AxiosError } from "axios";
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Alert
} from "@mui/material";

export default function RegistrationPage() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                mt: 8,
            }}
        >
            <RegistrationForm />
        </Box>
    );
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

        if (password.length < 8) {
            setError("Hasło musi mieć przynajmniej 8 znaków");
            return;
        }
        if (password !== confirmPassword) {
            setError("Hasła nie zgadzają się");
            return;
        }

        try {
            await axios.post("/auth/signup",
                JSON.stringify({
                    email: email,
                    password: password,
                    confirmPassword: confirmPassword,
                    username: username,
                }), {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            setSuccess(true);
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err.response?.data.message === "Email already exists") {
                    setError("Email już istnieje");
                }
                else if (err.response?.data.message === "Username already exists") {
                    setError("Zajęta nazwa użytkownika");
                }
                else if (err.response?.data.message === "Invalid email") {
                    setError("Niepoprawny adres email");
                }
                else {
                    setError(err.message);
                }
            } else {
                setError("Rejestracja nieudana");
            }
        }
    };

    return (
        <Box
            component={Paper}
            elevation={3}
            sx={{
                width: 320,
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
            }}
        >
            {success ? (
                <>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Rejestracja udana
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/login")}
                        fullWidth
                    >
                        Zaloguj się
                    </Button>
                </>
            ) : (
                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Rejestracja
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <TextField
                        label="E-mail"
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                        autoFocus
                        margin="normal"
                    />
                    <TextField
                        label="Nazwa użytkownika"
                        type="text"
                        placeholder="Nazwa użytkownika"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Hasło"
                        type="password"
                        placeholder="Hasło"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Potwierdź hasło"
                        type="password"
                        placeholder="Potwierdź hasło"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Zarejestruj
                    </Button>
                </form>
            )}
        </Box>
    );
}