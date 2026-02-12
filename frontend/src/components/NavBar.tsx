import {
  Add,
  CasinoOutlined,
  HomeOutlined,
  KitchenTwoTone,
  Login,
  Logout,
  Person,
  PersonAdd,
  Schedule,
  SearchOutlined,
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Collapse,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios, { axiosCustom } from '../api/axios';
import useAuth from '../hooks/useAuth';

export default function NavBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const { auth, setAuth } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isAuthenticated = auth && !!auth.accessToken;
  const theme = useTheme();
  const isWide = useMediaQuery(theme.breakpoints.up('md'));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim() !== '') {
      navigate(`/?search=${searchValue}`);
      if (!isWide) {
        setShowSearch(false);
      }
    }
  };
  const handleLogout = async () => {
    try {
      await axiosCustom.get('/auth/logout');
      setAuth(null);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const getRandomRecipe = async () => {
    try {
      const response = await axios.get('/recipes/random');
      const id = response.data.id_recipe;
      navigate(`/recipe/${id}`);
    } catch (error) {
      console.error('Error fetching random recipe:', error);
    }
  };
  const homeReset = () => {
    setSearchValue('');
    navigate({ pathname: '/', search: '' }, { state: { reset: Date.now() } });
  };

  return (
    <AppBar position="static" elevation={3} color="default">
      <Toolbar>
        <Stack direction="row" alignItems="center">
          <Button
            onClick={homeReset}
            color="inherit"
            sx={{
              textTransform: 'none',
              display: 'flex',
              alignItems: 'center',
              mr: 1,
            }}
          >
            <KitchenTwoTone sx={{ fontSize: 50 }} color="primary" />
          </Button>
          <NavButton icon={HomeOutlined} text="Główna" onClick={homeReset} />
          <NavButton icon={Add} text="Dodaj" onClick={() => navigate('/create')} />
          <NavButton icon={Schedule} text="Nowe" onClick={() => navigate('/')} />
          <NavButton icon={CasinoOutlined} text="Losuj" onClick={getRandomRecipe} />

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
                  sx={{ width: '100%' }}
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
                  <Collapse in={showSearch} orientation="horizontal" sx={{ width: '100%' }}>
                    <form onSubmit={handleSearch}>
                      <TextField
                        variant="outlined"
                        inputRef={searchInputRef}
                        size="small"
                        placeholder="Szukaj..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        sx={{ width: '100%' }}
                      />
                    </form>
                  </Collapse>
                )}
              </>
            )}
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
          {isAuthenticated && auth ? (
            <>
              <NavButton
                icon={Person}
                text={auth.username ?? 'Profil'}
                onClick={() => navigate(`/user/${auth.id_user}`)}
              />
              <NavButton icon={Logout} text="Wyloguj" onClick={handleLogout} />
            </>
          ) : (
            <>
              <NavButton icon={Login} text="Zaloguj" onClick={() => navigate('/login')} />
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
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 1,
      }}
    >
      <Icon sx={{ fontSize: 25, color: 'text.primary' }} />
      <Typography
        variant="caption"
        sx={{ textTransform: 'none', fontSize: 12, color: 'text.primary' }}
      >
        {text}
      </Typography>
    </Button>
  );
}
