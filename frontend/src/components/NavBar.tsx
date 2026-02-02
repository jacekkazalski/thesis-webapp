import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Collapse,
  TextField,
  Box,
  Stack,
  useMediaQuery,
  ClickAwayListener,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Logout,
  Login,
  Person,
  PersonAdd,
  HomeOutlined,
  Add,
  Schedule,
  CasinoOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import useAuth from "../hooks/useAuth";
import axios, { axiosCustom } from "../api/axios";
import React, { useEffect, useRef, useState } from "react";
import logo from "../assets/cowlodowce_logo.png";

export default function NavBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || "",
  );
  const { auth, setAuth } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isAuthenticated = auth && !!auth.accessToken;
  const theme = useTheme();
  const isWide = useMediaQuery(theme.breakpoints.up("md"));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim() !== "") {
      navigate(`/?search=${searchValue}`);
      if (!isWide) {
        setShowSearch(false);
      }
    }
  };
  const handleLogout = async () => {
    try {
      await axiosCustom.get("/auth/logout");
      setAuth(null);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const getRandomRecipe = async () => {
    try {
      const response = await axios.get("/recipes/random");
      const id = response.data.id_recipe;
      navigate(`/recipe/${id}`);
    } catch (error) {
      console.error("Error fetching random recipe:", error);
    }
  };

  return (
    <AppBar position="static" elevation={3} color="default">
      <Toolbar>
        <Stack direction="row">
          {/* Logo or Title */}
          <Box
            component="img"
            src={logo}
            alt="logo"
            sx={{
              objectFit: "contain",
              height: 60,
              width: "auto",
              mr: 1,
              alignSelf: "center",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          />
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
            onClick={getRandomRecipe}
          />

          <Box display="flex" alignItems="center">
            {isWide ? (
              <form onSubmit={handleSearch}>
                <TextField
                  variant="outlined"
                  inputRef={searchInputRef}
                  size="small"
                  placeholder="Szukaj..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  sx={{ width: "100%" }}
                />
              </form>
            ) : (
              <>
                <NavButton
                  icon={SearchOutlined}
                  text="Szukaj"
                  onClick={() => setShowSearch((prev: boolean) => !prev)}
                />
                {showSearch && (
                  <Collapse
                    in={showSearch}
                    orientation="horizontal"
                    sx={{ width: "100%" }}
                  >
                    <form onSubmit={handleSearch}>
                      <TextField
                        variant="outlined"
                        inputRef={searchInputRef}
                        size="small"
                        placeholder="Szukaj..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        sx={{ width: "100%" }}
                      />
                    </form>
                  </Collapse>
                )}
              </>
            )}
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ ml: "auto" }}>
          {isAuthenticated && auth ? (
            <>
              <NavButton
                icon={Person}
                text={auth.username ?? "Profil"}
                onClick={() => navigate(`/user/${auth.id_user}`)}
              />
              <NavButton icon={Logout} text="Wyloguj" onClick={handleLogout} />
            </>
          ) : (
            <>
              <NavButton
                icon={Login}
                text="Zaloguj"
                onClick={() => navigate("/login")}
              />
              <NavButton
                icon={PersonAdd}
                text="Zarejestruj"
                onClick={() => navigate("/register")}
              />
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
export function NavButton({
  icon: Icon,
  text,
  onClick,
}: {
  icon: React.ElementType;
  text: string;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      color="primary"
      sx={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 1,
      }}
    >
      <Icon sx={{ fontSize: 25 }} />
      <Typography
        variant="caption"
        sx={{ textTransform: "none", fontSize: 12 }}
      >
        {text}
      </Typography>
    </Button>
  );
}
