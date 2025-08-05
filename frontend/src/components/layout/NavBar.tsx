import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    TextField,
    Box
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import {Cookie, Logout, Login, Person, PersonAdd} from "@mui/icons-material";
import useAuth from "../../hooks/useAuth.tsx";
import { axiosCustom } from "../../api/axios.ts";

export default function NavBar() {
    const navigate = useNavigate();
    const { auth, setAuth } = useAuth();
    const isAuthenticated = !!auth.accessToken;

    const handleLogout = async () => {
        try {
            await axiosCustom.get("/auth/logout");
            setAuth({});
            setTimeout(() => navigate('/'), 0);
            console.log(auth)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AppBar position="static" color="default" elevation={2}>
            <Toolbar>
                <IconButton size="large"edge="start" color="inherit" onClick={() => navigate("/")}>
                    <Cookie fontSize='inherit'/>
                </IconButton>
                <Typography
                    variant="h6"
                    color="inherit"
                    sx={{ flexGrow: 1, cursor: 'pointer' }}
                    onClick={() => navigate("/")}
                >
                    Co w lodówce
                </Typography>
                <Box sx={{ flexGrow: 2, mx: 2 }}>
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Szukaj..."
                        fullWidth
                    />
                </Box>
                {isAuthenticated ? (
                    <>
                        <Button
                            variant='outlined'
                            startIcon={<Person />}
                            onClick={() => navigate('/user/')}
                        >
                            {auth.username}
                        </Button>
                        <Box sx={{mx:1}} />
                        <Button
                        variant='outlined'
                            startIcon={<Logout />}
                            onClick={handleLogout}
                        >
                            Wyloguj
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            variant='contained'
                            startIcon={<Login />}
                            onClick={() => navigate('/login')}
                        >
                            Zaloguj
                        </Button>
                        <Box sx={{mx:1}} />
                        <Button
                            variant='outlined'
                            startIcon={<PersonAdd />}
                            onClick={() => navigate('/register')}
                        >
                            Zarejestruj
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}