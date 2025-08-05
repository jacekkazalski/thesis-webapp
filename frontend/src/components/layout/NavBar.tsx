import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Collapse,
    TextField,
    Box,
    Stack,
    useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import {Kitchen, Logout, Login, Person, PersonAdd, HomeOutlined,Add, Schedule, CasinoOutlined, SearchOutlined, Preview} from "@mui/icons-material";
import useAuth from "../../hooks/useAuth.tsx";
import { axiosCustom } from "../../api/axios.ts";
import { useEffect, useRef, useState } from 'react';

export default function NavBar() {
    const navigate = useNavigate();
    const { auth, setAuth } = useAuth();
    const [showSearch, setShowSearch] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);
    const isAuthenticated = !!auth.accessToken;
    const theme = useTheme()
    const isWide = useMediaQuery(theme.breakpoints.up('md'))

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
    useEffect(() => {
        if (showSearch && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }
    , [showSearch]);

    return (
        <AppBar position="static" elevation={3} color="default">
            <Toolbar>
                <Stack direction="row">
                    {/* Logo or Title */}
                <NavButton
                    icon={HomeOutlined}
                    text="Główna"
                    onClick={() => navigate("/")}
                />
                <NavButton
                    icon={Add}
                    text="Dodaj"
                    onClick={() => navigate("/create")}
                />
                <NavButton
                    icon={Schedule}
                    text="Nowe"
                    onClick={() => navigate("/")}
                />
                <NavButton
                    icon={CasinoOutlined}
                    text="Losuj"
                    onClick={() => navigate("/")}
                />
              
                <Box
                    display="flex"
                    alignItems="center"
                >
                   {isWide ? (
                            <TextField
                                variant="outlined"
                                inputRef={searchInputRef}
                                size="small"
                                placeholder="Szukaj..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                sx={{ width: '100%' }}
                            />
                        ) : (
                            <>
                              <NavButton
                    icon={SearchOutlined}
                    text="Szukaj"
                    onClick={() => setShowSearch((prev: any) => !prev)}
                />
                             <Collapse in={showSearch} orientation='horizontal' sx={{ width: '100%' }}>
                                <TextField
                                    variant="outlined"
                                    inputRef={searchInputRef}
                                    size="small"
                                    placeholder="Szukaj..."
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    sx={{ width: '100%' }}
                                />
                            </Collapse>
                            </>
                           
                        )}
                </Box>
            </Stack>
           <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
    {isAuthenticated ? (
        <>
            <NavButton
                icon={Person}
                text={auth.username ?? "Profil"}
                onClick={() => navigate('/user/')}
            />
            <NavButton
                icon={Logout}
                text="Wyloguj"
                onClick={handleLogout}
            />
        </>
    ) : (
        <>
            <NavButton
                icon={Login}
                text="Zaloguj"
                onClick={() => navigate('/login')}
            />
            <NavButton
                icon={PersonAdd}
                text="Zarejestruj"
                onClick={() => navigate('/register')}
            />
        </>
    )}
</Stack>
               
            </Toolbar>
        </AppBar>
    );
}
export function NavButton({icon: Icon, text, onClick}: {icon: React.ElementType, text: string, onClick: () => void}) {
    return (
        <Button
            onClick={onClick}
            color="primary"
            sx={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 1,
            }}
        >
            <Icon sx={{ fontSize: 25 }} />
            <Typography variant="caption" sx={{ textTransform: 'none', fontSize: 12 }}>
                {text}
            </Typography>
        </Button>
    );
}