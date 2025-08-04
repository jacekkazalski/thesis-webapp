import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.tsx";
import axios from "../api/axios.ts";
import { AxiosError } from "axios";
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Alert
} from "@mui/material";

export default function LoginPage() {
    return <LoginForm />;
}

function LoginForm() {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        try {
            const response = await axios.post(
                "/auth/login",
                JSON.stringify({ email, password }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            const accessToken = response?.data?.accessToken;
            const username = response?.data?.username;
            setAuth({ accessToken, username, email });
            setEmail("");
            setPassword("");
            navigate(from, { replace: true });
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err.response?.data.message === "Invalid email or password") {
                    setError("Błędny login lub hasło");
                } else {
                    setError("Błąd logowania");
                }
            } else {
                setError("Błąd logowania");
            }
        }
    };

    return (
        <Box
        sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
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
            <Typography variant="h5" component="h2" gutterBottom>
                Logowanie
            </Typography>
            {error && (
                <Alert severity="error" sx={{ width: "100%" }}>
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
                label="Hasło"
                type="password"
                placeholder="Hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                margin="normal"
                fullWidth
            />
            <Button
                variant="contained"
                type="submit"
                fullWidth
                onClick={handleSubmit}
            >
                Zaloguj
            </Button>
        </Box>
    </Box>
    );
}