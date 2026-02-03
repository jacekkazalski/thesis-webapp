import { Box, Paper, Tabs, Typography, Tab, Button, IconButton, Stack, Tooltip } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Recipe, User } from "../utils/types";
import axios from "../api/axios";
import { Favorite, NoteAdd, Settings } from "@mui/icons-material";
import RecipeGrid from "../components/RecipeGrid";
import useAuth from "../hooks/useAuth";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const navigate = useNavigate();
  const {auth} = useAuth();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await axios.get(`/users/`, {
        params: { id_user: userId },
      });
      setUser(response.data);
    };
    const fetchUserRecipes = async () => {
      const response = await axios.get(`/users/recipes`, {
        params: { id_user: userId },
      });
      setUserRecipes(response.data.data);
    };
    const fetchUserFavourites = async () => {
      const response = await axios.get(`/favourites/user`, {
        params: { id_user: userId },
      });
      setFavoriteRecipes(response.data.data);
    };
    fetchUserInfo();
    fetchUserRecipes();
    fetchUserFavourites();
  }, [userId]);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  return (
    <>
      <Paper elevation={3}>
        <Stack direction="row" alignItems="center" justifyContent="start" p={2}>
        <Typography variant="h3" p={2}>
          {user?.username}
        </Typography>
        {auth?.id_user && auth.id_user.toString() === userId && (
          <Tooltip title="Ustawienia">
            <IconButton onClick={() => navigate("/settings")}>
              <Settings />
            </IconButton>
          </Tooltip>
        )}
        </Stack>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab
            icon={<NoteAdd />}
            iconPosition="start"
            label="Dodane przepisy"
          />
          <Tab
            icon={<Favorite />}
            iconPosition="start"
            label="Ulubione przepisy"
          />
        </Tabs>

        <TabPanel index={0} value={tabValue}>
          <RecipeGrid recipes={userRecipes} />
        </TabPanel>
        <TabPanel index={1} value={tabValue}>
          <RecipeGrid recipes={favoriteRecipes} />
        </TabPanel>
      </Paper>
    </>
  );
}
