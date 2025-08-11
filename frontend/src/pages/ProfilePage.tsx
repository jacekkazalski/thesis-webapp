import { Box, Paper, Tabs, Typography, Tab } from "@mui/material";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { User } from "../utils/types";
import axios from "../api/axios";
import { Favorite, NoteAdd } from "@mui/icons-material";

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await axios.get(`/users/`, {
        params: { id_user: userId },
      });
      setUser(response.data);
    };
    fetchUserInfo();
  }, [userId]);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  return (
    <Box sx={{ width: "80%", p: 2, alignContent: "center", mx: "auto" }}>
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
      </Paper>
    </Box>
  );
}
