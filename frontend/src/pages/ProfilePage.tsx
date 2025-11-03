import { Box, Paper, Tabs, Typography, Tab } from "@mui/material";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Recipe, User } from "../utils/types";
import axios from "../api/axios";
import { Favorite, NoteAdd } from "@mui/icons-material";
import RecipeGrid from "../components/RecipeGrid";

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

  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await axios.get(`/users/`, {
        params: { id_user: userId },
      });
      setUser(response.data);
    };
    const fetchUserRecipes = async () => {
      const response = await axios.get(`/recipes`, {
        params: { authorId: userId },
      });
      setUserRecipes(response.data.data);
    };
    const fetchUserFavourites = async () => {
      const response = await axios.get(`/recipes`, {
        params: { favId: userId },
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
        <Typography variant="h3" p={2}>
          {user?.username}
        </Typography>

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
